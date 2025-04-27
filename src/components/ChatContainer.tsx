
import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Computer, Smartphone } from "lucide-react";

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatContainerProps {
  isMobile?: boolean;
}

export const ChatContainer = ({ isMobile }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Olá! Como posso ajudar?", isUser: false },
  ]);

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    // Simular resposta do bot
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Esta é uma resposta automática de exemplo.", isUser: false },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#1A1F2C] text-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Chat</h1>
        {isMobile ? (
          <Smartphone className="w-6 h-6 text-gray-400" />
        ) : (
          <Computer className="w-6 h-6 text-gray-400" />
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            isUser={msg.isUser}
          />
        ))}
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};
