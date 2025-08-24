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
  selectChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => Promise<void>;
  fetchChats: () => Promise<void>;
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
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchChats();
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

  const handleNewMessage = (message: Message) => {
    if (message.chatId === currentChat?.id) {
      setMessages((prev) => [...prev, message]);
    }

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === message.chatId) {
          return {
            ...chat,
            messages: [message],
            updatedAt: new Date().toISOString(),
          };
        }
        return chat;
      })
    );
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      const userChats = await ChatService.getUserChats();

      // Filter out any null values that might come from the API
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

  const selectChat = (chat: Chat | null) => {
    setCurrentChat(chat);
    if (chat) {
      loadChatMessages(chat.id);
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

  const value: ChatContextType = {
    chats,
    currentChat,
    messages,
    loading,
    error,
    selectChat,
    sendMessage,
    fetchChats,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
