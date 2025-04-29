
import { useEffect, useState } from "react";
import { GameChat } from "@/components/GameChat";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Game = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [characterName, setCharacterName] = useState<string>("aventureiro");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const characterUid = localStorage.getItem('character_uid');
    
    if (!characterUid) {
      toast({
        title: "Personagem não encontrado",
        description: "Por favor, crie um personagem primeiro.",
        variant: "destructive",
      });
      navigate('/character-creation');
      return;
    }

    const fetchCharacterInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('characters')
          .select('name, section_id')
          .eq('character_id', characterUid)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          // Check if character creation is complete
          if (data.section_id !== 8) {
            toast({
              title: "Criação incompleta",
              description: "Por favor, complete a criação do seu personagem.",
              variant: "destructive",
            });
            navigate('/character-creation');
            return;
          }
          
          setCharacterName(data.name || "aventureiro");
        }
      } catch (error) {
        console.error("Erro ao buscar informações do personagem:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterInfo();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#1A1F2C] text-white">
        <div className="text-xl">Carregando sua aventura...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <Link to="/" className="absolute top-4 left-4 z-10 flex items-center text-white hover:text-blue-400 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Voltar
      </Link>
      <GameChat 
        isMobile={isMobile}
        initialMessage={`Bem-vindo à sua aventura, ${characterName}! O narrador está pronto para começar sua jornada. O que você gostaria de fazer?`}
      />
    </div>
  );
};

export default Game;
