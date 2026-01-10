/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  Phone,
  Video,
  Info,
  Star,
  Trash2,
  CheckCheck,
  Check,
  Circle,
  Filter,
  X,
  ArrowLeft,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Types
interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
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
  userRole: "client" | "photographer" | "admin";
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
      userRole: "client",
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
      userRole: "client",
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
      userRole: "client",
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
      userRole: "photographer",
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: 101,
      text: "Xin chào, tôi muốn đặt lịch chụp ảnh",
      timestamp: "10:30",
      status: "read",
    },
    {
      id: 2,
      senderId: 0, // Admin
      text: "Chào bạn! Tôi có thể giúp gì cho bạn?",
      timestamp: "10:32",
      status: "read",
    },
    {
      id: 3,
      senderId: 101,
      text: "Tôi muốn xem các gói chụp ảnh cưới",
      timestamp: "10:33",
      status: "read",
    },
    {
      id: 4,
      senderId: 0,
      text: "Dạ, chúng tôi có 3 gói chính: Basic, Standard và Premium. Bạn quan tâm gói nào?",
      timestamp: "10:35",
      status: "read",
      attachments: [{ type: "image", url: "", name: "price-list.jpg" }],
    },
    {
      id: 5,
      senderId: 101,
      text: "Cảm ơn anh đã gửi ảnh, rất đẹp!",
      timestamp: "10:40",
      status: "delivered",
    },
  ]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "archived">(
    "all"
  );
  const [showUserInfo, setShowUserInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto select first on Desktop only
  useEffect(() => {
     if (window.innerWidth >= 768 && conversations.length > 0 && !selectedConversation) {
         setSelectedConversation(conversations[0]);
     }
  }, []);
  // Scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversation]); // Scroll khi tin nhắn mới hoặc đổi hội thoại

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: messages.length + 1,
      senderId: 0,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
    
    // Update conversation snippet
    setConversations(conversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: messageInput, lastMessageTime: 'Vừa xong' }
          : conv
    ));
  };

  // Helper functions
  const filteredConversations = conversations.filter((conv) => {
    if (searchTerm && !conv.userName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterType === "unread" && conv.unreadCount === 0) return false;
    if (filterType === "archived" && !conv.isArchived) return false;
    if (filterType === "all" && conv.isArchived) return false;
    return true;
  });

  // Toggle pin
  const togglePin = (convId: number) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === convId ? { ...conv, isPinned: !conv.isPinned } : conv
      )
    );
  };

  // Archive conversation
  const archiveConversation = (convId: number) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === convId ? { ...conv, isArchived: !conv.isArchived } : conv
      )
    );
  };
