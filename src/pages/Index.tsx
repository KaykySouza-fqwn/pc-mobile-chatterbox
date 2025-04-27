
import { ChatContainer } from "@/components/ChatContainer";

const Index = () => {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-black">
      <div className="w-full md:w-1/2 p-4">
        <ChatContainer />
      </div>
      <div className="w-full md:w-1/2 p-4">
        <ChatContainer isMobile={true} />
      </div>
    </div>
  );
};

export default Index;
