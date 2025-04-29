
import { ChatContainer } from "@/components/ChatContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const CharacterCreation = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <Link to="/" className="absolute top-4 left-4 z-10 flex items-center text-white hover:text-blue-400 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Voltar
      </Link>
      <ChatContainer 
        isMobile={isMobile} 
        title="Criação de Personagem" 
        webhookUrl="https://primary-production-458e.up.railway.app/webhook/creation"
        initialMessage="Olá! Vamos criar seu personagem para o RPG. Conte-me como você gostaria que ele fosse."
      />
    </div>
  );
};

export default CharacterCreation;
