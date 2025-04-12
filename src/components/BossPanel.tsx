
import React from 'react';
import { Boss } from '../types/gameTypes';
import { CircleDashed, Skull, Swords } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface BossPanelProps {
  boss: Boss;
}

const BossPanel: React.FC<BossPanelProps> = ({ boss }) => {
  // Calculate health percentage for color
  const healthPercent = (boss.health / boss.maxHealth) * 100;
  const healthColor = healthPercent > 60 
    ? '#22cc66' 
    : healthPercent > 30 
      ? '#ffcc00' 
      : '#ff3333';

  return (
    <div className="bg-gray-900 bg-opacity-90 rounded-lg p-3 shadow-lg border border-red-900 min-w-[200px]">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center">
          <Skull size={16} className="text-red-200" />
        </div>
        <div className="ml-2">
          <h3 className="font-bold text-sm">{boss.name}</h3>
          <div className="text-xs text-red-400">Level 5 Boss</div>
        </div>
      </div>
      
      {/* Health bar */}
      <div className="mb-2">
        <div className="flex justify-between items-center text-xs mb-1">
          <span>HP</span>
          <span>{boss.health}/{boss.maxHealth}</span>
        </div>
        <Progress 
          value={healthPercent} 
          className="h-2 bg-gray-700"
          indicatorClassName="bg-gradient-to-r from-red-500 to-red-700"
        />
      </div>
      
      {/* Attack timer */}
      <div className="flex items-center text-xs text-gray-400 mb-1">
        <Swords size={12} className="mr-1" />
        <span>Next attack preparing...</span>
      </div>
      
      {/* Special attacks */}
      <div className="mt-2">
        <h4 className="text-xs font-bold mb-1">Special Attacks:</h4>
        <div className="grid grid-cols-2 gap-1">
          {boss.specialAttacks.map((attack, index) => (
            <div key={index} className="bg-gray-800 rounded px-2 py-1 text-xs flex items-center">
              <CircleDashed size={10} className="mr-1 text-red-400" />
              {attack}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BossPanel;
