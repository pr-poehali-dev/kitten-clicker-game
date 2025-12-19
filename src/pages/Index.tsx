import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  description: string;
}

interface Skin {
  id: string;
  name: string;
  image: string;
  coinCost: number;
  levelRequired: number;
  unlocked: boolean;
}

interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  cost: number;
  effect: string;
  description: string;
}

const Index = () => {
  const [coins, setCoins] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [level, setLevel] = useState(1);
  const [clickPower, setClickPower] = useState(1);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0);
  const [currentSkin, setCurrentSkin] = useState(0);
  const [clickAnimation, setClickAnimation] = useState(false);
  const [floatingCoins, setFloatingCoins] = useState<{ id: number; x: number; y: number }[]>([]);

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { id: 'auto1', name: 'Новогодняя гирлянда', icon: 'Sparkles', cost: 50, effect: 1, owned: 0, type: 'auto', description: 'Мерцающие огоньки приносят монеты' },
    { id: 'auto2', name: 'Ёлочный шар', icon: 'CircleDot', cost: 200, effect: 5, owned: 0, type: 'auto', description: 'Стеклянный шар со снегом внутри' },
    { id: 'auto3', name: 'Снежинка', icon: 'Snowflake', cost: 1000, effect: 25, owned: 0, type: 'auto', description: 'Уникальная морозная снежинка' },
    { id: 'auto4', name: 'Санки деда Мороза', icon: 'CircleSlash2', cost: 5000, effect: 100, owned: 0, type: 'auto', description: 'Летят быстрее света!' },
    { id: 'auto5', name: 'Северное сияние', icon: 'Waves', cost: 25000, effect: 500, owned: 0, type: 'auto', description: 'Магия полярного неба' },
    { id: 'auto6', name: 'Снежная королева', icon: 'Crown', cost: 100000, effect: 2500, owned: 0, type: 'auto', description: 'Властелин зимы помогает' },
    { id: 'auto7', name: 'Олени Рудольфа', icon: 'Sparkle', cost: 500000, effect: 12000, owned: 0, type: 'auto', description: 'Красноносые помощники' },
    { id: 'auto8', name: 'Ледяной дворец', icon: 'Castle', cost: 2000000, effect: 50000, owned: 0, type: 'auto', description: 'Резиденция снежной королевы' },
    { id: 'auto9', name: 'Фабрика подарков', icon: 'Factory', cost: 10000000, effect: 250000, owned: 0, type: 'auto', description: 'Производит чудеса круглосуточно' },
    { id: 'auto10', name: 'Северный полюс', icon: 'Mountain', cost: 50000000, effect: 1000000, owned: 0, type: 'auto', description: 'Центр новогоднего волшебства' },
    { id: 'mult1', name: 'Рождественский носок', icon: 'Gift', cost: 100, effect: 2, owned: 0, type: 'multiplier', description: 'Удваивает силу каждого клика' },
    { id: 'mult2', name: 'Волшебная звезда', icon: 'Star', cost: 500, effect: 3, owned: 0, type: 'multiplier', description: 'Сияет на верхушке ёлки' },
    { id: 'mult3', name: 'Морозный посох', icon: 'Wand2', cost: 2500, effect: 5, owned: 0, type: 'multiplier', description: 'Артефакт деда Мороза' },
    { id: 'mult4', name: 'Книга заклинаний', icon: 'BookOpen', cost: 10000, effect: 8, owned: 0, type: 'multiplier', description: 'Древняя магия зимы' },
    { id: 'mult5', name: 'Ледяное сердце', icon: 'Heart', cost: 50000, effect: 15, owned: 0, type: 'multiplier', description: 'Холодная мощь' },
    { id: 'mult6', name: 'Корона севера', icon: 'Crown', cost: 200000, effect: 25, owned: 0, type: 'multiplier', description: 'Символ абсолютной власти' },
    { id: 'mult7', name: 'Кристалл вечности', icon: 'Gem', cost: 1000000, effect: 40, owned: 0, type: 'multiplier', description: 'Бесконечная энергия' },
    { id: 'mult8', name: 'Артефакт богов', icon: 'Sparkles', cost: 5000000, effect: 70, owned: 0, type: 'multiplier', description: 'Божественная сила' },
  ]);

  const [skins, setSkins] = useState<Skin[]>([
    { id: 'default', name: 'Обычный котёнок', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/6839f7d6-0d2f-4d99-a0b0-124dfdc2f39e.jpg', coinCost: 0, levelRequired: 1, unlocked: true },
    { id: 'santa', name: 'Котёнок-Санта', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/6839f7d6-0d2f-4d99-a0b0-124dfdc2f39e.jpg', coinCost: 500, levelRequired: 3, unlocked: false },
    { id: 'snow', name: 'Снежный котёнок', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/994dabae-7a84-4a19-ae6f-78edcfee0b7d.jpg', coinCost: 2000, levelRequired: 5, unlocked: false },
    { id: 'elf', name: 'Эльф-котёнок', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/26be662d-5257-466d-94aa-7e816e49e89a.jpg', coinCost: 5000, levelRequired: 8, unlocked: false },
    { id: 'tree', name: 'Котёнок-ёлка', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/6839f7d6-0d2f-4d99-a0b0-124dfdc2f39e.jpg', coinCost: 10000, levelRequired: 12, unlocked: false },
    { id: 'ice', name: 'Ледяной котёнок', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/994dabae-7a84-4a19-ae6f-78edcfee0b7d.jpg', coinCost: 25000, levelRequired: 17, unlocked: false },
    { id: 'magic', name: 'Волшебный котёнок', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/26be662d-5257-466d-94aa-7e816e49e89a.jpg', coinCost: 50000, levelRequired: 23, unlocked: false },
    { id: 'royal', name: 'Королевский котёнок', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/6839f7d6-0d2f-4d99-a0b0-124dfdc2f39e.jpg', coinCost: 100000, levelRequired: 30, unlocked: false },
    { id: 'cosmic', name: 'Космический котёнок', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/994dabae-7a84-4a19-ae6f-78edcfee0b7d.jpg', coinCost: 250000, levelRequired: 40, unlocked: false },
    { id: 'legendary', name: 'Легендарный котёнок', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/26be662d-5257-466d-94aa-7e816e49e89a.jpg', coinCost: 500000, levelRequired: 50, unlocked: false },
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    { id: 'power', name: 'Сила клика', icon: 'Zap', level: 1, cost: 150, effect: '+1 монета за клик', description: 'Усиливает каждое нажатие' },
    { id: 'luck', name: 'Удача', icon: 'Clover', level: 0, cost: 300, effect: 'Шанс x2 монет', description: 'Случайный бонус при клике' },
    { id: 'speed', name: 'Скорость', icon: 'Gauge', level: 0, cost: 400, effect: '+10% автодохода', description: 'Ускоряет пассивный доход' },
    { id: 'crit', name: 'Критический удар', icon: 'Swords', level: 0, cost: 600, effect: 'Шанс x5 монет', description: 'Редкий мощный клик' },
    { id: 'combo', name: 'Комбо', icon: 'Flame', level: 0, cost: 1000, effect: '+1% за клик подряд', description: 'Накапливает силу серий' },
    { id: 'fortune', name: 'Фортуна', icon: 'Gem', level: 0, cost: 2000, effect: 'Шанс x10 монет', description: 'Джекпот для счастливчиков' },
    { id: 'master', name: 'Мастерство', icon: 'Award', level: 0, cost: 5000, effect: '+50% всех бонусов', description: 'Улучшает все эффекты' },
    { id: 'magic', name: 'Магия', icon: 'Sparkles', level: 0, cost: 10000, effect: '+100 автодохода', description: 'Чистая магическая энергия' },
    { id: 'rage', name: 'Ярость', icon: 'Flame', level: 0, cost: 20000, effect: '+200% сила клика', description: 'Удвоение мощи атак' },
    { id: 'wisdom', name: 'Мудрость', icon: 'Brain', level: 0, cost: 50000, effect: '+30% опыта', description: 'Быстрее растёт уровень' },
    { id: 'immortal', name: 'Бессмертие', icon: 'Shield', level: 0, cost: 100000, effect: '+500% автодохода', description: 'Вечный пассивный доход' },
    { id: 'divine', name: 'Божественность', icon: 'Sparkle', level: 0, cost: 250000, effect: 'x2 все эффекты', description: 'Удваивает все бонусы' },
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
    const magicBonus = (skills.find(s => s.id === 'magic')?.level || 0) * 100;
    const immortalBonus = 1 + (skills.find(s => s.id === 'immortal')?.level || 0) * 5;
    setCoinsPerSecond((totalAutoIncome + magicBonus) * speedBonus * immortalBonus);
  }, [upgrades, skills]);

  useEffect(() => {
    const totalMultiplier = upgrades
      .filter(u => u.type === 'multiplier')
      .reduce((sum, u) => sum + (u.effect - 1) * u.owned, 1);
    
    const powerBonus = skills.find(s => s.id === 'power')?.level || 1;
    const masterBonus = 1 + (skills.find(s => s.id === 'master')?.level || 0) * 0.5;
    const rageBonus = 1 + (skills.find(s => s.id === 'rage')?.level || 0) * 2;
    const divineBonus = 1 + (skills.find(s => s.id === 'divine')?.level || 0);
    setClickPower(totalMultiplier * powerBonus * masterBonus * rageBonus * divineBonus);
  }, [upgrades, skills]);

  useEffect(() => {
    const wisdomBonus = 1 + (skills.find(s => s.id === 'wisdom')?.level || 0) * 0.3;
    const newLevel = Math.floor((totalClicks * wisdomBonus) / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      toast.success(`🎉 Уровень ${newLevel}!`, {
        description: 'Поздравляем с новым уровнем!'
      });
    }
  }, [totalClicks, level, skills]);

  useEffect(() => {
    const snowflakes = Array.from({ length: 25 }, () => {
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
    const critLevel = skills.find(s => s.id === 'crit')?.level || 0;
    const fortuneLevel = skills.find(s => s.id === 'fortune')?.level || 0;

    let multiplier = 1;
    let bonusText = '';

    if (fortuneLevel > 0 && Math.random() < fortuneLevel * 0.01) {
      multiplier = 10;
      bonusText = '💎 ДЖЕКПОТ!';
    } else if (critLevel > 0 && Math.random() < critLevel * 0.05) {
      multiplier = 5;
      bonusText = '⚡ КРИТ!';
    } else if (luckLevel > 0 && Math.random() < luckLevel * 0.1) {
      multiplier = 2;
      bonusText = '✨ Удача!';
    }

    const earnedCoins = clickPower * multiplier;

    setCoins(prev => prev + earnedCoins);
    setTotalClicks(prev => prev + 1);
    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 300);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setFloatingCoins(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setFloatingCoins(prev => prev.filter(c => c.id !== id));
    }, 1000);

    if (bonusText) {
      toast.success(bonusText, { description: `+${Math.floor(earnedCoins)} монет!` });
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
    const skinIndex = skins.findIndex(s => s.id === skinId);
    const skin = skins[skinIndex];
    
    if (!skin || skin.unlocked) {
      return;
    }

    if (level < skin.levelRequired) {
      toast.error(`Требуется ${skin.levelRequired} уровень!`);
      return;
    }

    if (coins < skin.coinCost) {
      toast.error('Недостаточно монет!');
      return;
    }

    setCoins(prev => prev - skin.coinCost);
    setSkins(prev => prev.map(s => 
      s.id === skinId ? { ...s, unlocked: true } : s
    ));
    setCurrentSkin(skinIndex);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 flex flex-col">
            <Card className="flex-1 p-6 shadow-2xl border-4 border-primary/20 bg-gradient-to-br from-white to-blue-50 relative">
              <div 
                className={`relative flex items-center justify-center cursor-pointer select-none transition-all duration-300 h-full ${
                  clickAnimation ? 'click-animation' : ''
                } hover:scale-105`}
                onClick={handleClick}
              >
                <div className="relative">
                  <img 
                    src={skins[currentSkin].image} 
                    alt="Котёнок"
                    className="w-96 h-96 object-contain drop-shadow-2xl"
                    style={{ mixBlendMode: 'darken' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                </div>
                {floatingCoins.map(coin => (
                  <div
                    key={coin.id}
                    className="absolute text-3xl font-bold text-primary coin-float pointer-events-none"
                    style={{ left: coin.x, top: coin.y }}
                  >
                    +{Math.floor(clickPower)}
                  </div>
                ))}
              </div>

              <div className="absolute bottom-4 left-4 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl shadow-xl">
                <div className="text-xs font-medium opacity-90">УР.</div>
                <div className="text-4xl font-bold">{level}</div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="upgrades" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4 h-12">
                <TabsTrigger value="upgrades" className="text-sm">
                  <Icon name="ShoppingCart" size={18} className="mr-2" />
                  Улучшения
                </TabsTrigger>
                <TabsTrigger value="skins" className="text-sm">
                  <Icon name="Palette" size={18} className="mr-2" />
                  Облики
                </TabsTrigger>
                <TabsTrigger value="skills" className="text-sm">
                  <Icon name="Trophy" size={18} className="mr-2" />
                  Навыки
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upgrades" className="space-y-3">
                <div className="max-h-[calc(100vh-140px)] overflow-y-auto space-y-3 pr-2">
                  {upgrades.map(upgrade => (
                    <Card key={upgrade.id} className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-white to-blue-50/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-primary/10 p-3 rounded-xl">
                            <Icon name={upgrade.icon} size={24} className="text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-base">{upgrade.name}</div>
                            <div className="text-xs text-muted-foreground mb-1">{upgrade.description}</div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="font-semibold text-xs">
                                {upgrade.type === 'auto' 
                                  ? `+${upgrade.effect.toLocaleString()}/сек` 
                                  : `x${upgrade.effect} сила`}
                              </Badge>
                              {upgrade.owned > 0 && (
                                <Badge variant="outline" className="text-xs">x{upgrade.owned}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => buyUpgrade(upgrade.id)}
                          disabled={coins < upgrade.cost}
                          size="sm"
                          className="font-bold min-w-[110px]"
                        >
                          <Icon name="Coins" size={14} className="mr-1" />
                          {upgrade.cost.toLocaleString()}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="skins" className="space-y-3">
                <div className="max-h-[calc(100vh-140px)] overflow-y-auto space-y-3 pr-2">
                  {skins.map((skin, index) => {
                    const canUnlock = level >= skin.levelRequired && coins >= skin.coinCost;
                    const needsLevel = level < skin.levelRequired;
                    
                    return (
                      <Card key={skin.id} className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-white to-purple-50/50">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="relative">
                              <img 
                                src={skin.image} 
                                alt={skin.name}
                                className="w-16 h-16 object-cover rounded-xl shadow-lg"
                                style={{ mixBlendMode: 'darken' }}
                              />
                              {currentSkin === index && (
                                <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1">
                                  <Icon name="Check" size={12} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-base">{skin.name}</div>
                              <div className="flex items-center gap-2 flex-wrap mt-1">
                                <Badge variant="outline" className="text-xs">
                                  <Icon name="Star" size={10} className="mr-1" />
                                  Ур. {skin.levelRequired}
                                </Badge>
                                {skin.unlocked && (
                                  <Badge variant="secondary" className="text-xs">Разблокирован</Badge>
                                )}
                                {needsLevel && !skin.unlocked && (
                                  <Badge variant="destructive" className="text-xs">Нужен уровень</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {skin.unlocked ? (
                            <Button
                              onClick={() => setCurrentSkin(index)}
                              variant={currentSkin === index ? "default" : "outline"}
                              size="sm"
                              className="font-bold min-w-[110px]"
                            >
                              {currentSkin === index ? 'Активен' : 'Выбрать'}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => buySkin(skin.id)}
                              disabled={!canUnlock}
                              size="sm"
                              className="font-bold min-w-[110px]"
                            >
                              <Icon name="Coins" size={14} className="mr-1" />
                              {skin.coinCost.toLocaleString()}
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-3">
                <div className="max-h-[calc(100vh-140px)] overflow-y-auto space-y-3 pr-2">
                  {skills.map(skill => (
                    <Card key={skill.id} className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-white to-green-50/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-accent/20 p-3 rounded-xl">
                            <Icon name={skill.icon} size={24} className="text-accent-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-bold text-base">{skill.name}</div>
                              <Badge className="font-bold text-xs">Ур. {skill.level}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">{skill.description}</div>
                            <Badge variant="secondary" className="font-semibold text-xs">
                              {skill.effect}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => upgradeSkill(skill.id)}
                          disabled={coins < skill.cost}
                          size="sm"
                          className="font-bold min-w-[110px]"
                        >
                          <Icon name="Coins" size={14} className="mr-1" />
                          {skill.cost.toLocaleString()}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <Card className="bg-gradient-to-r from-primary via-accent to-secondary text-white shadow-2xl border-4 border-white/20 backdrop-blur-xl px-8 py-4">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-xs font-medium opacity-90">МОНЕТЫ</div>
                <div className="text-3xl font-bold">{Math.floor(coins).toLocaleString()}</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="text-center">
                <div className="text-xs font-medium opacity-90">ДОХОД/СЕК</div>
                <div className="text-3xl font-bold">{coinsPerSecond.toFixed(1)}</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="text-center">
                <div className="text-xs font-medium opacity-90">СИЛА</div>
                <div className="text-3xl font-bold">{Math.floor(clickPower)}x</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
