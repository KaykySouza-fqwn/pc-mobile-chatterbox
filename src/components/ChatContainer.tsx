
import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Computer, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  text: string;
  isUser: boolean;
  uid?: string;
}

interface ChatContainerProps {
  isMobile?: boolean;
}

interface WebhookResponse {
  reply: string;
  uid: string;
}

export const ChatContainer = ({ isMobile }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Olá! Como posso ajudar?", isUser: false },
  ]);
  const { toast } = useToast();

  const handleSendMessage = async (message: string) => {
    // Adiciona a mensagem do usuário
    setMessages((prev) => [...prev, { text: message, isUser: true }]);

    try {
      const response = await fetch("https://primary-production-458e.up.railway.app/webhook/creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem");
      }

      const data: WebhookResponse = await response.json();
      
      // Adiciona a resposta da IA
      setMessages((prev) => [
        ...prev,
        { text: data.reply, isUser: false, uid: data.uid },
      ]);
    } catch (error) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
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
