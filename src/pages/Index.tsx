import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
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

const Index = () => {
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(0.2);
  const [balance, setBalance] = useState(10000.00);
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  const [history, setHistory] = useState<GameRound[]>([
    { id: 1, multiplier: 1783.71, timestamp: new Date() },
    { id: 2, multiplier: 1.46, timestamp: new Date() },
    { id: 3, multiplier: 75.24, timestamp: new Date() },
    { id: 4, multiplier: 1.82, timestamp: new Date() },
    { id: 5, multiplier: 12.74, timestamp: new Date() },
    { id: 6, multiplier: 1.00, timestamp: new Date() },
    { id: 7, multiplier: 2.19, timestamp: new Date() },
    { id: 8, multiplier: 4.52, timestamp: new Date() },
  ]);

  const [activeBets, setActiveBets] = useState<PlayerBet[]>([
    { id: 1, username: 'Анюор', amount: 35.71, multiplier: 1.65, win: 58.93 },
    { id: 2, username: 'fо4еdd', amount: 22.12, multiplier: 2.03, win: 44.91 },
    { id: 3, username: 'Андрей', amount: 20.66, multiplier: 2.82, win: 57.09 },
    { id: 4, username: 'Мои88', amount: 14.11, multiplier: 2.00, win: 28.23 },
    { id: 5, username: '4066', amount: 12.29, multiplier: 0, win: 0 },
    { id: 6, username: 'emm0', amount: 11.28, multiplier: 2.22, win: 25.04 },
    { id: 7, username: 'YJSheeq', amount: 10.03, multiplier: 2.65, win: 26.58 },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, username: 'TO JETMHA', message: 'Привет', timestamp: new Date() },
    { id: 2, username: 'Miss', message: 'Отлично', timestamp: new Date() },
    { id: 3, username: 'Miss', message: 'Как у вас?', timestamp: new Date() },
    { id: 4, username: 'Miss', message: 'Ша', timestamp: new Date() },
    { id: 5, username: 'TO JETMHA', message: 'Как дела?', timestamp: new Date() },
    { id: 6, username: 'TO X99JET', message: 'Привет', timestamp: new Date() },
    { id: 7, username: 'KMckgR', message: 'Chud to mai bhi nis', timestamp: new Date() },
    { id: 8, username: 'hsLMCP', message: 'Смеха хахахо', timestamp: new Date() },
    { id: 9, username: 'hsLMCP', message: 'Смиб тавштадм', timestamp: new Date() },
    { id: 10, username: 'TO JETMHA', message: 'Вот это полёт 🚀', timestamp: new Date() },
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
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'flying') {
      interval = setInterval(() => {
        setCurrentMultiplier(prev => {
          const newMultiplier = prev + (Math.random() * 0.1 + 0.02);
          
          if (Math.random() < 0.02) {
            setGameState('crashed');
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
  }, [gameState, hasBet, cashedOut]);

  const placeBet = () => {
    if (balance >= betAmount && !hasBet && gameState === 'waiting') {
      setHasBet(true);
      setBalance(prev => prev - betAmount);
    }
  };

  const cashOut = () => {
    if (hasBet && gameState === 'flying' && !cashedOut) {
      const winAmount = betAmount * currentMultiplier;
      setBalance(prev => prev + winAmount);
      setCashedOut(true);
      setHasBet(false);
    }
  };

  const adjustBet = (amount: number) => {
    setBetAmount(prev => Math.max(0.1, prev + amount));
  };

  const getMultiplierColor = (mult: number) => {
    if (mult >= 10) return 'text-[#F97316]';
    if (mult >= 5) return 'text-[#D946EF]';
    if (mult >= 2) return 'text-[#8B5CF6]';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white overflow-hidden">
      <div className="flex flex-col h-screen">
        <header className="bg-[#1A1F2C] border-b border-[#2A2F3C] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-white">LUCKYJET</h1>
              <nav className="flex gap-4">
                <Button variant="ghost" className="text-white bg-[#8B5CF6] hover:bg-[#7C3AED]">
                  <Icon name="Gamepad2" className="mr-2 h-4 w-4" />
                  Казино
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#2A2F3C]">
                  <Icon name="Coins" className="mr-2 h-4 w-4" />
                  Free Money
                </Button>
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#2A2F3C]">
                  <Icon name="Trophy" className="mr-2 h-4 w-4" />
                  Спорт
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#2A2F3C] px-4 py-2 rounded-lg flex items-center gap-2">
                <Icon name="Wallet" className="h-4 w-4 text-[#10B981]" />
                <span className="font-semibold">{balance.toFixed(2)} $</span>
              </div>
              <Button className="bg-[#10B981] hover:bg-[#059669] text-white">
                Регистрация
              </Button>
              <Button variant="outline" className="border-[#2A2F3C] text-white hover:bg-[#2A2F3C]">
                Вход
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-80 bg-[#1A1F2C] border-r border-[#2A2F3C] p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-400">ВСЕ СТАВКИ</h3>
                <Badge variant="secondary" className="bg-[#2A2F3C] text-white">
                  {activeBets.length}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">Всего ставок: 212</p>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {activeBets.map((bet) => (
                  <Card key={bet.id} className="bg-[#2A2F3C] border-[#3A3F4C] p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF]">
                        <AvatarFallback className="bg-transparent text-white text-xs">
                          {bet.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{bet.username}</p>
                        <p className="text-xs text-gray-400">{bet.amount.toFixed(2)} $</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${bet.multiplier > 0 ? 'text-[#8B5CF6]' : 'text-gray-500'}`}>
                          {bet.multiplier > 0 ? `${bet.multiplier.toFixed(2)}x` : '-'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {bet.win > 0 ? `${bet.win.toFixed(2)} $` : '-'}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </aside>

          <main className="flex-1 flex flex-col">
            <div className="flex-1 relative bg-gradient-to-b from-[#1A1F2C] to-[#0F1117] overflow-hidden">
              <div className="absolute top-4 left-4 z-10">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-[#2A2F3C]"
                >
                  <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
                  Назад
                </Button>
              </div>

              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="bg-[#2A2F3C] hover:bg-[#3A3F4C] text-white"
                >
                  <Icon name="Volume2" className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="bg-[#2A2F3C] hover:bg-[#3A3F4C] text-white"
                >
                  <Icon name="Moon" className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="bg-[#2A2F3C] hover:bg-[#3A3F4C] text-white"
                >
                  <Icon name="HelpCircle" className="mr-2 h-4 w-4" />
                  Как играть?
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="bg-[#2A2F3C] hover:bg-[#3A3F4C] text-white"
                >
                  <Icon name="Maximize" className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {gameState === 'waiting' && (
                  <div className="text-center">
                    <p className="text-6xl font-bold text-white mb-4 neon-text">
                      {countdown}
                    </p>
                    <p className="text-xl text-gray-400">Ожидание раунда...</p>
                  </div>
                )}
                
                {gameState === 'flying' && (
                  <div className="text-center relative">
                    <div className="absolute -top-32 left-1/2 transform -translate-x-1/2">
                      <div className="text-8xl animate-bounce">✈️</div>
                    </div>
                    <p className="text-9xl font-bold neon-text animate-pulse">
                      x{currentMultiplier.toFixed(2)}
                    </p>
                  </div>
                )}
                
                {gameState === 'crashed' && (
                  <div className="text-center">
                    <p className="text-6xl font-bold text-red-500 mb-4">💥</p>
                    <p className="text-3xl font-bold text-red-500">УЛЕТЕЛ!</p>
                    <p className="text-xl text-gray-400 mt-2">x{currentMultiplier.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex gap-2 flex-wrap justify-center max-w-2xl">
                {history.slice(0, 8).map((round) => (
                  <Badge 
                    key={round.id} 
                    className={`${getMultiplierColor(round.multiplier)} bg-[#2A2F3C] border-none px-3 py-1 font-bold`}
                  >
                    {round.multiplier.toFixed(2)}x
                  </Badge>
                ))}
              </div>

              <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-[#2A2F3C] rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" className="h-4 w-4 text-[#8B5CF6]" />
                  <span className="text-sm text-gray-300">ИСТОРИЯ РАУНДОВ</span>
                </div>
              </div>

              {gameState === 'flying' && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  <path
                    d={`M 0,${window.innerHeight} Q ${window.innerWidth * 0.3},${window.innerHeight * 0.7} ${window.innerWidth * 0.5},${window.innerHeight * 0.5}`}
                    stroke="rgba(139, 92, 246, 0.3)"
                    strokeWidth="3"
                    fill="none"
                    className="animate-pulse"
                  />
                </svg>
              )}
            </div>

            <div className="bg-[#1A1F2C] border-t border-[#2A2F3C] p-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-[#2A2F3C] border-[#3A3F4C] p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Автоставка</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">x 2.00</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => adjustBet(-betAmount)}
                          className="border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          <Icon name="Minus" className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 bg-[#1A1F2C] rounded-lg px-4 py-3 text-center">
                          <span className="text-xl font-bold">{betAmount.toFixed(1)} $</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => adjustBet(betAmount)}
                          className="border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          <Icon name="Plus" className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(5)}
                          className="flex-1 border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          +5
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(25)}
                          className="flex-1 border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          +25
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(50)}
                          className="flex-1 border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          +50
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(100)}
                          className="flex-1 border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          +100
                        </Button>
                      </div>
                      
                      {!hasBet && gameState === 'waiting' && (
                        <Button 
                          onClick={placeBet}
                          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#C026D3] text-white font-bold py-6 text-lg neon-glow"
                        >
                          СТАВКА
                        </Button>
                      )}
                      
                      {hasBet && gameState === 'flying' && !cashedOut && (
                        <Button 
                          onClick={cashOut}
                          className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold py-6 text-lg neon-glow animate-pulse"
                        >
                          ЗАБРАТЬ {(betAmount * currentMultiplier).toFixed(2)} $
                        </Button>
                      )}
                      
                      {(gameState === 'crashed' || cashedOut || (hasBet && gameState === 'waiting')) && (
                        <Button 
                          disabled
                          className="w-full bg-[#3A3F4C] text-gray-500 font-bold py-6 text-lg cursor-not-allowed"
                        >
                          {cashedOut ? `ВЫИГРАЛ ${(betAmount * currentMultiplier).toFixed(2)} $` : 'ОЖИДАНИЕ...'}
                        </Button>
                      )}
                    </div>
                  </Card>

                  <Card className="bg-[#2A2F3C] border-[#3A3F4C] p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Автовывод</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">x 2.00</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => adjustBet(-betAmount)}
                          className="border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          <Icon name="Minus" className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 bg-[#1A1F2C] rounded-lg px-4 py-3 text-center">
                          <span className="text-xl font-bold">{betAmount.toFixed(1)} $</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => adjustBet(betAmount)}
                          className="border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          <Icon name="Plus" className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(5)}
                          className="flex-1 border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          +5
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(25)}
                          className="flex-1 border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          +25
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(50)}
                          className="flex-1 border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          +50
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => adjustBet(100)}
                          className="flex-1 border-[#3A3F4C] hover:bg-[#3A3F4C]"
                        >
                          +100
                        </Button>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#C026D3] text-white font-bold py-6 text-lg neon-glow"
                      >
                        СТАВКА
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </main>

          <aside className="w-80 bg-[#1A1F2C] border-l border-[#2A2F3C] flex flex-col">
            <div className="p-4 border-b border-[#2A2F3C]">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">ЧАТ</h3>
              <p className="text-xs text-gray-500">Игроков онлайн: 399</p>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-2">
                    <Avatar className="h-6 w-6 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] flex-shrink-0">
                      <AvatarFallback className="bg-transparent text-white text-xs">
                        {msg.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs">
                        <span className="font-semibold text-[#8B5CF6]">{msg.username}</span>
                        <span className="text-gray-400 ml-2">{msg.message}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-[#2A2F3C]">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ваше сообщение"
                  className="flex-1 bg-[#2A2F3C] border-[#3A3F4C] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
                <Button 
                  size="icon"
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
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
