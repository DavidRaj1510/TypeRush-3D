
import React from 'react';
import { PlayerStats, OpponentStats, GameMode, Boss } from '../types/gameTypes';
import { Progress } from "@/components/ui/progress";
import { Clock, ZapIcon, Crosshair, Trophy } from 'lucide-react';
import { cn } from "@/lib/utils";

interface GameHudProps {
  timeLeft: number;
  playerStats: PlayerStats;
  opponentStats: OpponentStats;
  gameMode: GameMode;
  isBossBattle: boolean;
  currentBoss: Boss | null;
}

const GameHud: React.FC<GameHudProps> = ({ 
  timeLeft, 
  playerStats, 
  opponentStats, 
  gameMode,
  isBossBattle,
  currentBoss
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4">
      {/* Top bar with time and score */}
      <div className="flex justify-between items-center mb-4">
        {/* Timer */}
        <div className="bg-gray-900 bg-opacity-80 p-2 rounded-lg flex items-center">
          <Clock size={18} className="mr-2 text-yellow-400" />
          <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
        </div>
        
        {/* Score */}
        <div className="bg-gray-900 bg-opacity-80 p-2 rounded-lg flex items-center">
          <Trophy size={18} className="mr-2 text-yellow-400" />
          <span className="text-xl font-bold">{playerStats.score}</span>
        </div>
      </div>
      
      {/* Player stats section */}
      <div className="flex justify-between mb-4">
        <div className="bg-gray-900 bg-opacity-70 p-2 rounded-lg">
          <div className="flex items-center text-sm text-gray-300">
            <ZapIcon size={14} className="mr-1 text-blue-400" />
            <span>WPM: {playerStats.wpm || 0}</span>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-70 p-2 rounded-lg">
          <div className="flex items-center text-sm text-gray-300">
            <Crosshair size={14} className="mr-1 text-green-400" />
            <span>Accuracy: {playerStats.accuracy || 0}%</span>
          </div>
        </div>
      </div>
      
      {/* XP and level progress (bottom of screen) */}
      <div className="absolute bottom-20 left-4 right-4">
        <div className="bg-gray-900 bg-opacity-70 p-2 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-300">Level {playerStats.level}</span>
            <span className="text-xs text-gray-300">
              XP: {playerStats.xp}/{playerStats.xpToNextLevel}
            </span>
          </div>
          <Progress 
            value={(playerStats.xp / playerStats.xpToNextLevel) * 100} 
            className="h-2 bg-gray-700"
          />
        </div>
      </div>
      
      {/* Multiplayer opponent stats */}
      {gameMode === 'multiplayer' && !isBossBattle && (
        <div className="absolute top-16 right-4 bg-gray-900 bg-opacity-80 p-2 rounded-lg">
          <div className="text-sm font-bold text-gray-300 mb-1">
            {opponentStats.name}: {opponentStats.stats.score}
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <ZapIcon size={12} className="mr-1 text-blue-400" />
            <span>WPM: {opponentStats.stats.wpm || 0}</span>
          </div>
        </div>
      )}
      
      {/* Boss health bar (if in boss battle) */}
      {isBossBattle && currentBoss && (
        <div className="absolute top-16 left-4 right-4">
          <div className="bg-gray-900 bg-opacity-80 p-2 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-red-400">{currentBoss.name}</span>
              <span className="text-xs">
                {currentBoss.health}/{currentBoss.maxHealth} HP
              </span>
            </div>
            <Progress 
              value={(currentBoss.health / currentBoss.maxHealth) * 100} 
              className={cn("h-3 bg-gray-700")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHud;
