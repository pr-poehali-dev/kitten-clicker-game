import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Upgrade {
  id: string;
  name: string;
  icon: string;
  cost: number;
  effect: number;
  owned: number;
  type: 'auto' | 'multiplier';
}

interface Skin {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  unlocked: boolean;
}

interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  cost: number;
  effect: string;
}

const Index = () => {
  const [coins, setCoins] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [level, setLevel] = useState(1);
  const [clickPower, setClickPower] = useState(1);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0);
  const [currentSkin, setCurrentSkin] = useState('🐱');
  const [clickAnimation, setClickAnimation] = useState(false);
  const [floatingCoins, setFloatingCoins] = useState<{ id: number; x: number; y: number }[]>([]);

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: 'auto1', name: 'Новогодняя гирлянда', icon: 'Sparkles', cost: 50, effect: 1, owned: 0, type: 'auto' },
    { id: 'auto2', name: 'Ёлочный шар', icon: 'CircleDot', cost: 200, effect: 5, owned: 0, type: 'auto' },
    { id: 'auto3', name: 'Снежинка', icon: 'Snowflake', cost: 1000, effect: 25, owned: 0, type: 'auto' },
    { id: 'mult1', name: 'Рождественский носок', icon: 'Gift', cost: 100, effect: 2, owned: 0, type: 'multiplier' },
    { id: 'mult2', name: 'Волшебная звезда', icon: 'Star', cost: 500, effect: 3, owned: 0, type: 'multiplier' },
  ]);

  const [skins, setSkins] = useState<Skin[]>([
    { id: 'default', name: 'Обычный котёнок', emoji: '🐱', cost: 0, unlocked: true },
    { id: 'santa', name: 'Котёнок-Санта', emoji: '🎅', cost: 500, unlocked: false },
    { id: 'snow', name: 'Снежный котёнок', emoji: '⛄', cost: 1000, unlocked: false },
    { id: 'tree', name: 'Котёнок-ёлка', emoji: '🎄', cost: 2000, unlocked: false },
    { id: 'gift', name: 'Котёнок-подарок', emoji: '🎁', cost: 5000, unlocked: false },
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: 'power', name: 'Сила клика', icon: 'Zap', level: 1, cost: 150, effect: '+1 монета за клик' },
    { id: 'luck', name: 'Удача', icon: 'Clover', level: 0, cost: 300, effect: 'Шанс x2 монет' },
    { id: 'speed', name: 'Скорость', icon: 'Gauge', level: 0, cost: 400, effect: '+10% автодохода' },
  ]);

  useEffect(() => {
    if (coinsPerSecond > 0) {
      const interval = setInterval(() => {
        setCoins(prev => prev + coinsPerSecond / 10);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [coinsPerSecond]);

  useEffect(() => {
    const totalAutoIncome = upgrades
      .filter(u => u.type === 'auto')
      .reduce((sum, u) => sum + u.effect * u.owned, 0);
    
    const speedBonus = 1 + (skills.find(s => s.id === 'speed')?.level || 0) * 0.1;
    setCoinsPerSecond(totalAutoIncome * speedBonus);
  }, [upgrades, skills]);

  useEffect(() => {
    const totalMultiplier = upgrades
      .filter(u => u.type === 'multiplier')
      .reduce((sum, u) => sum + (u.effect - 1) * u.owned, 1);
    
    const powerBonus = skills.find(s => s.id === 'power')?.level || 1;
    setClickPower(totalMultiplier * powerBonus);
  }, [upgrades, skills]);

  useEffect(() => {
    const newLevel = Math.floor(totalClicks / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      toast.success(`🎉 Уровень ${newLevel}!`, {
        description: 'Поздравляем с новым уровнем!'
      });
    }
  }, [totalClicks, level]);

  useEffect(() => {
    const snowflakes = Array.from({ length: 15 }, (_, i) => {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.textContent = '❄️';
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;
      snowflake.style.animationDuration = `${Math.random() * 3 + 5}s`;
      snowflake.style.animationDelay = `${Math.random() * 5}s`;
      snowflake.style.opacity = `${Math.random() * 0.6 + 0.4}`;
      document.body.appendChild(snowflake);
      return snowflake;
    });

    return () => {
      snowflakes.forEach(s => s.remove());
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const luckLevel = skills.find(s => s.id === 'luck')?.level || 0;
    const isLucky = luckLevel > 0 && Math.random() < luckLevel * 0.1;
    const earnedCoins = clickPower * (isLucky ? 2 : 1);

    setCoins(prev => prev + earnedCoins);
    setTotalClicks(prev => prev + 1);
    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 300);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setFloatingCoins(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setFloatingCoins(prev => prev.filter(c => c.id !== id));
    }, 1000);

    if (isLucky) {
      toast.success('✨ Удача!', { description: 'Двойные монеты!' });
    }
  };

  const buyUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || coins < upgrade.cost) {
      toast.error('Недостаточно монет!');
      return;
    }

    setCoins(prev => prev - upgrade.cost);
    setUpgrades(prev => prev.map(u => {
      if (u.id === upgradeId) {
        return {
          ...u,
          owned: u.owned + 1,
          cost: Math.floor(u.cost * 1.5)
        };
      }
      return u;
    }));
    toast.success(`${upgrade.name} куплено!`);
  };

  const buySkin = (skinId: string) => {
    const skin = skins.find(s => s.id === skinId);
    if (!skin || skin.unlocked || coins < skin.cost) {
      toast.error('Недостаточно монет!');
      return;
    }

    setCoins(prev => prev - skin.cost);
    setSkins(prev => prev.map(s => 
      s.id === skinId ? { ...s, unlocked: true } : s
    ));
    setCurrentSkin(skin.emoji);
    toast.success(`${skin.name} разблокирован!`);
  };

  const upgradeSkill = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (!skill || coins < skill.cost) {
      toast.error('Недостаточно монет!');
      return;
    }

    setCoins(prev => prev - skill.cost);
    setSkills(prev => prev.map(s => {
      if (s.id === skillId) {
        return {
          ...s,
          level: s.level + 1,
          cost: Math.floor(s.cost * 1.8)
        };
      }
      return s;
    }));
    toast.success(`${skill.name} улучшен!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 pb-8">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary mb-2">
            🐾 Новогодний Котёнок
          </h1>
          <p className="text-muted-foreground">Кликай и побеждай!</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 text-center border-2 border-primary/20 shadow-lg">
            <div className="text-sm text-muted-foreground mb-1">Монеты</div>
            <div className="text-4xl font-bold text-primary">
              {Math.floor(coins).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              💰 {coinsPerSecond.toFixed(1)}/сек
            </div>
          </Card>

          <Card className="p-6 text-center border-2 border-secondary/20 shadow-lg">
            <div className="text-sm text-muted-foreground mb-1">Уровень</div>
            <div className="text-4xl font-bold text-secondary-foreground">
              {level}
            </div>
            <Progress 
              value={(totalClicks % 100)} 
              className="mt-2 h-2"
            />
          </Card>

          <Card className="p-6 text-center border-2 border-accent/20 shadow-lg">
            <div className="text-sm text-muted-foreground mb-1">Клики</div>
            <div className="text-4xl font-bold text-accent-foreground">
              {totalClicks.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              ⚡ {clickPower}x сила
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <Card className="w-full max-w-md p-8 mb-6 shadow-2xl border-4 border-primary/30">
              <div 
                className={`relative flex items-center justify-center cursor-pointer select-none transition-transform ${
                  clickAnimation ? 'click-animation' : ''
                }`}
                onClick={handleClick}
              >
                <div className="text-[180px] hover:scale-105 transition-transform duration-200">
                  {currentSkin}
                </div>
                {floatingCoins.map(coin => (
                  <div
                    key={coin.id}
                    className="absolute text-2xl font-bold text-accent-foreground coin-float pointer-events-none"
                    style={{ left: coin.x, top: coin.y }}
                  >
                    +{clickPower}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 text-lg text-muted-foreground">
                Кликай на котёнка! 🎄
              </div>
            </Card>
          </div>

          <div>
            <Tabs defaultValue="upgrades" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="upgrades">
                  <Icon name="ShoppingCart" size={16} className="mr-1" />
                  Улучшения
                </TabsTrigger>
                <TabsTrigger value="skins">
                  <Icon name="Palette" size={16} className="mr-1" />
                  Облики
                </TabsTrigger>
                <TabsTrigger value="skills">
                  <Icon name="Trophy" size={16} className="mr-1" />
                  Навыки
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upgrades" className="space-y-3">
                <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
                  {upgrades.map(upgrade => (
                    <Card key={upgrade.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon name={upgrade.icon} size={24} className="text-primary" />
                          <div>
                            <div className="font-semibold">{upgrade.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {upgrade.type === 'auto' 
                                ? `+${upgrade.effect}/сек` 
                                : `x${upgrade.effect} сила`}
                            </div>
                            {upgrade.owned > 0 && (
                              <Badge variant="secondary" className="mt-1">
                                x{upgrade.owned}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => buyUpgrade(upgrade.id)}
                          disabled={coins < upgrade.cost}
                          size="sm"
                          className="font-semibold"
                        >
                          {upgrade.cost} 💰
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="skins" className="space-y-3">
                <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
                  {skins.map(skin => (
                    <Card key={skin.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{skin.emoji}</div>
                          <div>
                            <div className="font-semibold">{skin.name}</div>
                            {skin.unlocked && (
                              <Badge variant="secondary" className="mt-1">
                                Куплено
                              </Badge>
                            )}
                          </div>
                        </div>
                        {skin.unlocked ? (
                          <Button
                            onClick={() => setCurrentSkin(skin.emoji)}
                            variant={currentSkin === skin.emoji ? "default" : "outline"}
                            size="sm"
                          >
                            {currentSkin === skin.emoji ? 'Активен' : 'Выбрать'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => buySkin(skin.id)}
                            disabled={coins < skin.cost}
                            size="sm"
                            className="font-semibold"
                          >
                            {skin.cost} 💰
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-3">
                <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
                  {skills.map(skill => (
                    <Card key={skill.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon name={skill.icon} size={24} className="text-accent-foreground" />
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {skill.name}
                              <Badge variant="outline">Ур. {skill.level}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {skill.effect}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => upgradeSkill(skill.id)}
                          disabled={coins < skill.cost}
                          size="sm"
                          className="font-semibold"
                        >
                          {skill.cost} 💰
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
