'use client';

import { 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Smile,
  Phone,
  Video,
  Info,
  Archive,
  Star,
  Trash2,
  CheckCheck,
  Check,
  Circle,
  Filter,
  X
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Types
interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: { type: string; url: string; name: string }[];
}

interface Conversation {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  isArchived: boolean;
  userRole: 'client' | 'photographer' | 'admin';
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      userId: 101,
      userName: "Nguyễn Văn A",
      userAvatar: "",
      lastMessage: "Cảm ơn anh đã gửi ảnh, rất đẹp!",
      lastMessageTime: "2 phút trước",
      unreadCount: 3,
      isOnline: true,
      isPinned: true,
      isArchived: false,
      userRole: 'client'
    },
    {
      id: 2,
      userId: 102,
      userName: "Trần Thị B",
      userAvatar: "",
      lastMessage: "Cho em hỏi về gói chụp ảnh cưới...",
      lastMessageTime: "15 phút trước",
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      isArchived: false,
      userRole: 'client'
    },
    {
      id: 3,
      userId: 103,
      userName: "Lê Văn C",
      userAvatar: "",
      lastMessage: "Khi nào có lịch chụp ạ?",
      lastMessageTime: "1 giờ trước",
      unreadCount: 1,
      isOnline: true,
      isPinned: false,
      isArchived: false,
      userRole: 'client'
    },
    {
      id: 4,
      userId: 104,
      userName: "Photographer Pro",
      userAvatar: "",
      lastMessage: "Đã gửi file raw cho bạn",
      lastMessageTime: "2 giờ trước",
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      isArchived: false,
      userRole: 'photographer'
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: 101,
      text: "Xin chào, tôi muốn đặt lịch chụp ảnh",
      timestamp: "10:30",
      status: 'read'
    },
    {
      id: 2,
      senderId: 0, // Admin
      text: "Chào bạn! Tôi có thể giúp gì cho bạn?",
      timestamp: "10:32",
      status: 'read'
    },
    {
      id: 3,
      senderId: 101,
      text: "Tôi muốn xem các gói chụp ảnh cưới",
      timestamp: "10:33",
      status: 'read'
    },
    {
      id: 4,
      senderId: 0,
      text: "Dạ, chúng tôi có 3 gói chính: Basic, Standard và Premium. Bạn quan tâm gói nào?",
      timestamp: "10:35",
      status: 'read',
      attachments: [
        { type: 'image', url: '', name: 'price-list.jpg' }
      ]
    },
    {
      id: 5,
      senderId: 101,
      text: "Cảm ơn anh đã gửi ảnh, rất đẹp!",
      timestamp: "10:40",
      status: 'delivered'
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0]
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'archived'>('all');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: messages.length + 1,
      senderId: 0, // Admin
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    // Update conversation
    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: messageInput, lastMessageTime: 'Vừa xong' }
        : conv
    ));
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    // Search filter
    if (searchTerm && !conv.userName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filterType === 'unread' && conv.unreadCount === 0) {
      return false;
    }
    if (filterType === 'archived' && !conv.isArchived) {
      return false;
    }
    if (filterType === 'all' && conv.isArchived) {
      return false;
    }

    return true;
  });

  // Toggle pin
  const togglePin = (convId: number) => {
    setConversations(conversations.map(conv =>
      conv.id === convId ? { ...conv, isPinned: !conv.isPinned } : conv
    ));
  };

  // Archive conversation
  const archiveConversation = (convId: number) => {
    setConversations(conversations.map(conv =>
      conv.id === convId ? { ...conv, isArchived: !conv.isArchived } : conv
    ));
  };

  // Get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Tin nhắn</h2>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filterType === 'unread'
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Chưa đọc
            </button>
            <button
              onClick={() => setFilterType('archived')}
              className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filterType === 'archived'
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Lưu trữ
            </button>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {getInitials(conv.userName)}
                    </div>
                    {conv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {conv.userName}
                        </h3>
                        {conv.isPinned && (
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    {/* Role badge */}
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                      conv.userRole === 'client' ? 'bg-green-100 text-green-700' :
                      conv.userRole === 'photographer' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {conv.userRole === 'client' ? 'Khách hàng' :
                       conv.userRole === 'photographer' ? 'Photographer' : 'Admin'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
              <Filter className="w-12 h-12 mb-2" />
              <p className="text-sm text-center">Không tìm thấy cuộc hội thoại</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {getInitials(selectedConversation.userName)}
                </div>
                {selectedConversation.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedConversation.userName}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedConversation.isOnline ? 'Đang hoạt động' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => togglePin(selectedConversation.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Ghim"
              >
                <Star className={`w-5 h-5 ${selectedConversation.isPinned ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Gọi thoại">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Video call">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setShowUserInfo(!showUserInfo)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Thông tin"
              >
                <Info className="w-5 h-5 text-gray-600" />
              </button>
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button 
                    onClick={() => archiveConversation(selectedConversation.id)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Archive className="w-4 h-4" />
                    {selectedConversation.isArchived ? 'Bỏ lưu trữ' : 'Lưu trữ'}
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                    Xóa cuộc trò chuyện
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => {
              const isOwn = message.senderId === 0; // Admin messages
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((att, idx) => (
                            <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${
                              isOwn ? 'bg-blue-500' : 'bg-gray-100'
                            }`}>
                              <ImageIcon className="w-4 h-4" />
                              <span className="text-xs truncate">{att.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                      isOwn ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{message.timestamp}</span>
                      {isOwn && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors shrink-0"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium">Chọn một cuộc trò chuyện</p>
            <p className="text-sm">Chọn từ danh sách bên trái để bắt đầu</p>
          </div>
        </div>
      )}

      {/* User Info Sidebar */}
      {showUserInfo && selectedConversation && (
        <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Thông tin người dùng</h3>
            <button 
              onClick={() => setShowUserInfo(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
              {getInitials(selectedConversation.userName)}
            </div>
            <h4 className="font-semibold text-lg text-gray-900">
              {selectedConversation.userName}
            </h4>
            <span className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
              selectedConversation.userRole === 'client' ? 'bg-green-100 text-green-700' :
              selectedConversation.userRole === 'photographer' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {selectedConversation.userRole === 'client' ? 'Khách hàng' :
               selectedConversation.userRole === 'photographer' ? 'Photographer' : 'Admin'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-gray-900">user@example.com</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Điện thoại</label>
              <p className="text-gray-900">+84 123 456 789</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Tham gia</label>
              <p className="text-gray-900">15/01/2025</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Trạng thái</label>
              <p className="text-gray-900">
                {selectedConversation.isOnline ? 'Đang hoạt động' : 'Offline'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">File đã chia sẻ</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">wedding-photos.zip</p>
                  <p className="text-xs text-gray-500">2.5 MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}