const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return <Check className="w-3 h-3" />;
      case "delivered": return <CheckCheck className="w-3 h-3" />;
      case "read": return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  return (
    // Dùng 100dvh để chuẩn trên mobile browsers
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex bg-white md:bg-transparent rounded-xl md:rounded-none overflow-hidden md:gap-4 relative">
      
      {/* --- SIDEBAR: LIST CONVERSATIONS --- */}
      {/* Logic: Ẩn trên Mobile nếu đang chọn cuộc trò chuyện */}
      <div className={`
        flex-col w-full md:w-80 lg:w-96 bg-white md:rounded-lg md:shadow-sm md:border border-gray-200
        ${selectedConversation ? 'hidden md:flex' : 'flex'}
      `}>
        {/* Header List */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Tin nhắn</h2>
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {["all", "unread", "archived"].map((type) => (
                <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                    filterType === type ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
                >
                {type === "all" ? "Tất cả" : type === "unread" ? "Chưa đọc" : "Lưu trữ"}
                </button>
            ))}
          </div>
        </div>

        {/* Conversation List Items */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedConversation?.id === conv.id ? "bg-blue-50/60" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
                      {getInitials(conv.userName)}
                    </div>
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <h3 className={`font-semibold text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                            {conv.userName}
                        </h3>
                        {conv.isPinned && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" />}
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{conv.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <Filter className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">Không tìm thấy</p>
            </div>
          )}
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      {/* Logic: Hiển thị trên Mobile nếu có selectedConversation. Luôn hiện trên Desktop */}
      <div className={`
        flex-1 flex-col bg-white md:rounded-lg md:shadow-sm md:border border-gray-200
        ${selectedConversation ? 'flex' : 'hidden md:flex'}
      `}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-3 md:p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Back Button (Mobile Only) */}
                <button 
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    {getInitials(selectedConversation.userName)}
                  </div>
                  {selectedConversation.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">{selectedConversation.userName}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    {selectedConversation.isOnline ? "Online" : "Offline"}
                    <span className="w-1 h-1 bg-gray-300 rounded-full mx-1"></span>
                    <span className="capitalize text-blue-600">{selectedConversation.userRole}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                <button onClick={() => setShowUserInfo(!showUserInfo)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                    <Info className={`w-5 h-5 ${showUserInfo ? 'text-blue-600' : ''}`} />
                </button>
                <div className="hidden md:flex gap-1">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Phone className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Video className="w-5 h-5" /></button>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 scrollbar-thin">
              {messages.map((message) => {
                const isOwn = message.senderId === 0;
                return (
                  <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          isOwn
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                        }`}
                      >
                        <p>{message.text}</p>
                        {message.attachments && (
                            <div className="mt-2 space-y-1">
                                {message.attachments.map((att, i) => (
                                    <div key={i} className={`flex items-center gap-2 p-2 rounded ${isOwn ? 'bg-blue-500' : 'bg-gray-50'}`}>
                                        <ImageIcon className="w-4 h-4" />
                                        <span className="text-xs underline">{att.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 px-1">
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
            <div className="p-3 md:p-4 bg-white border-t border-gray-200 shrink-0">
              <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <div className="flex gap-1 md:gap-2 pb-1">
                    <button className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition"><Paperclip className="w-5 h-5" /></button>
                    <button className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition hidden sm:block"><ImageIcon className="w-5 h-5" /></button>
                </div>
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm resize-none max-h-32 py-2"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State for Desktop */
          <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
               <Send className="w-8 h-8 text-gray-300 ml-1" />
            </div>
            <p className="font-medium text-gray-600">Chọn cuộc trò chuyện</p>
            <p className="text-sm">Bắt đầu tương tác với khách hàng</p>
          </div>
        )}
      </div>

      {/* --- USER INFO SIDEBAR (Responsive Drawer) --- */}
      {/* Mobile: Fixed Overlay | Desktop: Side Column */}
      {selectedConversation && (
        <div className={`
            fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
            md:static md:z-auto md:w-72 md:shadow-none md:border-l border-gray-200 md:transform-none
            ${showUserInfo ? 'translate-x-0' : 'translate-x-full md:hidden'}
        `}>
             <div className="h-full flex flex-col overflow-y-auto">
                 <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                     <h3 className="font-semibold text-gray-900">Chi tiết</h3>
                     <button onClick={() => setShowUserInfo(false)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                         <X className="w-5 h-5" />
                     </button>
                 </div>
                 
                 <div className="p-6 flex flex-col items-center border-b border-gray-100">
                     <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-md">
                        {getInitials(selectedConversation.userName)}
                     </div>
                     <h4 className="font-bold text-gray-900 text-lg">{selectedConversation.userName}</h4>
                     <p className="text-sm text-gray-500">Khách hàng thân thiết</p>
                 </div>

                 <div className="p-4 space-y-4">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase">Liên hệ</p>
                        <div className="flex items-center gap-3 text-sm text-gray-700 p-2 hover:bg-gray-50 rounded">
                            <span className="truncate">user@example.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700 p-2 hover:bg-gray-50 rounded">
                            <span>0909 123 456</span>
                        </div>
                    </div>

                    <div className="space-y-1 pt-2">
                         <p className="text-xs font-semibold text-gray-400 uppercase">File đã gửi</p>
                         <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                             <div className="bg-white p-1.5 rounded border border-gray-200">
                                 <ImageIcon className="w-4 h-4 text-blue-500" />
                             </div>
                             <div className="flex-1 min-w-0">
                                 <p className="text-sm font-medium truncate">hop-dong-v1.pdf</p>
                                 <p className="text-xs text-gray-500">2.4 MB • 10:30 AM</p>
                             </div>
                         </div>
                    </div>
                 </div>
                 
                 <div className="mt-auto p-4 border-t border-gray-100 space-y-2">
                     <button className="w-full py-2 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition text-sm font-medium">
                         <Trash2 className="w-4 h-4" /> Xóa hội thoại
                     </button>
                 </div>
             </div>
        </div>
      )}
      
      {/* Mobile Overlay for User Info */}
      {showUserInfo && (
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setShowUserInfo(false)}
          />
      )}
    </div>
  );
}
