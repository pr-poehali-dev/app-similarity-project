import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface GameRound {
  id: number;
  multiplier: number;
  timestamp: Date;
}

interface PlayerBet {
  id: number;
  username: string;
  amount: number;
  multiplier: number;
  win?: number;
}

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  timestamp: Date;
}

type Currency = 'RUB' | 'USD' | 'USDT';

const Index = () => {
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(0.2);
  const [balance, setBalance] = useState(10000.00);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const getCurrencySymbol = (curr: Currency) => {
    switch (curr) {
      case 'RUB': return '₽';
      case 'USD': return '$';
      case 'USDT': return 'USDT';
    }
  };

  const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const playCrashSound = () => {
    if (!soundEnabled) return;
    playSound(100, 0.5, 'sawtooth');
  };

  const playBetSound = () => {
    if (!soundEnabled) return;
    playSound(800, 0.1);
  };

  const playCashOutSound = () => {
    if (!soundEnabled) return;
    playSound(1000, 0.2);
    setTimeout(() => playSound(1200, 0.2), 100);
  };

  const playTickSound = () => {
    if (!soundEnabled) return;
    playSound(400, 0.05);
  };
  
  const [history, setHistory] = useState<GameRound[]>([
    { id: 1, multiplier: 10.50, timestamp: new Date() },
    { id: 2, multiplier: 1.06, timestamp: new Date() },
    { id: 3, multiplier: 1.05, timestamp: new Date() },
    { id: 4, multiplier: 9.82, timestamp: new Date() },
    { id: 5, multiplier: 24.98, timestamp: new Date() },
    { id: 6, multiplier: 1.07, timestamp: new Date() },
    { id: 7, multiplier: 1.38, timestamp: new Date() },
    { id: 8, multiplier: 7.20, timestamp: new Date() },
    { id: 9, multiplier: 1.05, timestamp: new Date() },
    { id: 10, multiplier: 1.46, timestamp: new Date() },
    { id: 11, multiplier: 1.00, timestamp: new Date() },
    { id: 12, multiplier: 1.55, timestamp: new Date() },
    { id: 13, multiplier: 1.13, timestamp: new Date() },
    { id: 14, multiplier: 3.46, timestamp: new Date() },
  ]);

  const [activeBets, setActiveBets] = useState<PlayerBet[]>([
    { id: 1, username: 'SEZER', amount: 500.55, multiplier: 0, win: 0 },
    { id: 2, username: 'SEZER', amount: 250.27, multiplier: 0, win: 0 },
    { id: 3, username: '3T50', amount: 92.98, multiplier: 0, win: 0 },
    { id: 4, username: 'Тагир', amount: 49.17, multiplier: 0, win: 0 },
    { id: 5, username: 'Адам', amount: 30.73, multiplier: 0, win: 0 },
    { id: 6, username: 'Адам', amount: 29.50, multiplier: 0, win: 0 },
    { id: 7, username: '0089', amount: 19.17, multiplier: 0, win: 0 },
    { id: 8, username: 'Тагир', amount: 18.07, multiplier: 0, win: 0 },
    { id: 9, username: 'NTGn', amount: 16.92, multiplier: 0, win: 0 },
    { id: 10, username: 'Mou88a', amount: 14.11, multiplier: 0, win: 0 },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, username: 'Miss', message: 'Как у вас?', timestamp: new Date() },
    { id: 2, username: 'Miss', message: 'Ша', timestamp: new Date() },
    { id: 3, username: 'TO JETMHA', message: 'Как дела?', timestamp: new Date() },
    { id: 4, username: 'JWLfbd', message: 'mein chud raha hu', timestamp: new Date() },
    { id: 5, username: 'hsLMCP', message: 'Смеха хахахо', timestamp: new Date() },
    { id: 6, username: 'hsLMCP', message: 'Смиб тавштадм', timestamp: new Date() },
    { id: 7, username: 'TO JETMHA', message: 'Вот это полёт 🚀', timestamp: new Date() },
    { id: 8, username: 'TO X99JET', message: 'Привет', timestamp: new Date() },
    { id: 9, username: 'Amanthakur', message: 'Поделился ставкой', timestamp: new Date() },
    { id: 10, username: 'Putin Top12', message: 'пы', timestamp: new Date() },
    { id: 11, username: 'TO JETMHA', message: 'Еле успел', timestamp: new Date() },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState === 'waiting') {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setGameState('flying');
            setCurrentMultiplier(1.00);
            setCashedOut(false);
            playTickSound();
            return 5;
          }
          if (prev <= 3) playTickSound();
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'flying') {
      interval = setInterval(() => {
        setCurrentMultiplier(prev => {
          const newMultiplier = prev + (Math.random() * 0.1 + 0.02);
          
          if (Math.random() < 0.015) {
            setGameState('crashed');
            playCrashSound();
            
            const newRound: GameRound = {
              id: Date.now(),
              multiplier: parseFloat(prev.toFixed(2)),
              timestamp: new Date()
            };
            setHistory(prev => [newRound, ...prev.slice(0, 19)]);
            
            if (hasBet && !cashedOut) {
              setHasBet(false);
            }
            
            setTimeout(() => {
              setGameState('waiting');
              setCountdown(5);
            }, 3000);
            
            return prev;
          }
          
          return newMultiplier;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [gameState, hasBet, cashedOut, soundEnabled]);

  const placeBet = () => {
    if (balance >= betAmount && !hasBet && gameState === 'waiting') {
      setHasBet(true);
      setBalance(prev => prev - betAmount);
      playBetSound();
    }
  };

  const cashOut = () => {
    if (hasBet && gameState === 'flying' && !cashedOut) {
      const winAmount = betAmount * currentMultiplier;
      setBalance(prev => prev + winAmount);
      setCashedOut(true);
      setHasBet(false);
      playCashOutSound();
    }
  };

  const adjustBet = (amount: number) => {
    setBetAmount(prev => Math.max(0.1, prev + amount));
  };

  const getMultiplierColor = (mult: number) => {
    if (mult >= 20) return 'text-[#F97316] bg-[#F97316]/20';
    if (mult >= 10) return 'text-[#F59E0B] bg-[#F59E0B]/20';
    if (mult >= 5) return 'text-[#D946EF] bg-[#D946EF]/20';
    if (mult >= 2) return 'text-[#8B5CF6] bg-[#8B5CF6]/20';
    return 'text-[#6366F1] bg-[#6366F1]/20';
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white overflow-hidden">
      <div className="flex flex-col h-screen">
        <header className="bg-[#1A1F2C] border-b border-[#2E3447] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-white tracking-wider">LUCKYJET</h1>
              <nav className="flex gap-4">
                <Button variant="ghost" className="text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all duration-200">
                  <Icon name="Gamepad2" className="mr-2 h-4 w-4" />
                  Казино
                </Button>
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-[#2E3447] transition-all duration-200">
                  <Icon name="Coins" className="mr-2 h-4 w-4" />
                  Free Money
                </Button>
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-[#2E3447] transition-all duration-200">
                  <Icon name="Trophy" className="mr-2 h-4 w-4" />
                  Спорт
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
                <SelectTrigger className="w-28 bg-[#2E3447] border-[#3E4457] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2E3447] border-[#3E4457] text-white">
                  <SelectItem value="USD">USD $</SelectItem>
                  <SelectItem value="RUB">RUB ₽</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
              <div className="bg-[#2E3447] px-4 py-2 rounded-lg flex items-center gap-2">
                <Icon name="Wallet" className="h-4 w-4 text-[#10B981]" />
                <span className="font-semibold">{balance.toFixed(2)} {getCurrencySymbol(currency)}</span>
              </div>
              <Button className="bg-[#10B981] hover:bg-[#059669] text-white transition-all duration-200">
                Регистрация
              </Button>
              <Button variant="outline" className="border-[#2E3447] text-white hover:bg-[#2E3447] transition-all duration-200">
                Вход
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-80 bg-[#1A1F2C] border-r border-[#2E3447] p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white/60">ВСЕ СТАВКИ</h3>
                <Badge variant="secondary" className="bg-[#2E3447] text-white">
                  {activeBets.length}
                </Badge>
              </div>
              <p className="text-xs text-white/40">Всего ставок: {activeBets.length + 186}</p>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {activeBets.map((bet) => (
                  <Card key={bet.id} className="bg-[#2E3447] border-[#3E4457] p-3 hover:bg-[#343A52] transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF]">
                        <AvatarFallback className="bg-transparent text-white text-xs">
                          {bet.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{bet.username}</p>
                        <p className="text-xs text-white/60">{bet.amount.toFixed(2)} {getCurrencySymbol(currency)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${bet.multiplier > 0 ? 'text-[#8B5CF6]' : 'text-white/40'}`}>
                          {bet.multiplier > 0 ? `${bet.multiplier.toFixed(2)}x` : '-'}
                        </p>
                        <p className="text-xs text-white/60">
                          {bet.win && bet.win > 0 ? `${bet.win.toFixed(2)} ${getCurrencySymbol(currency)}` : '-'}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </aside>

          <main className="flex-1 flex flex-col">
            <div className="flex-1 relative bg-gradient-to-b from-[#1A1F2C] via-[#15192B] to-[#0F1117] overflow-hidden">
              <div className="absolute top-4 left-4 z-10">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-[#2E3447] transition-all duration-200"
                >
                  <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
                  Назад
                </Button>
              </div>

              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`${soundEnabled ? 'bg-[#2E3447]' : 'bg-[#2E3447]/50'} hover:bg-[#3E4457] text-white transition-all duration-200`}
                >
                  <Icon name={soundEnabled ? "Volume2" : "VolumeX"} className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="bg-[#2E3447] hover:bg-[#3E4457] text-white transition-all duration-200"
                >
                  <Icon name="Moon" className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="bg-[#2E3447] hover:bg-[#3E4457] text-white transition-all duration-200"
                >
                  <Icon name="HelpCircle" className="mr-2 h-4 w-4" />
                  Как играть?
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="bg-[#2E3447] hover:bg-[#3E4457] text-white transition-all duration-200"
                >
                  <Icon name="Maximize" className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                {gameState === 'waiting' && (
                  <div className="text-center animate-fade-in">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-[#8B5CF6]/30 animate-ping"></div>
                      </div>
                      <Icon name="Gift" className="relative w-24 h-24 text-[#8B5CF6] mx-auto animate-pulse" />
                    </div>
                    <p className="text-8xl font-bold text-white mb-4 neon-text animate-pulse">
                      {countdown}
                    </p>
                    <p className="text-2xl text-white/60 font-medium tracking-wider">ОЖИДАНИЕ</p>
                    <p className="text-xl text-white/40 mt-2">СЛЕДУЮЩЕГО РАУНДА</p>
                    <div className="mt-6 w-80 h-2 bg-[#2E3447] rounded-full overflow-hidden mx-auto">
                      <div 
                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] transition-all duration-1000"
                        style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {gameState === 'flying' && (
                  <div className="text-center relative">
                    <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 animate-bounce">
                      <div className="text-9xl filter drop-shadow-2xl">✈️</div>
                    </div>
                    <p className="text-[160px] font-bold neon-text leading-none" style={{
                      animation: 'pulse 0.5s ease-in-out infinite, scale-in 0.3s ease-out'
                    }}>
                      x{currentMultiplier.toFixed(2)}
                    </p>
                    <div className="flex gap-3 justify-center mt-6">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-3 h-3 rounded-full bg-[#8B5CF6] animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {gameState === 'crashed' && (
                  <div className="text-center animate-scale-in">
                    <p className="text-8xl font-bold mb-6 animate-bounce">💥</p>
                    <p className="text-6xl font-bold text-[#A78BFA] mb-2 tracking-wider">УЛЕТЕЛ</p>
                    <p className="text-3xl text-white/60 mt-4">x{currentMultiplier.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-[#2E3447]/80 backdrop-blur-sm rounded-lg px-6 py-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Clock" className="h-5 w-5 text-[#8B5CF6]" />
                    <span className="text-sm font-medium text-white tracking-wide">ИСТОРИЯ РАУНДОВ</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-center max-w-4xl">
                  {history.slice(0, 14).map((round) => (
                    <Badge 
                      key={round.id} 
                      className={`${getMultiplierColor(round.multiplier)} border-none px-4 py-2 font-bold text-sm transition-all duration-200 hover:scale-110`}
                    >
                      {round.multiplier.toFixed(2)}x
                    </Badge>
                  ))}
                </div>
              </div>

              {gameState === 'flying' && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 0 }} />
                      <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.6 }} />
                      <stop offset="100%" style={{ stopColor: '#D946EF', stopOpacity: 0.8 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0,${window.innerHeight} Q ${window.innerWidth * 0.3},${window.innerHeight * 0.6} ${window.innerWidth * 0.5},${window.innerHeight * 0.4}`}
                    stroke="url(#pathGradient)"
                    strokeWidth="4"
                    fill="none"
                    className="animate-pulse"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.6))' }}
                  />
                </svg>
              )}

              {gameState === 'crashed' && (
                <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none">
                  <svg className="w-full h-full">
                    <path
                      d="M0,100 Q250,50 500,80 T1000,90 T1500,95 T2000,100"
                      fill="rgba(139, 92, 246, 0.1)"
                      className="animate-pulse"
                    />
                    <path
                      d="M0,150 Q300,120 600,130 T1200,140 T1800,145 T2400,150"
                      fill="rgba(75, 85, 99, 0.2)"
                      className="animate-pulse"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="bg-[#1A1F2C] border-t border-[#2E3447] p-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-[#2E3447] border-[#3E4457] p-4 transition-all duration-200 hover:border-[#8B5CF6]/50">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Автоставка</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/60">x 2.00</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => adjustBet(-betAmount)}
                          className="border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          <Icon name="Minus" className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 bg-[#1A1F2C] rounded-lg px-4 py-3 text-center">
                          <span className="text-xl font-bold">{betAmount.toFixed(1)} {getCurrencySymbol(currency)}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => adjustBet(betAmount)}
                          className="border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          <Icon name="Plus" className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(5)}
                          className="flex-1 border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          +5
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(25)}
                          className="flex-1 border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          +25
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(50)}
                          className="flex-1 border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          +50
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(100)}
                          className="flex-1 border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          +100
                        </Button>
                      </div>
                      
                      {!hasBet && gameState === 'waiting' && (
                        <Button 
                          onClick={placeBet}
                          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#C026D3] text-white font-bold py-6 text-lg neon-glow transition-all duration-200 hover:scale-105"
                        >
                          СТАВКА
                        </Button>
                      )}
                      
                      {hasBet && gameState === 'flying' && !cashedOut && (
                        <Button 
                          onClick={cashOut}
                          className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold py-6 text-lg neon-glow animate-pulse transition-all duration-200 hover:scale-105"
                        >
                          ЗАБРАТЬ {(betAmount * currentMultiplier).toFixed(2)} {getCurrencySymbol(currency)}
                        </Button>
                      )}
                      
                      {(gameState === 'crashed' || cashedOut || (hasBet && gameState === 'waiting')) && (
                        <Button 
                          disabled
                          className="w-full bg-[#3E4457] text-white/40 font-bold py-6 text-lg cursor-not-allowed"
                        >
                          {cashedOut ? `ВЫИГРАЛ ${(betAmount * currentMultiplier).toFixed(2)} ${getCurrencySymbol(currency)}` : 'ОЖИДАНИЕ...'}
                        </Button>
                      )}
                    </div>
                  </Card>

                  <Card className="bg-[#2E3447] border-[#3E4457] p-4 transition-all duration-200 hover:border-[#8B5CF6]/50">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Автовывод</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white/60">x 2.00</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => adjustBet(-betAmount)}
                          className="border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          <Icon name="Minus" className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 bg-[#1A1F2C] rounded-lg px-4 py-3 text-center">
                          <span className="text-xl font-bold">{betAmount.toFixed(1)} {getCurrencySymbol(currency)}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => adjustBet(betAmount)}
                          className="border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          <Icon name="Plus" className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(5)}
                          className="flex-1 border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          +5
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(25)}
                          className="flex-1 border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          +25
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(50)}
                          className="flex-1 border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          +50
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(100)}
                          className="flex-1 border-[#3E4457] hover:bg-[#3E4457] transition-all duration-200"
                        >
                          +100
                        </Button>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#C026D3] text-white font-bold py-6 text-lg neon-glow transition-all duration-200 hover:scale-105"
                      >
                        СТАВКА
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </main>

          <aside className="w-80 bg-[#1A1F2C] border-l border-[#2E3447] flex flex-col">
            <div className="p-4 border-b border-[#2E3447]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white/60">ЧАТ</h3>
                <Badge className="bg-[#F97316] text-white">
                  <Icon name="Users" className="h-3 w-3 mr-1" />
                  {chatMessages.length + 390}
                </Badge>
              </div>
              <p className="text-xs text-white/40">Игроков онлайн: 418</p>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-2 hover:bg-[#2E3447]/50 p-2 rounded transition-colors duration-200">
                    <Avatar className="h-6 w-6 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] flex-shrink-0">
                      <AvatarFallback className="bg-transparent text-white text-xs">
                        {msg.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs">
                        <span className="font-semibold text-[#8B5CF6]">{msg.username}</span>
                        <span className="text-white/60 ml-2">{msg.message}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-[#2E3447]">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ваше сообщение"
                  className="flex-1 bg-[#2E3447] border-[#3E4457] rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all duration-200"
                />
                <Button 
                  size="icon"
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all duration-200"
                >
                  <Icon name="Send" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Index;
