
import { GameChat } from "@/components/GameChat";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const Game = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <Link to="/" className="absolute top-4 left-4 z-10 flex items-center text-white hover:text-blue-400 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Voltar
      </Link>
      <GameChat 
        isMobile={isMobile}
        initialMessage="O narrador está pronto para começar sua jornada. O que você gostaria de fazer?"
      />
    </div>
  );
};

export default Game;
