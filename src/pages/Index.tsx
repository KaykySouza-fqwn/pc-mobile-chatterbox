
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sword, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#1A1F2C] text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">RPG de Texto</h1>
        <p className="text-xl mb-8 text-gray-300">Crie seu personagem e embarque em uma jornada épica</p>
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <Link to="/character-creation">
          <Button className="p-6 bg-[#2B5CF6] hover:bg-[#1a4fea] text-white font-semibold text-lg flex items-center gap-3">
            <Sword className="h-6 w-6" />
            Criar Personagem
          </Button>
        </Link>
        
        <Link to="/game">
          <Button className="p-6 bg-[#6E59A5] hover:bg-[#5a4886] text-white font-semibold text-lg flex items-center gap-3">
            <BookOpen className="h-6 w-6" />
            Continuar Jogo
          </Button>
        </Link>
      </div>
      
      <motion.div 
        className="absolute bottom-10 text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Desenvolvido com IA para uma experiência única de RPG</p>
      </motion.div>
    </div>
  );
};

export default Index;
