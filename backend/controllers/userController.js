const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Skill = require('../models/skillModel');
const tokenize = require('../utils/tokenizer');
const { generateUsername } = require("unique-username-generator");

async function getUniqueUsername() {
    let username, condition
    do {
        username = generateUsername("", 0, 15)
        condition = await User.findOne({ username })
    } while (condition)
    return username
}

const login = async (req, res) => {
    try {
        const allSkills = await Skill.find();
        const userExists = await User.findOne({ email: req.body.email });
        if (!userExists) return res.status(404).send("User does not exist");

        const passwordMatches = await bcrypt.compare(req.body.password, userExists.password);
        if (!passwordMatches) return res.status(401).send("Wrong password or email address");

        const matchNames = await Promise.all(
            userExists.matches.map(async (id) => {
                const user = await User.findById(id);
                return user?.username || "";
            })
        );

        const expiresInMs = 3600000;
        const token = tokenize(userExists.username, userExists.email, expiresInMs);

        res.clearCookie('token', { httpOnly: true, sameSite: 'Lax', secure: false });
        res.cookie('token', token, { httpOnly: true, maxAge: expiresInMs, sameSite: 'Lax', secure: false });

        const profile = {
            fname: userExists.fname,
            lname: userExists.lname,
            username: userExists.username,
            email: userExists.email,
            skills: userExists.skills.map(id => allSkills.find(skill => skill._id.equals(id))?.name),
            interests: userExists.interests.map(id => allSkills.find(skill => skill._id.equals(id))?.name),
            matches: matchNames,
            bio: userExists.bio,
            notifications: userExists.notifications
        };

        return res.status(200).json(profile);
    } catch (e) {
        res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax' });
        return res.status(500).json({ message: e.message });
    }
};

const registerUser = async (req, res) => {
    const username = await getUniqueUsername();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
        const { fname, lname, email, password } = req.body;
        if (fname?.length < 20 && lname?.length < 20 && emailRegex.test(email) && password?.length >= 6 && password.length < 20) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ ...req.body, password: hashedPassword, username });
            return res.status(200).json("User created!");
        } else {
            return res.status(401).send({ message: "Rejected user creation, input criteria not followed!" });
        }
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const viewProfile = async (req, res) => {
    try {
        const allSkills = await Skill.find();
        const query = req.body._id ? { _id: req.body._id } : req.body.username ? { username: req.body.username } : null;
        if (!query) return res.status(400).json({ error: 'Missing identifier' });

        const user = await User.findOne(query).populate('skills').populate('interests');
        if (!user) return res.status(404).json({ error: 'User not found' });

        const matchNames = await Promise.all(user.matches.map(async id => {
            const matchedUser = await User.findById(id);
            return matchedUser?.username || "";
        }));

        const profile = {
            fname: user.fname,
            lname: user.lname,
            username: user.username,
            email: user.email,
            skills: user.skills,
            interests: user.interests,
            matches: matchNames,
            bio: user.bio,
            notifications: user.notifications
        };

        res.status(200).json(profile);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getMatches = async (req, res) => {
    try {
        const user = await User.findById(req.body._id);
        const matchList = await Promise.all(user.matches.map(id => User.findById(id)));
        const matches = matchList.map(match => ({
            name: `${match.fname} ${match.lname}`,
            username: match.username
        }));
        return res.status(200).json(matches.length ? matches : "No matches yet :(");
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const editUserProfile = async (req, res) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
        const { fname, lname, email, username, bio, skills, interests } = req.body;
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });
        if (username.length < 4 || username.length > 15) return res.status(400).json({ message: 'Username must be 4-15 chars' });

        const existingUsername = await User.findOne({ username, _id: { $ne: userId } });
        if (existingUsername) return res.status(400).json({ message: 'Username already taken' });

        const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
        if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

        await User.findByIdAndUpdate(userId, { fname, lname, email, username, bio, skills, interests }, { new: true });

        const token = tokenize(username, email);
        res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'Lax', secure: false });

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const updateUserSkills = async (req, res) => {
    try {
        const userId = req.user?._id;
        let { skills } = req.body;
        if (!userId || !skills) return res.status(400).json({ success: false, message: 'Missing required fields.' });

        if (!Array.isArray(skills)) skills = [skills];

        const skillIds = (await Promise.all(skills.map(async name => (await Skill.findOne({ name }))?._id))).filter(Boolean);
        await User.findByIdAndUpdate(userId, { $addToSet: { skills: { $each: skillIds } } });

        return res.status(200).json({ success: true, message: 'Skills updated successfully.' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const updateUserInterests = async (req, res) => {
    try {
        const userId = req.user?._id;
        let { interests } = req.body;
        if (!userId || !interests) return res.status(400).json({ success: false, message: 'Missing required fields.' });

        if (!Array.isArray(interests)) interests = [interests];

        const interestIds = (await Promise.all(interests.map(async name => (await Skill.findOne({ name }))?._id))).filter(Boolean);
        await User.findByIdAndUpdate(userId, { $addToSet: { interests: { $each: interestIds } } });

        return res.status(200).json({ success: true, message: 'Interests updated successfully.' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax' });
        return res.status(200).json({ message: 'Logged out successfully!' });
    } catch (err) {
        res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax' });
        return res.status(400).json({ message: 'Failed to logout!' });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = req.user?.notifications || [];
        return res.status(200).json({ notifications });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

module.exports = {
    registerUser,
    viewProfile,
    getMatches,
    login,
    editUserProfile,
    updateUserSkills,
    updateUserInterests,
    logout,
    getNotifications
};
