
export interface Word {
  id: string;
  text: string;
  position: [number, number, number];
  speed: number;
  color?: string;
  isActive?: boolean;
}

export interface GameStats {
  wpm: number;
  accuracy: number;
  score: number;
  correctWords: number;
  missedWords: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
}

export interface PlayerStats extends GameStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface OpponentStats {
  name: string;
  stats: GameStats;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export type GameMode = 'single' | 'multiplayer';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameScreen = 'options' | 'game' | 'results';

export interface Boss {
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  reward: Reward;
  specialAttacks: string[];
  defeatedBy: string[];
}
