
import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Computer, Smartphone, BookOpen, Sword, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  text: string;
  isUser: boolean;
  uid?: string;
}

interface GameChatProps {
  isMobile?: boolean;
  initialMessage?: string;
}

interface WebhookResponse {
  reply: string;
  uid: string;
}

export const GameChat = ({ 
  isMobile, 
  initialMessage = "Bem-vindo à sua aventura! O que você deseja fazer?"
}: GameChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: initialMessage, isUser: false },
  ]);
  const { toast } = useToast();

  const handleSendMessage = async (message: string) => {
    // Adiciona a mensagem do usuário
    setMessages((prev) => [...prev, { text: message, isUser: true }]);

    try {
      const response = await fetch("https://primary-production-458e.up.railway.app/webhook/chat/message", {
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
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#2A2F3C]">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-[#9b87f5]" />
          <h1 className="text-xl font-semibold">Narração do Jogo</h1>
        </div>
        <div className="flex gap-2">
          <Shield className="w-5 h-5 text-[#9b87f5]" />
          <Sword className="w-5 h-5 text-[#9b87f5]" />
          {isMobile ? (
            <Smartphone className="w-5 h-5 text-gray-400" />
          ) : (
            <Computer className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1A1F2C] bg-opacity-90 bg-[url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-blend-overlay">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            isUser={msg.isUser}
            gameStyle={true}
          />
        ))}
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        placeholder="O que você fará a seguir?"
        buttonVariant="rpg"
      />
    </div>
  );
};
