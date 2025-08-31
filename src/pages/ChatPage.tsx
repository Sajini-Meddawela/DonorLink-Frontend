import React, { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import {
  MessageSquare,
  ArrowLeft,
  Send,
  Search,
  Paperclip,
  X,
  ImageIcon,
  FileText,
  Download,
} from "lucide-react";
import Navbar from "../components/NavBarAuth";
import { ChatService } from "../services/api";

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const {
    chats,
    currentChat,
    messages,
    loading,
    selectChat,
    sendMessage,
    sendMessageWithFile,
    fetchChats,
  } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (chats.length > 0 && !currentChat) {
      selectChat(chats[0]);
    }
  }, [chats, currentChat, selectChat]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert(
          "Only images (JPEG, PNG, GIF) and documents (PDF, DOC, DOCX, TXT) are allowed"
        );
        return;
      }

      setFile(selectedFile);
      e.target.value = ""; 
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" && !file) return;

    let fileData;
    let messageType: "TEXT" | "IMAGE" | "FILE" = "TEXT";
    let content = newMessage;

    if (file) {
      setUploading(true);
      try {
        const uploadResponse = await ChatService.uploadFile(file);
        fileData = uploadResponse;

        if (file.type.startsWith("image/")) {
          messageType = "IMAGE";
          content = file.name;
        } else {
          messageType = "FILE";
          content = file.name;
        }
      } catch (error) {
        console.error("Failed to upload file:", error);
        alert("Failed to upload file. Please try again.");
        setUploading(false);
        return;
      }
    }

    await sendMessageWithFile(content, messageType, fileData);
    setNewMessage("");
    setFile(null);
    setUploading(false);
  };

  const getChatName = (chat: any) => {
    if (user?.role === "DONOR") {
      return chat.careHome?.name || "Care Home";
    } else {
      return chat.donor?.name || "Donor";
    }
  };

  const getLastMessagePreview = (chat: any) => {
    if (chat.messages && chat.messages.length > 0) {
      const lastMessage = chat.messages[0];

      if (lastMessage.messageType === "IMAGE") {
        return "📷 Image";
      } else if (lastMessage.messageType === "FILE") {
        return "📄 File";
      }

      return lastMessage.content.length > 30
        ? `${lastMessage.content.substring(0, 30)}...`
        : lastMessage.content;
    }
    return "No messages yet";
  };

  const filteredChats = chats.filter((chat) => {
    const name = getChatName(chat).toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  if (loading && chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#85C536]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex h-screen pt-20 bg-gray-50">
        {/* Chat List Sidebar */}
        <div className="w-1/3 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Chats</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-full">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {user?.role === "DONOR"
                  ? "You don't have any chat connections yet. Make a donation to a care home to start chatting."
                  : "You don't have any chat connections yet. Donors who contribute to your care home will appear here."}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    currentChat?.id === chat.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => selectChat(chat)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {getChatName(chat)}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {getLastMessagePreview(chat)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-2 text-xs text-gray-400">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </div>
                      {(chat.unreadCount || 0) > 0 && (
                        <span className="ml-2 bg-[#85C536] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center">
                  <button
                    className="md:hidden mr-2"
                    onClick={() => selectChat(null)}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {getChatName(currentChat)}
                  </h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-white">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageSquare
                      size={48}
                      className="mx-auto mb-4 text-gray-300"
                    />
                    <p>No messages yet. Start the conversation!</p>
                    {user?.role === "DONOR" && (
                      <p className="text-sm mt-2">
                        You can message this care home about your donations.
                      </p>
                    )}
                    {user?.role === "CAREHOME" && (
                      <p className="text-sm mt-2">
                        You can message this donor about their contributions.
                      </p>
                    )}
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${
                        message.senderId === user?.id ? "text-right" : ""
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg max-w-xs md:max-w-md ${
                          message.senderId === user?.id
                            ? "bg-[#63C6F7] text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {message.messageType === "TEXT" && (
                          <p className="text-sm">{message.content}</p>
                        )}

                        {message.messageType === "IMAGE" && message.fileUrl && (
                          <div>
                            <img
                              src={`http://localhost:4000${message.fileUrl}`}
                              alt={message.content}
                              className="max-w-full h-auto rounded max-h-48 object-contain"
                            />
                            {message.content && message.content !== "File" && (
                              <p className="text-sm mt-1">{message.content}</p>
                            )}
                          </div>
                        )}

                        {message.messageType === "FILE" && message.fileUrl && (
                          <div className="flex flex-col">
                            <a
                              href={`http://localhost:4000${message.fileUrl}`}
                              download={message.fileName || message.content}
                              className="text-sm flex items-center hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                if (message.mimeType === "application/pdf") {
                                  e.preventDefault();
                                  window.open(
                                    `http://localhost:4000${message.fileUrl}`,
                                    "_blank"
                                  );
                                }
                              }}
                            >
                              <FileText size={16} className="mr-1" />
                              {message.fileName || message.content}
                              <Download size={14} className="ml-1" />
                            </a>
                            {message.fileSize && (
                              <span className="text-xs opacity-75 mt-1">
                                {(message.fileSize / 1024).toFixed(1)} KB
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 bg-white"
              >
                {file && (
                  <div className="mb-2 flex items-center justify-between p-2 bg-gray-100 rounded">
                    <div className="flex items-center">
                      {file.type.startsWith("image/") ? (
                        <ImageIcon size={16} className="mr-2 text-blue-500" />
                      ) : (
                        <FileText size={16} className="mr-2 text-blue-500" />
                      )}
                      <span className="text-sm text-gray-700 truncate max-w-xs">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="flex">
                  <label className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-l-lg px-3 py-2 cursor-pointer">
                    <Paperclip size={20} className="text-gray-600" />
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                  </label>

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                    disabled={uploading}
                  />

                  <button
                    type="submit"
                    disabled={(newMessage.trim() === "" && !file) || uploading}
                    className="bg-[#63C6F7] text-white px-4 py-2 rounded-r-lg hover:bg-[#4fb0e0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a chat to start messaging
                </h3>
                <p className="text-gray-500">
                  {user?.role === "DONOR"
                    ? "Choose a care home you've donated to from the sidebar"
                    : "Choose a donor who has contributed to your care home from the sidebar"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
