import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

interface Weapon {
  id: string;
  name: string;
  icon: string;
  cost: number;
  damage: number;
  owned: number;
  description: string;
}

interface Vehicle {
  id: string;
  name: string;
  icon: string;
  cost: number;
  speed: number;
  owned: number;
  description: string;
}

interface Skin {
  id: string;
  name: string;
  image: string;
  coinCost: number;
  levelRequired: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
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

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  completed: boolean;
  reward: number;
}

const Index = () => {
  const loadGameState = () => {
    try {
      const saved = localStorage.getItem('pubgClickerSave');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load save', e);
    }
    return null;
  };

  const savedState = loadGameState();

  const [coins, setCoins] = useState(savedState?.coins || 0);
  const [totalClicks, setTotalClicks] = useState(savedState?.totalClicks || 0);
  const [level, setLevel] = useState(savedState?.level || 1);
  const [clickPower, setClickPower] = useState(1);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0);
  const [currentSkin, setCurrentSkin] = useState(savedState?.currentSkin || 0);
  const [clickAnimation, setClickAnimation] = useState(false);
  const [floatingCoins, setFloatingCoins] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);

  const [upgrades, setUpgrades] = useState<Upgrade[]>(savedState?.upgrades || [
    { id: 'auto1', name: 'Аптечка первой помощи', icon: 'Heart', cost: 50, effect: 1, owned: 0, type: 'auto', description: 'Базовое восстановление ресурсов' },
    { id: 'auto2', name: 'Энергетический напиток', icon: 'Zap', cost: 200, effect: 5, owned: 0, type: 'auto', description: 'Ускоряет сбор монет' },
    { id: 'auto3', name: 'Бронежилет Ур.1', icon: 'Shield', cost: 1000, effect: 25, owned: 0, type: 'auto', description: 'Защита и пассивный доход' },
    { id: 'auto4', name: 'Бронежилет Ур.2', icon: 'ShieldCheck', cost: 5000, effect: 100, owned: 0, type: 'auto', description: 'Улучшенная защита' },
    { id: 'auto5', name: 'Бронежилет Ур.3', icon: 'ShieldAlert', cost: 25000, effect: 500, owned: 0, type: 'auto', description: 'Максимальная защита' },
    { id: 'auto6', name: 'Шлем Ур.3', icon: 'HardHat', cost: 100000, effect: 2500, owned: 0, type: 'auto', description: 'Легендарная защита головы' },
    { id: 'auto7', name: 'Дрон-разведчик', icon: 'Plane', cost: 500000, effect: 12000, owned: 0, type: 'auto', description: 'Автоматический сбор добычи' },
    { id: 'auto8', name: 'Военная база', icon: 'Castle', cost: 2000000, effect: 50000, owned: 0, type: 'auto', description: 'Постоянный доход ресурсов' },
    { id: 'auto9', name: 'Спутниковая связь', icon: 'Satellite', cost: 10000000, effect: 250000, owned: 0, type: 'auto', description: 'Глобальный мониторинг' },
    { id: 'auto10', name: 'Штаб операций', icon: 'Building2', cost: 50000000, effect: 1000000, owned: 0, type: 'auto', description: 'Центр командования' },
    { id: 'mult1', name: 'Оптический прицел', icon: 'Crosshair', cost: 100, effect: 2, owned: 0, type: 'multiplier', description: 'Удваивает урон' },
    { id: 'mult2', name: 'Глушитель', icon: 'Volume2', cost: 500, effect: 3, owned: 0, type: 'multiplier', description: 'Скрытые атаки x3' },
    { id: 'mult3', name: 'Расширенный магазин', icon: 'Archive', cost: 2500, effect: 5, owned: 0, type: 'multiplier', description: 'Больше боеприпасов' },
    { id: 'mult4', name: 'Тактический фонарик', icon: 'Flashlight', cost: 10000, effect: 8, owned: 0, type: 'multiplier', description: 'Точность в темноте' },
    { id: 'mult5', name: 'Лазерный целеуказатель', icon: 'Target', cost: 50000, effect: 15, owned: 0, type: 'multiplier', description: 'Идеальная точность' },
    { id: 'mult6', name: 'Компенсатор отдачи', icon: 'Move', cost: 200000, effect: 25, owned: 0, type: 'multiplier', description: 'Контроль оружия' },
    { id: 'mult7', name: 'Криогенные патроны', icon: 'Snowflake', cost: 1000000, effect: 40, owned: 0, type: 'multiplier', description: 'Замораживающий урон' },
    { id: 'mult8', name: 'Плазменное оружие', icon: 'Flame', cost: 5000000, effect: 70, owned: 0, type: 'multiplier', description: 'Футуристический урон' },
  ]);

  const [weapons, setWeapons] = useState<Weapon[]>(savedState?.weapons || [
    { id: 'w1', name: 'M416', icon: 'Rifle', cost: 300, damage: 10, owned: 0, description: 'Надежная штурмовая винтовка' },
    { id: 'w2', name: 'AKM', icon: 'Rifle', cost: 800, damage: 30, owned: 0, description: 'Мощная, но с отдачей' },
    { id: 'w3', name: 'SCAR-L', icon: 'Rifle', cost: 2000, damage: 80, owned: 0, description: 'Сбалансированное оружие' },
    { id: 'w4', name: 'AWM', icon: 'Target', cost: 10000, damage: 300, owned: 0, description: 'Снайперская легенда' },
    { id: 'w5', name: 'Groza', icon: 'Zap', cost: 50000, damage: 1000, owned: 0, description: 'Элитная винтовка' },
    { id: 'w6', name: 'MK14', icon: 'Crosshair', cost: 200000, damage: 4000, owned: 0, description: 'Универсал высшего класса' },
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>(savedState?.vehicles || [
    { id: 'v1', name: 'Мотоцикл', icon: 'Bike', cost: 1000, speed: 50, owned: 0, description: 'Быстрое передвижение' },
    { id: 'v2', name: 'Багги', icon: 'Car', cost: 5000, speed: 200, owned: 0, description: 'Проходимость по бездорожью' },
    { id: 'v3', name: 'UAZ', icon: 'Truck', cost: 25000, speed: 800, owned: 0, description: 'Вместительный джип' },
    { id: 'v4', name: 'Glider', icon: 'Plane', cost: 100000, speed: 3000, owned: 0, description: 'Воздушный планер' },
  ]);

  const [skins, setSkins] = useState<Skin[]>(savedState?.skins || [
    { id: 'default', name: 'Обычный солдат', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/d6a7bfb7-49e6-4c89-b47d-158a2fcb9215.jpg', coinCost: 0, levelRequired: 1, unlocked: true, rarity: 'common' },
    { id: 'winter', name: 'Зимний оперативник', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/4a919e0a-5b40-4275-9c4a-a9fc73d49d0f.jpg', coinCost: 500, levelRequired: 3, unlocked: false, rarity: 'rare' },
    { id: 'elite', name: 'Элитный боец', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/cba91cbe-b380-48d1-8eb1-25679008252a.jpg', coinCost: 2000, levelRequired: 5, unlocked: false, rarity: 'epic' },
    { id: 'sniper', name: 'Снайпер-призрак', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/ee9adaab-d31d-4b69-9290-50c0edc505b3.jpg', coinCost: 5000, levelRequired: 8, unlocked: false, rarity: 'epic' },
    { id: 'comando', name: 'Спецназовец', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/d6a7bfb7-49e6-4c89-b47d-158a2fcb9215.jpg', coinCost: 10000, levelRequired: 12, unlocked: false, rarity: 'legendary' },
    { id: 'cyber', name: 'Киберсолдат', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/cba91cbe-b380-48d1-8eb1-25679008252a.jpg', coinCost: 25000, levelRequired: 17, unlocked: false, rarity: 'legendary' },
    { id: 'ghost', name: 'Призрак войны', image: 'https://cdn.poehali.dev/projects/535a2b8a-770b-40b5-8943-61de57497faa/files/ee9adaab-d31d-4b69-9290-50c0edc505b3.jpg', coinCost: 50000, levelRequired: 23, unlocked: false, rarity: 'legendary' },
  ]);

  const [skills, setSkills] = useState<Skill[]>(savedState?.skills || [
    { id: 'power', name: 'Сила выстрела', icon: 'Zap', level: 1, cost: 150, effect: '+1 урон за клик', description: 'Усиливает каждый выстрел' },
    { id: 'luck', name: 'Удача лутера', icon: 'Clover', level: 0, cost: 300, effect: 'Шанс x2 добычи', description: 'Случайный бонус' },
    { id: 'speed', name: 'Быстрая перезарядка', icon: 'Gauge', level: 0, cost: 400, effect: '+10% автодохода', description: 'Ускорение пассивки' },
    { id: 'crit', name: 'Критический выстрел', icon: 'Crosshair', level: 0, cost: 600, effect: 'Шанс x5 урона', description: 'Хедшот!' },
    { id: 'combo', name: 'Серия убийств', icon: 'Flame', level: 0, cost: 1000, effect: '+1% за серию', description: 'Комбо-бонус' },
    { id: 'fortune', name: 'Удача чемпиона', icon: 'Trophy', level: 0, cost: 2000, effect: 'Шанс x10 добычи', description: 'Джекпот победителя' },
    { id: 'master', name: 'Мастер оружия', icon: 'Award', level: 0, cost: 5000, effect: '+50% всех бонусов', description: 'Профессионал' },
    { id: 'magic', name: 'Тактическое превосходство', icon: 'Brain', level: 0, cost: 10000, effect: '+100 автодохода', description: 'Стратегия побеждает' },
    { id: 'rage', name: 'Боевая ярость', icon: 'Flame', level: 0, cost: 20000, effect: '+200% урон', description: 'Берсерк режим' },
    { id: 'wisdom', name: 'Боевой опыт', icon: 'GraduationCap', level: 0, cost: 50000, effect: '+30% опыта', description: 'Быстрее прокачка' },
    { id: 'immortal', name: 'Неуязвимость', icon: 'Shield', level: 0, cost: 100000, effect: '+500% автодохода', description: 'Бессмертный воин' },
    { id: 'divine', name: 'Божественная сила', icon: 'Sparkles', level: 0, cost: 250000, effect: 'x2 все эффекты', description: 'Абсолют' },
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>(savedState?.achievements || [
    { id: 'a1', name: 'Первая кровь', description: 'Сделать 10 кликов', icon: 'Target', requirement: 10, completed: false, reward: 100 },
    { id: 'a2', name: 'Любитель', description: 'Сделать 100 кликов', icon: 'MousePointerClick', requirement: 100, completed: false, reward: 500 },
    { id: 'a3', name: 'Ветеран', description: 'Сделать 1000 кликов', icon: 'Medal', requirement: 1000, completed: false, reward: 5000 },
    { id: 'a4', name: 'Легенда', description: 'Сделать 10000 кликов', icon: 'Crown', requirement: 10000, completed: false, reward: 50000 },
    { id: 'a5', name: 'Богач', description: 'Накопить 100000 монет', icon: 'Coins', requirement: 100000, completed: false, reward: 25000 },
    { id: 'a6', name: 'Коллекционер', description: 'Разблокировать 5 скинов', icon: 'Package', requirement: 5, completed: false, reward: 10000 },
  ]);

  useEffect(() => {
    const gameState = {
      coins,
      totalClicks,
      level,
      currentSkin,
      upgrades,
      weapons,
      vehicles,
      skins,
      skills,
      achievements,
    };
    localStorage.setItem('pubgClickerSave', JSON.stringify(gameState));
  }, [coins, totalClicks, level, currentSkin, upgrades, weapons, vehicles, skins, skills, achievements]);

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
    
    const weaponBonus = weapons.reduce((sum, w) => sum + w.damage * w.owned * 0.1, 0);
    const vehicleBonus = vehicles.reduce((sum, v) => sum + v.speed * v.owned * 0.05, 0);
    const speedBonus = 1 + (skills.find(s => s.id === 'speed')?.level || 0) * 0.1;
    const magicBonus = (skills.find(s => s.id === 'magic')?.level || 0) * 100;
    const immortalBonus = 1 + (skills.find(s => s.id === 'immortal')?.level || 0) * 5;
    setCoinsPerSecond((totalAutoIncome + weaponBonus + vehicleBonus + magicBonus) * speedBonus * immortalBonus);
  }, [upgrades, skills, weapons, vehicles]);

  useEffect(() => {
    const totalMultiplier = upgrades
      .filter(u => u.type === 'multiplier')
      .reduce((sum, u) => sum + (u.effect - 1) * u.owned, 1);
    
    const weaponDamage = weapons.reduce((sum, w) => sum + w.damage * w.owned, 0);
    const powerBonus = skills.find(s => s.id === 'power')?.level || 1;
    const masterBonus = 1 + (skills.find(s => s.id === 'master')?.level || 0) * 0.5;
    const rageBonus = 1 + (skills.find(s => s.id === 'rage')?.level || 0) * 2;
    const divineBonus = 1 + (skills.find(s => s.id === 'divine')?.level || 0);
    setClickPower((totalMultiplier + weaponDamage) * powerBonus * masterBonus * rageBonus * divineBonus);
  }, [upgrades, skills, weapons]);

  useEffect(() => {
    const wisdomBonus = 1 + (skills.find(s => s.id === 'wisdom')?.level || 0) * 0.3;
    const newLevel = Math.floor((totalClicks * wisdomBonus) / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  }, [totalClicks, level, skills]);

  useEffect(() => {
    setAchievements(prev => prev.map(ach => {
      if (!ach.completed) {
        let current = 0;
        if (ach.id === 'a1' || ach.id === 'a2' || ach.id === 'a3' || ach.id === 'a4') {
          current = totalClicks;
        } else if (ach.id === 'a5') {
          current = Math.floor(coins);
        } else if (ach.id === 'a6') {
          current = skins.filter(s => s.unlocked).length;
        }
        
        if (current >= ach.requirement) {
          setCoins(c => c + ach.reward);
          return { ...ach, completed: true };
        }
      }
      return ach;
    }));
  }, [totalClicks, coins, skins]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const luckLevel = skills.find(s => s.id === 'luck')?.level || 0;
    const critLevel = skills.find(s => s.id === 'crit')?.level || 0;
    const fortuneLevel = skills.find(s => s.id === 'fortune')?.level || 0;

    let multiplier = 1;

    if (fortuneLevel > 0 && Math.random() < fortuneLevel * 0.01) {
      multiplier = 10;
    } else if (critLevel > 0 && Math.random() < critLevel * 0.05) {
      multiplier = 5;
    } else if (luckLevel > 0 && Math.random() < luckLevel * 0.1) {
      multiplier = 2;
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
  };

  const buyUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || coins < upgrade.cost) return;

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
  };

  const buyWeapon = (weaponId: string) => {
    const weapon = weapons.find(w => w.id === weaponId);
    if (!weapon || coins < weapon.cost) return;

    setCoins(prev => prev - weapon.cost);
    setWeapons(prev => prev.map(w => {
      if (w.id === weaponId) {
        return {
          ...w,
          owned: w.owned + 1,
          cost: Math.floor(w.cost * 1.6)
        };
      }
      return w;
    }));
  };

  const buyVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle || coins < vehicle.cost) return;

    setCoins(prev => prev - vehicle.cost);
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          owned: v.owned + 1,
          cost: Math.floor(v.cost * 1.7)
        };
      }
      return v;
    }));
  };

  const buySkin = (skinId: string) => {
    const skinIndex = skins.findIndex(s => s.id === skinId);
    const skin = skins[skinIndex];
    
    if (!skin || skin.unlocked) return;
    if (level < skin.levelRequired) return;
    if (coins < skin.coinCost) return;

    setCoins(prev => prev - skin.coinCost);
    setSkins(prev => prev.map(s => 
      s.id === skinId ? { ...s, unlocked: true } : s
    ));
    setCurrentSkin(skinIndex);
  };

  const upgradeSkill = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (!skill || coins < skill.cost) return;

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
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const resetGame = () => {
    if (confirm('Вы уверены? Весь прогресс будет удален!')) {
      localStorage.removeItem('pubgClickerSave');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 flex flex-col">
            <Card className="flex-1 p-6 shadow-2xl border-4 border-orange-500/30 bg-gradient-to-br from-slate-800 to-slate-900 relative">
              <div 
                className={`relative flex items-center justify-center cursor-pointer select-none transition-all duration-300 h-full ${
                  clickAnimation ? 'click-animation' : ''
                } hover:scale-105`}
                onClick={handleClick}
              >
                <div className="relative">
                  <img 
                    src={skins[currentSkin].image} 
                    alt="Боец"
                    className="w-96 h-96 object-contain drop-shadow-2xl"
                    style={{ mixBlendMode: 'lighten' }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${getRarityColor(skins[currentSkin].rarity)} opacity-20 rounded-full blur-3xl pointer-events-none`} />
                  
                  {/* Оружие на персонаже */}
                  {weapons.filter(w => w.owned > 0).slice(0, 3).map((weapon, idx) => (
                    <div 
                      key={weapon.id}
                      className="absolute bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold flex items-center gap-1"
                      style={{ 
                        top: `${20 + idx * 50}px`,
                        right: '-20px'
                      }}
                    >
                      <Icon name={weapon.icon} size={14} />
                      {weapon.name}
                      {weapon.owned > 1 && <span className="text-yellow-300">x{weapon.owned}</span>}
                    </div>
                  ))}
                </div>
                {floatingCoins.map(coin => (
                  <div
                    key={coin.id}
                    className="absolute text-3xl font-bold text-orange-400 coin-float pointer-events-none"
                    style={{ left: coin.x, top: coin.y }}
                  >
                    +{Math.floor(clickPower)}
                  </div>
                ))}
              </div>

              <div className={`absolute bottom-4 left-4 bg-gradient-to-r ${getRarityColor(skins[currentSkin].rarity)} text-white px-6 py-3 rounded-2xl shadow-xl`}>
                <div className="text-xs font-medium opacity-90">УР.</div>
                <div className="text-4xl font-bold">{level}</div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="upgrades" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4 h-12 bg-slate-800">
                <TabsTrigger value="upgrades" className="text-xs">
                  <Icon name="ShoppingCart" size={16} className="mr-1" />
                  Снаряжение
                </TabsTrigger>
                <TabsTrigger value="weapons" className="text-xs">
                  <Icon name="Crosshair" size={16} className="mr-1" />
                  Оружие
                </TabsTrigger>
                <TabsTrigger value="vehicles" className="text-xs">
                  <Icon name="Car" size={16} className="mr-1" />
                  Транспорт
                </TabsTrigger>
                <TabsTrigger value="skins" className="text-xs">
                  <Icon name="User" size={16} className="mr-1" />
                  Бойцы
                </TabsTrigger>
                <TabsTrigger value="skills" className="text-xs">
                  <Icon name="Trophy" size={16} className="mr-1" />
                  Навыки
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upgrades" className="space-y-3">
                <div className="max-h-[calc(100vh-140px)] overflow-y-auto space-y-3 pr-2">
                  {upgrades.map(upgrade => (
                    <Card key={upgrade.id} className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-slate-800 to-slate-900 border-orange-500/20">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-orange-500/20 p-3 rounded-xl">
                            <Icon name={upgrade.icon} size={24} className="text-orange-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-base text-white">{upgrade.name}</div>
                            <div className="text-xs text-gray-400 mb-1">{upgrade.description}</div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="font-semibold text-xs">
                                {upgrade.type === 'auto' 
                                  ? `+${upgrade.effect.toLocaleString()}/сек` 
                                  : `x${upgrade.effect} урон`}
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
                          className="font-bold min-w-[110px] bg-orange-600 hover:bg-orange-700"
                        >
                          <Icon name="Coins" size={14} className="mr-1" />
                          {upgrade.cost.toLocaleString()}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="weapons" className="space-y-3">
                <div className="max-h-[calc(100vh-140px)] overflow-y-auto space-y-3 pr-2">
                  {weapons.map(weapon => (
                    <Card key={weapon.id} className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-slate-800 to-slate-900 border-red-500/20">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-red-500/20 p-3 rounded-xl">
                            <Icon name={weapon.icon} size={24} className="text-red-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-base text-white">{weapon.name}</div>
                            <div className="text-xs text-gray-400 mb-1">{weapon.description}</div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="font-semibold text-xs bg-red-900/50">
                                Урон: +{weapon.damage}
                              </Badge>
                              {weapon.owned > 0 && (
                                <Badge variant="outline" className="text-xs">x{weapon.owned}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => buyWeapon(weapon.id)}
                          disabled={coins < weapon.cost}
                          size="sm"
                          className="font-bold min-w-[110px] bg-red-600 hover:bg-red-700"
                        >
                          <Icon name="Coins" size={14} className="mr-1" />
                          {weapon.cost.toLocaleString()}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="vehicles" className="space-y-3">
                <div className="max-h-[calc(100vh-140px)] overflow-y-auto space-y-3 pr-2">
                  {vehicles.map(vehicle => (
                    <Card key={vehicle.id} className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-slate-800 to-slate-900 border-blue-500/20">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-blue-500/20 p-3 rounded-xl">
                            <Icon name={vehicle.icon} size={24} className="text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-base text-white">{vehicle.name}</div>
                            <div className="text-xs text-gray-400 mb-1">{vehicle.description}</div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="font-semibold text-xs bg-blue-900/50">
                                Скорость: +{vehicle.speed}/сек
                              </Badge>
                              {vehicle.owned > 0 && (
                                <Badge variant="outline" className="text-xs">x{vehicle.owned}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => buyVehicle(vehicle.id)}
                          disabled={coins < vehicle.cost}
                          size="sm"
                          className="font-bold min-w-[110px] bg-blue-600 hover:bg-blue-700"
                        >
                          <Icon name="Coins" size={14} className="mr-1" />
                          {vehicle.cost.toLocaleString()}
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
                      <Card key={skin.id} className={`p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-${skin.rarity === 'legendary' ? 'yellow' : skin.rarity === 'epic' ? 'purple' : skin.rarity === 'rare' ? 'blue' : 'gray'}-500/30`}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="relative">
                              <img 
                                src={skin.image} 
                                alt={skin.name}
                                className="w-16 h-16 object-cover rounded-xl shadow-lg border-2"
                                style={{ mixBlendMode: 'lighten', borderColor: skin.rarity === 'legendary' ? '#eab308' : skin.rarity === 'epic' ? '#a855f7' : '#3b82f6' }}
                              />
                              {currentSkin === index && (
                                <div className={`absolute -top-1 -right-1 bg-gradient-to-r ${getRarityColor(skin.rarity)} text-white rounded-full p-1`}>
                                  <Icon name="Check" size={12} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-base text-white">{skin.name}</div>
                              <div className="flex items-center gap-2 flex-wrap mt-1">
                                <Badge variant="outline" className="text-xs">
                                  <Icon name="Star" size={10} className="mr-1" />
                                  Ур. {skin.levelRequired}
                                </Badge>
                                <Badge className={`text-xs bg-gradient-to-r ${getRarityColor(skin.rarity)}`}>
                                  {skin.rarity === 'legendary' ? '⭐' : skin.rarity === 'epic' ? '💜' : skin.rarity === 'rare' ? '💙' : '⚪'}
                                  {skin.rarity.toUpperCase()}
                                </Badge>
                                {skin.unlocked && (
                                  <Badge variant="secondary" className="text-xs">Куплен</Badge>
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
                              className="font-bold min-w-[110px] bg-green-600 hover:bg-green-700"
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
                    <Card key={skill.id} className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-slate-800 to-slate-900 border-green-500/20">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-green-500/20 p-3 rounded-xl">
                            <Icon name={skill.icon} size={24} className="text-green-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-bold text-base text-white">{skill.name}</div>
                              <Badge className="font-bold text-xs bg-green-700">Ур. {skill.level}</Badge>
                            </div>
                            <div className="text-xs text-gray-400 mb-1">{skill.description}</div>
                            <Badge variant="secondary" className="font-semibold text-xs">
                              {skill.effect}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => upgradeSkill(skill.id)}
                          disabled={coins < skill.cost}
                          size="sm"
                          className="font-bold min-w-[110px] bg-green-600 hover:bg-green-700"
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

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-4">
          <Card className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white shadow-2xl border-4 border-white/20 backdrop-blur-xl px-8 py-4">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-xs font-medium opacity-90">ДЕНЬГИ</div>
                <div className="text-3xl font-bold">{Math.floor(coins).toLocaleString()}</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="text-center">
                <div className="text-xs font-medium opacity-90">ДОХОД/СЕК</div>
                <div className="text-3xl font-bold">{coinsPerSecond.toFixed(1)}</div>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="text-center">
                <div className="text-xs font-medium opacity-90">УРОН</div>
                <div className="text-3xl font-bold">{Math.floor(clickPower)}x</div>
              </div>
            </div>
          </Card>
          <Button 
            onClick={resetGame}
            variant="destructive"
            size="lg"
            className="bg-red-700 hover:bg-red-800"
          >
            <Icon name="RotateCcw" size={20} />
          </Button>
        </div>

        <div className="fixed top-4 right-4 z-50">
          <Button 
            onClick={() => setShowAchievements(!showAchievements)}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-2xl"
            size="lg"
          >
            <Icon name="Trophy" size={20} className="mr-2" />
            Достижения
            {achievements.filter(a => a.completed).length > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-black font-bold">
                {achievements.filter(a => a.completed).length}/{achievements.length}
              </Badge>
            )}
          </Button>

          {showAchievements && (
            <Card className="bg-slate-800/95 backdrop-blur-xl border-orange-500/30 p-4 max-w-xs mt-2 shadow-2xl">
              <div className="text-orange-400 font-bold mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Trophy" size={20} />
                  Достижения
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAchievements(false)}
                  className="h-6 w-6 p-0"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {achievements.map(ach => (
                  <div key={ach.id} className={`text-xs p-3 rounded-lg transition-all ${
                    ach.completed 
                      ? 'bg-gradient-to-r from-green-900/70 to-emerald-900/70 text-green-300 border-2 border-green-500/50' 
                      : 'bg-slate-700/50 text-gray-400 border border-slate-600'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={ach.icon} size={16} />
                      <span className="font-semibold">{ach.name}</span>
                      {ach.completed && <Icon name="CheckCircle2" size={14} className="ml-auto text-green-400" />}
                    </div>
                    <div className="text-[11px] mt-1 opacity-90">{ach.description}</div>
                    {ach.completed && (
                      <div className="text-xs text-yellow-400 mt-2 font-bold flex items-center gap-1">
                        <Icon name="Coins" size={12} />
                        +{ach.reward} монет
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;