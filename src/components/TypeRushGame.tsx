import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import GameScene from './GameScene';
import { Word, GameStats, PlayerStats, OpponentStats, GameMode, Difficulty, GameScreen, Boss } from '../types/gameTypes';
import { generateWordList } from '../utils/wordUtils';
import OptionsScreen from './OptionsScreen';
import GameHud from './GameHud';
import ResultsScreen from './ResultsScreen';
import BossPanel from './BossPanel';

const BOSSES: Boss[] = [
  {
    name: "Syntax Error",
    health: 100,
    maxHealth: 100,
    damage: 5,
    reward: {
      id: "syntax-master",
      name: "Syntax Master",
      description: "Defeated the Syntax Error boss",
      icon: "⚔️",
      unlocked: false,
    },
    specialAttacks: ["Code Corruption", "Stack Overflow"],
    defeatedBy: []
  },
  {
    name: "Quantum Byte",
    health: 150,
    maxHealth: 150,
    damage: 8,
    reward: {
      id: "quantum-coder",
      name: "Quantum Coder",
      description: "Defeated the Quantum Byte boss",
      icon: "🌌",
      unlocked: false,
    },
    specialAttacks: ["Time Warp", "Bit Scramble"],
    defeatedBy: []
  },
  {
    name: "Data Leviathan",
    health: 200,
    maxHealth: 200,
    damage: 12,
    reward: {
      id: "data-master",
      name: "Data Master",
      description: "Defeated the Data Leviathan boss",
      icon: "🐉",
      unlocked: false,
    },
    specialAttacks: ["Memory Drain", "Firewall Breach"],
    defeatedBy: []
  }
];

const BASE_XP_NEEDED = 100;
const XP_MULTIPLIER = 1.5;

