
import React, { useState } from 'react';
import { GameMode, Difficulty, PlayerStats } from '../types/gameTypes';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { UserIcon, Users, Swords, Cog } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OptionsScreenProps {
  onStartGame: (mode: GameMode, difficulty: Difficulty, duration: number, bossBattle: boolean) => void;
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  bossesDefeated: number;
}

const OptionsScreen: React.FC<OptionsScreenProps> = ({ 
  onStartGame,
  playerStats,
  setPlayerStats,
  bossesDefeated
}) => {
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('single');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [isBossBattle, setIsBossBattle] = useState(false);
  
  const handleStartGame = () => {
    onStartGame(selectedGameMode, selectedDifficulty, selectedDuration, isBossBattle);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800 bg-opacity-80 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-2">
            TypeRush3D
          </h1>
          <p className="text-gray-300 text-lg">
            Type words as they fly through space
          </p>
        </div>
        
        <div className="space-y-6 mb-8">
          {/* Main game modes - updated with more visible colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant={selectedGameMode === 'single' ? "default" : "outline"} 
              className={`h-32 flex flex-col items-center justify-center ${
                selectedGameMode === 'single' 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white' 
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
              onClick={() => {
                setSelectedGameMode('single');
                setIsBossBattle(false);
              }}
            >
              <UserIcon size={32} className="mb-2" />
              <span className="text-lg font-semibold">Single Player</span>
              <span className="text-xs opacity-75">Race against an AI ghost</span>
            </Button>
            
            <Button 
              variant={selectedGameMode === 'multiplayer' ? "default" : "outline"} 
              className={`h-32 flex flex-col items-center justify-center ${
                selectedGameMode === 'multiplayer' 
                  ? 'bg-gradient-to-br from-green-600 to-teal-700 text-white' 
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
              onClick={() => {
                setSelectedGameMode('multiplayer');
                setIsBossBattle(false);
              }}
            >
              <Users size={32} className="mb-2" />
              <span className="text-lg font-semibold">Multiplayer</span>
              <span className="text-xs opacity-75">Compete with other players</span>
            </Button>
          </div>
          
          <Separator className="my-4 bg-gray-600" />
          
          <Button 
            variant={isBossBattle ? "default" : "outline"} 
            className={`w-full h-24 flex items-center justify-center ${
              isBossBattle 
                ? 'bg-gradient-to-br from-red-600 to-orange-700 text-white' 
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
            onClick={() => {
              setIsBossBattle(true);
              setSelectedGameMode('single');
            }}
          >
            <div className="flex items-center">
              <div className="mr-4">
                <Swords size={40} />
              </div>
              <div className="text-left">
                <div className="text-lg font-semibold">Boss Battle</div>
                <div className="text-xs opacity-75">
                  Defeat powerful bosses to earn rewards
                </div>
              </div>
            </div>
          </Button>
        </div>
        
        {/* Settings Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full mb-4 flex items-center justify-center bg-gray-700 text-gray-200 hover:bg-gray-600"
            >
              <Cog className="mr-2" size={16} />
              Game Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Game Settings</DialogTitle>
              <DialogDescription className="text-gray-300">
                Customize your game experience
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="difficulty" className="mt-4">
              <TabsList className="w-full grid grid-cols-2 mb-6 bg-gray-700">
                <TabsTrigger value="difficulty" className="text-sm">Difficulty</TabsTrigger>
                <TabsTrigger value="duration" className="text-sm">Duration</TabsTrigger>
              </TabsList>
              
              {/* Difficulty Tab - Fixed colors for better visibility */}
              <TabsContent value="difficulty" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant={selectedDifficulty === 'easy' ? "default" : "outline"} 
                    className={`h-24 flex flex-col items-center justify-center ${
                      selectedDifficulty === 'easy' 
                        ? 'bg-gradient-to-br from-green-500 to-green-700 text-white' 
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedDifficulty('easy')}
                  >
                    <span className="font-semibold">Easy</span>
                    <span className="text-xs opacity-75">Slower words, fewer challenges</span>
                  </Button>
                  <Button 
                    variant={selectedDifficulty === 'medium' ? "default" : "outline"} 
                    className={`h-24 flex flex-col items-center justify-center ${
                      selectedDifficulty === 'medium' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' 
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedDifficulty('medium')}
                  >
                    <span className="font-semibold">Medium</span>
                    <span className="text-xs opacity-75">Balanced speed and difficulty</span>
                  </Button>
                  <Button 
                    variant={selectedDifficulty === 'hard' ? "default" : "outline"} 
                    className={`h-24 flex flex-col items-center justify-center ${
                      selectedDifficulty === 'hard' 
                        ? 'bg-gradient-to-br from-red-500 to-red-700 text-white' 
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedDifficulty('hard')}
                  >
                    <span className="font-semibold">Hard</span>
                    <span className="text-xs opacity-75">Fast words, tough challenges</span>
                  </Button>
                </div>
              </TabsContent>
              
              {/* Duration Tab - Fixed colors for better visibility */}
              <TabsContent value="duration" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[30, 60, 120, 180, 300].map((time) => (
                    <Button 
                      key={time}
                      variant={selectedDuration === time ? "default" : "outline"} 
                      className={selectedDuration === time 
                        ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white' 
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }
                      onClick={() => setSelectedDuration(time)}
                    >
                      {time < 60 ? `${time} seconds` : `${time / 60} minute${time > 60 ? 's' : ''}`}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 text-sm text-blue-400 flex justify-between">
              <span>Player Level: {playerStats.level}</span>
              <span>Bosses Defeated: {bossesDefeated}</span>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          size="lg" 
          onClick={handleStartGame}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 text-lg"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default OptionsScreen;
