import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  MessageCircle, 
  Send, 
  Check, 
  X, 
  Users
} from 'lucide-react';
import { mockSwapRequests } from '../../data/mockData';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  // Filter swap requests for current user
  const userRequests = mockSwapRequests.filter(req => 
    req.toUserId === user?.id || req.fromUserId === user?.id
  );

  const selectedRequestData = selectedRequest 
    ? userRequests.find(req => req.id === selectedRequest)
    : null;

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // In a real app, this would send the message
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const handleAcceptRequest = (requestId: string) => {
    // In a real app, this would update the request status
    alert('Swap request accepted!');
  };

  const handleDeclineRequest = (requestId: string) => {
    // In a real app, this would update the request status
    alert('Swap request declined.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'declined': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages & Swap Requests</h1>
        <p className="text-gray-600">Manage your skill swap conversations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Requests List */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Swap Requests</h2>
          
          {userRequests.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No requests yet</p>
              <p className="text-sm text-gray-400">Start exploring skills to connect!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userRequests.map((request) => {
                const isFromCurrentUser = request.fromUserId === user?.id;
                const otherUser = isFromCurrentUser ? request.toUser : request.fromUser;
                
                return (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRequest === request.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{otherUser.name}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {request.offeredSkill.name} ↔ {request.requestedSkill.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant={getStatusColor(request.status)} size="sm">
                        {request.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Conversation Area */}
        <div className="lg:col-span-2">
          {selectedRequestData ? (
            <Card className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedRequestData.fromUserId === user?.id ? selectedRequestData.toUser.avatar : selectedRequestData.fromUser.avatar}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedRequestData.fromUserId === user?.id ? selectedRequestData.toUser.name : selectedRequestData.fromUser.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedRequestData.offeredSkill.name} ↔ {selectedRequestData.requestedSkill.name}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(selectedRequestData.status)}>
                    {selectedRequestData.status}
                  </Badge>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Initial Request Message */}
                <div className={`flex ${selectedRequestData.fromUserId === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    selectedRequestData.fromUserId === user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{selectedRequestData.message}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(selectedRequestData.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Sample Messages */}
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
                    <p className="text-sm">That sounds great! I'd love to help you with React. When would be a good time for you?</p>
                    <p className="text-xs mt-1 text-gray-600">2:30 PM</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Pending Requests */}
              {selectedRequestData.status === 'pending' && selectedRequestData.toUserId === user?.id && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-3 mb-4">
                    <Button
                      onClick={() => handleAcceptRequest(selectedRequestData.id)}
                      icon={Check}
                      variant="secondary"
                      className="flex-1"
                    >
                      Accept Request
                    </Button>
                    <Button
                      onClick={() => handleDeclineRequest(selectedRequestData.id)}
                      icon={X}
                      variant="outline"
                      className="flex-1"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Input
                    value={messageText}
                    onChange={setMessageText}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    icon={Send}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a swap request to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};