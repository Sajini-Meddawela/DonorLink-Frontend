import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { ChatService } from "../services/api";
import socket from "../services/socket";
import { Chat, Message } from "../Types/types";

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  unreadChatCount: number;
  selectChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => Promise<void>;
  sendMessageWithFile: (
    content: string, 
    messageType: "TEXT" | "IMAGE" | "FILE", 
    fileData?: { fileUrl: string; fileName: string; fileSize: number; mimeType: string }
  ) => Promise<void>;
  fetchChats: () => Promise<void>;
  markAsRead: (chatId: number) => Promise<void>;
  fetchUnreadChatCount: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchChats();
      fetchUnreadChatCount();
    }
  }, [user]);

  useEffect(() => {
    if (currentChat) {
      socket.emit("join_chat", currentChat.id);

      loadChatMessages(currentChat.id);

      socket.on("new_message", handleNewMessage);

      return () => {
        socket.emit("leave_chat", currentChat.id);
        socket.off("new_message", handleNewMessage);
      };
    }
  }, [currentChat]);

  const fetchUnreadChatCount = async () => {
    try {
      const count = await ChatService.getUnreadChatCount();
      setUnreadChatCount(count);
    } catch (error) {
      console.error("Failed to fetch unread chat count:", error);
    }
  };

  const handleNewMessage = (message: Message) => {
    if (message.chatId === currentChat?.id) {
      setMessages((prev) => [...prev, message]);
      
      if (message.senderId !== user?.id) {
        markAsRead(currentChat!.id);
      }
    }

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === message.chatId) {
          const updatedChat = {
            ...chat,
            messages: [message],
            updatedAt: new Date().toISOString(),
          };
          
          if (chat.id !== currentChat?.id && message.senderId !== user?.id) {
            updatedChat.unreadCount = (chat.unreadCount || 0) + 1;
          }
          
          return updatedChat;
        }
        return chat;
      })
    );

    if (message.senderId !== user?.id && message.chatId !== currentChat?.id) {
      setUnreadChatCount(prev => prev + 1);
    }
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      const userChats = await ChatService.getUserChats();

      const validChats = userChats.filter((chat) => chat !== null);

      setChats(validChats);

      if (!currentChat && validChats.length > 0) {
        setCurrentChat(validChats[0]);

        try {
          const chatMessages = await ChatService.getChatMessages(
            validChats[0].id
          );
          setMessages(chatMessages);
        } catch (err) {
          console.error("Error fetching messages for first chat:", err);
        }
      }
    } catch (err) {
      setError("Failed to fetch chats");
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadChatMessages = async (chatId: number) => {
    try {
      setLoading(true);
      const chatMessages = await ChatService.getChatMessages(chatId);
      setMessages(chatMessages);
    } catch (err) {
      setError("Failed to fetch messages");
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (chatId: number) => {
    try {
      await ChatService.markMessagesAsRead(chatId);
      
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ));
      
      fetchUnreadChatCount();
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  const selectChat = (chat: Chat | null) => {
    setCurrentChat(chat);
    if (chat) {
      loadChatMessages(chat.id);
      markAsRead(chat.id);
    } else {
      setMessages([]);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat) return;

    try {
      const newMessage = await ChatService.sendMessage(currentChat.id, content);
      setMessages((prev) => [...prev, newMessage]);

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === currentChat.id) {
            return {
              ...chat,
              messages: [newMessage],
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        })
      );
    } catch (err) {
      setError("Failed to send message");
      console.error("Error sending message:", err);
    }
  };

  const sendMessageWithFile = async (
    content: string, 
    messageType: "TEXT" | "IMAGE" | "FILE" = "TEXT", 
    fileData?: { fileUrl: string; fileName: string; fileSize: number; mimeType: string }
  ) => {
    if (!currentChat) return;

    try {
      const newMessage = await ChatService.sendMessageWithFile(
        currentChat.id, 
        content, 
        messageType, 
        fileData
      );
      
      setMessages((prev) => [...prev, newMessage]);

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === currentChat.id) {
            return {
              ...chat,
              messages: [newMessage],
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        })
      );
    } catch (err) {
      setError("Failed to send message");
      console.error("Error sending message:", err);
    }
  };

  const value: ChatContextType = {
    chats,
    currentChat,
    messages,
    loading,
    error,
    unreadChatCount,
    selectChat,
    sendMessage,
    sendMessageWithFile,
    fetchChats,
    markAsRead,
    fetchUnreadChatCount,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};