const TypeRushGame: React.FC = () => {
  const [gameScreen, setGameScreen] = useState<GameScreen>('options');
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [words, setWords] = useState<Word[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isBossBattle, setIsBossBattle] = useState(false);

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    wpm: 0,
    accuracy: 0,
    score: 0,
    correctWords: 0,
    missedWords: 0,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP_NEEDED
  });

  const [opponentStats, setOpponentStats] = useState<OpponentStats>({
    name: "AI Ghost",
    stats: {
      wpm: 0,
      accuracy: 0,
      score: 0,
      correctWords: 0,
      missedWords: 0,
      totalKeystrokes: 0,
      correctKeystrokes: 0
    }
  });

  const [currentBoss, setCurrentBoss] = useState<Boss | null>(null);
  const [bossAttackTimeout, setBossAttackTimeout] = useState<NodeJS.Timeout | null>(null);

  const gameStartTimeRef = useRef<number | null>(null);
  const wordCountRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const aiGhostSpeedRef = useRef<number>(30);
  const wordListRef = useRef<string[]>([]);

  useEffect(() => {
    wordListRef.current = generateWordList(1000);
  }, []);

  const generateWord = useCallback((): Word => {
    const speedMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
    
    const word: Word = {
      id: `word_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      text: wordListRef.current[Math.floor(Math.random() * wordListRef.current.length)],
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        -30,
      ] as [number, number, number],
      speed: (1 + Math.random() * 0.5) * speedMultiplier,
      color: isBossBattle ? '#ff6600' : '#ffffff'
    };
    return word;
  }, [difficulty, isBossBattle]);

  const startGame = useCallback((
    mode: GameMode, 
    diff: Difficulty, 
    time: number, 
    bossBattle: boolean = false
  ) => {
    setGameMode(mode);
    setDifficulty(diff);
    setDuration(time);
    setTimeLeft(time);
    setIsBossBattle(bossBattle);
    
    setPlayerStats(prev => ({
      ...prev,
      wpm: 0,
      accuracy: 0,
      score: 0,
      correctWords: 0,
      missedWords: 0,
      totalKeystrokes: 0,
      correctKeystrokes: 0
    }));
    
    setOpponentStats(prev => ({
      ...prev,
      stats: {
        wpm: 0,
        accuracy: 0,
        score: 0,
        correctWords: 0,
        missedWords: 0,
        totalKeystrokes: 0,
        correctKeystrokes: 0
      }
    }));
    
    if (bossBattle) {
      const selectedBoss = {...BOSSES[Math.floor(Math.random() * BOSSES.length)]};
      setCurrentBoss(selectedBoss);
    } else {
      setCurrentBoss(null);
    }
    
    const initialWordCount = diff === 'easy' ? 5 : diff === 'medium' ? 8 : 12;
    const initialWords: Word[] = [];
    for (let i = 0; i < initialWordCount; i++) {
      initialWords.push(generateWord());
    }
    setWords(initialWords);
    
    if (mode === 'single' && !bossBattle) {
      const baseSpeed = diff === 'easy' ? 25 : diff === 'medium' ? 40 : 55;
      const playerBonus = Math.min(playerStats.level * 2, 30);
      aiGhostSpeedRef.current = baseSpeed + playerBonus;
    }
    
    setGameScreen('game');
    gameStartTimeRef.current = Date.now();
    wordCountRef.current = 0;
    setCurrentInput('');
    
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  }, [generateWord, playerStats.level]);

  useEffect(() => {
    if (gameScreen !== 'game' || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameScreen, timeLeft]);
  
  const endGame = () => {
    setGameScreen('results');
    
    if (bossAttackTimeout) {
      clearTimeout(bossAttackTimeout);
      setBossAttackTimeout(null);
    }
    
    const gameTime = gameStartTimeRef.current ? (Date.now() - gameStartTimeRef.current) / 1000 / 60 : 0;
    const finalWpm = gameTime > 0 ? Math.floor(wordCountRef.current / gameTime) : 0;
    
    setPlayerStats(prev => ({
      ...prev,
      wpm: finalWpm
    }));
    
    if (isBossBattle && currentBoss && currentBoss.health <= 0) {
      addPlayerXp(currentBoss.maxHealth);
    }
  };
  
  useEffect(() => {
    if (gameScreen !== 'game' || gameMode !== 'single' || isBossBattle) return;
    
    const ghostTypingInterval = setInterval(() => {
      const gameTime = gameStartTimeRef.current ? (Date.now() - gameStartTimeRef.current) / 1000 / 60 : 0;
      const expectedWordsTyped = Math.floor(gameTime * aiGhostSpeedRef.current);
      
      setOpponentStats(prev => {
        if (expectedWordsTyped > prev.stats.correctWords) {
          const newWords = expectedWordsTyped - prev.stats.correctWords;
          const newScore = prev.stats.score + (newWords * 10);
          
          return {
            ...prev,
            stats: {
              ...prev.stats,
              correctWords: expectedWordsTyped,
              score: newScore,
              wpm: aiGhostSpeedRef.current,
              accuracy: 95,
              totalKeystrokes: expectedWordsTyped * 5,
              correctKeystrokes: expectedWordsTyped * 5 * 0.95
            }
          };
        }
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(ghostTypingInterval);
  }, [gameScreen, gameMode, isBossBattle]);
  
  useEffect(() => {
    if (gameScreen !== 'game' || !isBossBattle || !currentBoss) return;
    
    const bossAttackTimer = setTimeout(() => {
      setPlayerStats(prev => ({
        ...prev,
        score: Math.max(0, prev.score - currentBoss.damage)
      }));
      
      const gameContainer = document.querySelector('.game-container');
      if (gameContainer) {
        gameContainer.classList.add('boss-attack');
        setTimeout(() => {
          gameContainer.classList.remove('boss-attack');
        }, 500);
      }
      
      setBossAttackTimeout(
        setTimeout(bossAttackFunction, 3000 + Math.random() * 2000)
      );
    }, 5000);
    
    const bossAttackFunction = () => {
      setPlayerStats(prev => ({
        ...prev,
        score: Math.max(0, prev.score - currentBoss.damage)
      }));
      
      const gameContainer = document.querySelector('.game-container');
      if (gameContainer) {
        gameContainer.classList.add('boss-attack');
        setTimeout(() => {
          gameContainer.classList.remove('boss-attack');
        }, 500);
      }
      
      setBossAttackTimeout(
        setTimeout(bossAttackFunction, 3000 + Math.random() * 2000)
      );
    };
    
    setBossAttackTimeout(bossAttackTimer);
    
    return () => {
      if (bossAttackTimeout) clearTimeout(bossAttackTimeout);
    };
  }, [gameScreen, isBossBattle, currentBoss]);
  
  useEffect(() => {
    if (gameScreen !== 'game') return;
    
    const getSpawnInterval = () => {
      switch (difficulty) {
        case 'easy': return 2000;
        case 'medium': return 1500;
        case 'hard': return 1000;
        default: return 1500;
      }
    };
    
    const getWordLimit = () => {
      switch (difficulty) {
        case 'easy': return 10;
        case 'medium': return 15;
        case 'hard': return 20;
        default: return 15;
      }
    };
    
    const spawnInterval = setInterval(() => {
      setWords(prevWords => {
        if (prevWords.length >= getWordLimit()) return prevWords;
        
        return [...prevWords, generateWord()];
      });
    }, getSpawnInterval());
    
    return () => clearInterval(spawnInterval);
  }, [gameScreen, difficulty, generateWord]);
  
  useEffect(() => {
    if (gameScreen !== 'game') return;
    
    const moveInterval = setInterval(() => {
      setWords(prevWords => prevWords.map(word => {
        const newZ = word.position[2] + word.speed * 0.1;
        
        if (newZ > 5) {
          setPlayerStats(prev => ({
            ...prev,
            missedWords: prev.missedWords + 1,
            score: Math.max(0, prev.score - 5)
          }));
          return null as any;
        }
        
        return {
          ...word,
          position: [word.position[0], word.position[1], newZ] as [number, number, number]
        };
      }).filter(Boolean));
    }, 50);
    
    return () => clearInterval(moveInterval);
  }, [gameScreen]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInput(value);
    
    setPlayerStats(prev => ({
      ...prev,
      totalKeystrokes: prev.totalKeystrokes + 1,
      correctKeystrokes: value.length > 0 && words.some(w => w.text.startsWith(value)) 
        ? prev.correctKeystrokes + 1 
        : prev.correctKeystrokes
    }));
    
    const matchedWordIndex = words.findIndex(word => 
      word.text.toLowerCase() === value.toLowerCase()
    );
    
    if (matchedWordIndex !== -1) {
      const matchedWord = words[matchedWordIndex];
      
      setWords(prev => prev.filter(w => w.id !== matchedWord.id));
      
      setCurrentInput('');
      
      setPlayerStats(prev => {
        const newCorrectWords = prev.correctWords + 1;
        const newScore = prev.score + 10;
        const accuracy = prev.totalKeystrokes > 0 
          ? Math.floor((prev.correctKeystrokes / prev.totalKeystrokes) * 100) 
          : 0;
          
        return {
          ...prev,
          correctWords: newCorrectWords,
          score: newScore,
          accuracy
        };
      });
      
      wordCountRef.current += 1;
      
      if (isBossBattle && currentBoss) {
        setCurrentBoss(prev => {
          if (!prev) return prev;
          
          const wordDamage = matchedWord.text.length * 2;
          const newHealth = Math.max(0, prev.health - wordDamage);
          
          if (newHealth <= 0) {
            if (!prev.defeatedBy.includes('player')) {
              prev.defeatedBy.push('player');
            }
            
            if (gameScreen === 'game') {
              setTimeout(() => endGame(), 1500);
            }
          }
          
          return {
            ...prev,
            health: newHealth
          };
        });
      }
    } else {
      if (value.length > 0 && !words.some(word => 
        word.text.toLowerCase().startsWith(value.toLowerCase())
      )) {
        setCurrentInput('');
      }
    }
  };
  
  const handleWordHit = (word: Word) => {
    setWords(prev => prev.filter(w => w.id !== word.id));
    
    setPlayerStats(prev => {
      const newCorrectWords = prev.correctWords + 1;
      const newScore = prev.score + 10;
      
      return {
        ...prev,
        correctWords: newCorrectWords,
        score: newScore
      };
    });
    
    wordCountRef.current += 1;
    
    if (isBossBattle && currentBoss) {
      setCurrentBoss(prev => {
        if (!prev) return prev;
        
        const wordDamage = word.text.length * 2;
        const newHealth = Math.max(0, prev.health - wordDamage);
        
        if (newHealth <= 0 && gameScreen === 'game') {
          setTimeout(() => endGame(), 1500);
        }
        
        return {
          ...prev,
          health: newHealth
        };
      });
    }
  };
  
  const addPlayerXp = (amount: number) => {
    setPlayerStats(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNextLevel = prev.xpToNextLevel;
      
      if (newXp >= prev.xpToNextLevel) {
        newLevel += 1;
        const xpOverflow = newXp - prev.xpToNextLevel;
        newXpToNextLevel = Math.floor(BASE_XP_NEEDED * Math.pow(XP_MULTIPLIER, newLevel - 1));
        
        return {
          ...prev,
          xp: xpOverflow,
          level: newLevel,
          xpToNextLevel: newXpToNextLevel
        };
      }
      
      return {
        ...prev,
        xp: newXp
      };
    });
  };
  
  const handleRestart = () => {
    setGameScreen('options');
  };

  const renderScreen = () => {
    switch (gameScreen) {
      case 'options':
        return (
          <OptionsScreen
            onStartGame={startGame}
            playerStats={playerStats}
            setPlayerStats={setPlayerStats}
            bossesDefeated={BOSSES.filter(boss => boss.defeatedBy.includes('player')).length}
          />
        );
      case 'game':
        return (
          <div className="game-container relative w-full h-full">
            <div className="game-canvas w-full h-full">
              <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <GameScene 
                  words={words} 
                  gameMode={gameMode}
                  difficulty={difficulty}
                  isBossBattle={isBossBattle}
                  bossHealth={currentBoss?.health || 0}
                  maxBossHealth={currentBoss?.maxHealth || 1}
                  onWordHit={handleWordHit}
                />
              </Canvas>
            </div>
            
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
              <GameHud
                timeLeft={timeLeft}
                playerStats={playerStats}
                opponentStats={opponentStats}
                gameMode={gameMode}
                isBossBattle={isBossBattle}
                currentBoss={currentBoss}
              />
              
              <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none">
                <div className="bg-gray-900 bg-opacity-80 p-4 rounded-lg max-w-md overflow-hidden border border-purple-500">
                  <div className="text-center text-gray-300 text-sm mb-2">Type to destroy:</div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {words.slice(0, 5).map((word) => (
                      <span 
                        key={word.id} 
                        className={`px-3 py-2 bg-gray-800 rounded-md text-white font-medium ${
                          currentInput.length > 0 && word.text.toLowerCase().startsWith(currentInput.toLowerCase())
                            ? 'bg-purple-800 border border-purple-400'
                            : ''
                        }`}
                      >
                        {word.text}
                      </span>
                    ))}
                    {words.length > 5 && (
                      <span className="px-3 py-2 text-gray-400">
                        +{words.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-8 left-0 right-0 mx-auto w-full max-w-md pointer-events-auto">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-lg bg-gray-900 bg-opacity-80 text-white border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Type the words..."
                  autoFocus
                />
              </div>
              
              {isBossBattle && currentBoss && (
                <div className="absolute top-20 right-5 pointer-events-auto">
                  <BossPanel boss={currentBoss} />
                </div>
              )}
            </div>
          </div>
        );
      case 'results':
        return (
          <ResultsScreen
            playerStats={playerStats}
            opponentStats={gameMode === 'multiplayer' ? opponentStats : undefined}
            gameMode={gameMode}
            isBossBattle={isBossBattle}
            currentBoss={currentBoss}
            onRestart={handleRestart}
            addXp={addPlayerXp}
          />
        );
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white overflow-hidden">
      {renderScreen()}
    </div>
  );
};

export default TypeRushGame;
