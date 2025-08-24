import React, { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, ArrowLeft, Send, Search } from "lucide-react";
import Navbar from "../components/NavBarAuth";

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const {
    chats,
    currentChat,
    messages,
    loading,
    selectChat,
    sendMessage,
    fetchChats,
  } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (chats.length > 0 && !currentChat) {
      selectChat(chats[0]);
    }
  }, [chats, currentChat, selectChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    await sendMessage(newMessage);
    setNewMessage("");
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
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {getChatName(chat)}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {getLastMessagePreview(chat)}
                      </p>
                    </div>
                    <div className="ml-2 text-xs text-gray-400">
                      {new Date(chat.updatedAt).toLocaleDateString()}
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
                            ? "bg-[#85C536] text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
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
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  />
                  <button
                    type="submit"
                    disabled={newMessage.trim() === ""}
                    className="bg-[#63C6F7] text-white px-4 py-2 rounded-r-lg hover:bg-[#4fb0e0] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
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
