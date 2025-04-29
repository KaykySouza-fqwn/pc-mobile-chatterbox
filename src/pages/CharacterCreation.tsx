
import { useState, useEffect } from "react";
import { ChatContainer } from "@/components/ChatContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const CharacterCreation = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreationComplete, setIsCreationComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [characterUid, setCharacterUid] = useState<string | null>(null);

  // Load character UID from localStorage if available
  useEffect(() => {
    const storedUid = localStorage.getItem('character_uid');
    if (storedUid) {
      setCharacterUid(storedUid);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Function to check if character creation is complete
  const checkCreationStatus = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('section_id')
        .eq('character_id', uid)
        .maybeSingle();

      if (error) throw error;
      
      if (data && data.section_id === 8) {
        setIsCreationComplete(true);
        toast({
          title: "Criação Completa!",
          description: "Seu personagem está pronto para começar a aventura.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Erro ao verificar status da criação:", error);
    }
  };

  // Poll for character creation status
  useEffect(() => {
    if (!characterUid) return;

    const checkInterval = setInterval(() => {
      checkCreationStatus(characterUid);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkInterval);
  }, [characterUid]);

  // Handle new message response with UID
  const handleMessageResponse = (uid: string) => {
    if (!characterUid && uid) {
      setCharacterUid(uid);
      localStorage.setItem('character_uid', uid);
      checkCreationStatus(uid);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <Link to="/" className="absolute top-4 left-4 z-10 flex items-center text-white hover:text-blue-400 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Voltar
      </Link>

      {isCreationComplete && (
        <div className="absolute top-4 right-4 z-10">
          <Button 
            onClick={() => navigate('/game')}
            className="bg-green-600 hover:bg-green-700"
          >
            Iniciar Aventura
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ) : (
        <ChatContainer 
          isMobile={isMobile} 
          title="Criação de Personagem" 
          webhookUrl="https://primary-production-458e.up.railway.app/webhook/creation"
          initialMessage="Olá! Vamos criar seu personagem para o RPG. Conte-me como você gostaria que ele fosse."
          onMessageResponse={handleMessageResponse}
        />
      )}
    </div>
  );
};

export default CharacterCreation;
