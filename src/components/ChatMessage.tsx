
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  gameStyle?: boolean;
}

export const ChatMessage = ({ message, isUser, gameStyle }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "w-full flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 mb-4",
          isUser
            ? "bg-[#2B5CF6] text-white"
            : gameStyle 
              ? "bg-[#2A2F3C]/90 border border-[#6E59A5]/50 text-white"
              : "bg-[#2A2F3C] text-white",
          gameStyle && "backdrop-blur-sm"
        )}
      >
        {message}
      </div>
    </div>
  );
};
