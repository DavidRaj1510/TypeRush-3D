
import React, { useState, useEffect } from 'react';
import { PlayerStats, OpponentStats, GameMode, Boss } from '../types/gameTypes';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, UserIcon, Zap, Target, Award, ArrowUpRight } from 'lucide-react';

interface ResultsScreenProps {
  playerStats: PlayerStats;
  opponentStats?: OpponentStats;
  gameMode: GameMode;
  isBossBattle: boolean;
  currentBoss: Boss | null;
  onRestart: () => void;
  addXp: (amount: number) => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  playerStats,
  opponentStats,
  gameMode,
  isBossBattle,
  currentBoss,
  onRestart,
  addXp
}) => {
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);
  
  // Calculate results
  const isWinner = opponentStats 
    ? playerStats.score > opponentStats.stats.score
    : isBossBattle 
      ? currentBoss && currentBoss.health <= 0
      : playerStats.score > 0;
  
  const playerWonLabel = isBossBattle 
    ? currentBoss && currentBoss.health <= 0 
      ? "Boss Defeated!" 
      : "Boss Battle Failed"
    : gameMode === 'multiplayer' && opponentStats
      ? playerStats.score > opponentStats.stats.score
        ? "You Win!"
        : playerStats.score < opponentStats.stats.score
          ? "You Lose!"
          : "It's a Tie!"
      : "Game Complete!";
  
  // Calculate XP award after game
  useEffect(() => {
    if (xpAwarded === 0) {
      // Base XP from words typed
      const baseXp = playerStats.correctWords * 5;
      
      // Bonus for accuracy
      const accuracyBonus = Math.floor(playerStats.accuracy * 0.5);
      
      // Bonus for WPM
      const wpmBonus = Math.floor(playerStats.wpm * 0.3);
      
      // Bonus for winning
      const winBonus = isWinner ? 50 : 0;
      
      // Boss battle bonus
      const bossBonus = (isBossBattle && currentBoss && currentBoss.health <= 0) 
        ? 100 
        : 0;
      
      // Difficulty bonus
      const difficultyMultiplier = 1; // This would be set based on difficulty
      
      // Calculate total XP
      const totalXp = Math.floor((baseXp + accuracyBonus + wpmBonus + winBonus + bossBonus) * difficultyMultiplier);
      
      // Set XP awarded
      setXpAwarded(totalXp);
      
      // Show XP animation
      setTimeout(() => {
        setShowXpAnimation(true);
        
        // Award XP after animation
        setTimeout(() => {
          addXp(totalXp);
        }, 1000);
      }, 500);
    }
  }, [playerStats, isWinner, isBossBattle, currentBoss, addXp, xpAwarded]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800 bg-opacity-80 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-4">
            {playerWonLabel}
          </h1>
          
          {/* Winner badge */}
          {isWinner && (
            <div className="inline-block bg-gradient-to-r from-yellow-500 to-amber-500 p-1 rounded-full mb-4">
              <div className="bg-gray-800 rounded-full p-3">
                <Trophy size={40} className="text-yellow-500" />
              </div>
            </div>
          )}
          
          {/* Boss reward (if applicable) */}
          {isBossBattle && currentBoss && currentBoss.health <= 0 && (
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-lg text-yellow-400 mb-2">Reward Unlocked!</h3>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">{currentBoss.reward.icon}</span>
                <span className="font-semibold">{currentBoss.reward.name}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{currentBoss.reward.description}</p>
            </div>
          )}
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Player stats */}
          <div className="bg-gray-900 bg-opacity-70 rounded-xl p-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                <UserIcon size={20} />
              </div>
              <div className="ml-3">
                <h3 className="font-bold">Your Results</h3>
                <div className="text-2xl font-bold">{playerStats.score} pts</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm flex items-center">
                    <Zap size={14} className="mr-1 text-blue-400" />
                    Speed
                  </span>
                  <span className="font-medium">{playerStats.wpm} WPM</span>
                </div>
                <Progress value={Math.min(playerStats.wpm, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm flex items-center">
                    <Target size={14} className="mr-1 text-green-400" />
                    Accuracy
                  </span>
                  <span className="font-medium">{playerStats.accuracy}%</span>
                </div>
                <Progress value={playerStats.accuracy} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-gray-400">Words</div>
                  <div className="font-medium">{playerStats.correctWords}</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-gray-400">Missed</div>
                  <div className="font-medium">{playerStats.missedWords}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Opponent stats (if multiplayer) or XP stats */}
          <div className="bg-gray-900 bg-opacity-70 rounded-xl p-4">
            {gameMode === 'multiplayer' && opponentStats ? (
              <>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                    <UserIcon size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold">{opponentStats.name}</h3>
                    <div className="text-2xl font-bold">{opponentStats.stats.score} pts</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm flex items-center">
                        <Zap size={14} className="mr-1 text-blue-400" />
                        Speed
                      </span>
                      <span className="font-medium">{opponentStats.stats.wpm} WPM</span>
                    </div>
                    <Progress value={Math.min(opponentStats.stats.wpm, 100)} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm flex items-center">
                        <Target size={14} className="mr-1 text-green-400" />
                        Accuracy
                      </span>
                      <span className="font-medium">{opponentStats.stats.accuracy}%</span>
                    </div>
                    <Progress value={opponentStats.stats.accuracy} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-gray-400">Words</div>
                      <div className="font-medium">{opponentStats.stats.correctWords}</div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <div className="text-gray-400">Missed</div>
                      <div className="font-medium">{opponentStats.stats.missedWords}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // XP and level progress
              <>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold">Experience Gained</h3>
                    <div className={`text-2xl font-bold transition-all duration-500 ${showXpAnimation ? 'text-yellow-400' : ''}`}>
                      {showXpAnimation ? `+${xpAwarded} XP` : 'Calculating...'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Level {playerStats.level}</span>
                      <span className="font-medium">
                        {playerStats.xp}/{playerStats.xpToNextLevel} XP
                      </span>
                    </div>
                    <Progress 
                      value={(playerStats.xp / playerStats.xpToNextLevel) * 100} 
                      className="h-3"
                      indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-600"
                    />
                  </div>
                  
                  <div className="bg-gray-800 p-3 rounded">
                    <h4 className="font-medium mb-1">Performance Breakdown</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Words:</span>
                        <span>+{playerStats.correctWords * 5} XP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Accuracy:</span>
                        <span>+{Math.floor(playerStats.accuracy * 0.5)} XP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Speed:</span>
                        <span>+{Math.floor(playerStats.wpm * 0.3)} XP</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bonus:</span>
                        <span>+{isWinner ? 50 : 0} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Button 
            size="lg" 
            onClick={onRestart}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-lg"
          >
            Play Again
          </Button>
          
          {/* Stats breakdown toggle - updated to be more visible */}
          <Button 
            variant="secondary"
            size="sm"
            className="text-sm bg-indigo-700 hover:bg-indigo-800 text-white"
          >
            <ArrowUpRight size={14} className="mr-1" />
            View Detailed Stats
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
