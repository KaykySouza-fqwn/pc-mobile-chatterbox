
import { Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  buttonVariant?: "default" | "rpg";
}

export const ChatInput = ({ 
  onSendMessage, 
  placeholder = "Digite sua mensagem...", 
  buttonVariant = "default" 
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-800">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-[#2A2F3C] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className={cn(
          "text-white p-2 rounded-lg transition-colors",
          buttonVariant === "default" 
            ? "bg-[#2B5CF6] hover:bg-blue-600" 
            : "bg-[#6E59A5] hover:bg-[#5a4886]"
        )}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};
