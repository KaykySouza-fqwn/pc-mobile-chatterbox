
import { ChatContainer } from "@/components/ChatContainer";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-screen overflow-hidden">
      <ChatContainer isMobile={isMobile} />
    </div>
  );
};

export default Index;
