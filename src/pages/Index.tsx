
import { ChatContainer } from "@/components/ChatContainer";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex w-full min-h-screen bg-black">
      <div className="w-full p-4">
        <ChatContainer isMobile={isMobile} />
      </div>
    </div>
  );
};

export default Index;
