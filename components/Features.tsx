import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, Cell, Tooltip } from 'recharts';
import { Layout, Target, Zap, Search, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';

const velocityData = [
  { name: '10ms', val: 98 },
  { name: '20ms', val: 95 },
  { name: '30ms', val: 90 },
  { name: '40ms', val: 82 },
  { name: '50ms', val: 75 },
  { name: '60ms', val: 40 },
  { name: '70ms', val: 20 },
];

const conversionData = [
  { name: 'W1', val: 20 },
  { name: 'W2', val: 25 },
  { name: 'W3', val: 45 },
  { name: 'W4', val: 38 },
  { name: 'W5', val: 65 },
  { name: 'W6', val: 72 },
  { name: 'W7', val: 85 },
];

const seoData = [
  { name: 'M1', val: 30 },
  { name: 'M2', val: 45 },
  { name: 'M3', val: 60 },
  { name: 'M4', val: 55 },
  { name: 'M5', val: 90 },
  { name: 'M6', val: 120 },
  { name: 'M7', val: 150 },
];

const neuroData = [
  { name: 'Hero', val: 95 },
  { name: 'CTA', val: 88 },
  { name: 'Nav', val: 45 },
  { name: 'Social', val: 78 },
  { name: 'Copy', val: 62 },
  { name: 'Footer', val: 30 },
];

const AnimatedNumber: React.FC<{ value: number; duration?: number; suffix?: string; prefix?: string; trigger: boolean }> = ({ value, duration = 2000, suffix = "", prefix = "", trigger }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);

  // Ease Out Cubic: 1 - (1 - t)^3
  const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    if (!trigger || hasAnimated.current) return;

    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const timeElapsed = timestamp - startTimeRef.current;
      const timeProgress = Math.min(timeElapsed / duration, 1);
      
      const easedProgress = easeOutCubic(timeProgress);
      const currentCount = Math.floor(easedProgress * value);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (timeProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        hasAnimated.current = true;
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration, trigger]);

  return <span className="tabular-nums">{prefix}{count}{suffix}</span>;
};

type Category = 'All' | 'Technical' | 'Creative' | 'Strategic';
type SortKey = 'priority' | 'impact' | 'alphabetical';

interface FeatureData {
  id: string;
  category: Category;
  title: string;
  description: string;
  metricValue: number;
  metricPrefix: string;
  metricSuffix: string;
  metricLabel: string;
  color: 'lime' | 'pink' | 'purple' | 'blue';
  icon: React.ReactNode;
  animationType: 'spin' | 'bounce';
  impactFactor: number; 
  priority: number;
}

const FEATURES_LIST: FeatureData[] = [
  {
    id: 'velocity',
    category: 'Technical',
    title: 'Velocity-First Architecture',
    description: 'Sites that load in sub-100ms. Speed is the foundation of modern user retention and SEO performance.',
    metricValue: 92,
    metricPrefix: '',
    metricSuffix: 'ms',
    metricLabel: 'Global Avg. TTFB',
    color: 'lime',
    icon: <Zap className="w-6 h-6 text-[#BFF549] transition-all duration-700 ease-in-out group-hover:rotate-[360deg] group-hover:scale-125 group-hover:drop-shadow-[0_0_12px_rgba(191,245,73,0.9)]" />,
    animationType: 'spin',
    impactFactor: 95,
    priority: 1,
  },
  {
    id: 'neuro',
    category: 'Creative',
    title: 'Neuro-Design Principles',
    description: 'We leverage eye-tracking data and cognitive bias research to direct user attention exactly where it counts.',
    metricValue: 12,
    metricPrefix: '',
    metricSuffix: 'x',
    metricLabel: 'Attention Capture',
    color: 'pink',
    icon: <Layout className="w-6 h-6 text-pink-500 transition-all duration-700 ease-in-out group-hover:-rotate-[360deg] group-hover:scale-125 group-hover:drop-shadow-[0_0_12px_rgba(236,72,153,0.9)]" />,
    animationType: 'spin',
    impactFactor: 88,
    priority: 2,
  },
  {
    id: 'cro',
    category: 'Strategic',
    title: 'Conversion CRO',
    description: 'Turn passive traffic into active revenue. Our funnels are stress-tested for maximum transaction density.',
    metricValue: 85,
    metricPrefix: '+',
    metricSuffix: '%',
    metricLabel: 'Checkout Lift',
    color: 'purple',
    icon: <Target className="w-6 h-6 text-purple-500 transition-all duration-300 group-hover:animate-bounce group-hover:scale-[1.3] group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.9)]" />,
    animationType: 'bounce',
    impactFactor: 92,
    priority: 3,
  },
  {
    id: 'seo',
    category: 'Strategic',
    title: 'Semantic SEO Strategy',
    description: 'We align your site structure with modern search intent, ensuring your brand stays dominant in organic rankings.',
    metricValue: 150,
    metricPrefix: '+',
    metricSuffix: '%',
    metricLabel: 'Organic Visibility',
    color: 'blue',
    icon: <Search className="w-6 h-6 text-blue-500 transition-all duration-300 group-hover:animate-bounce group-hover:scale-125 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.9)]" />,
    animationType: 'bounce',
    impactFactor: 90,
    priority: 4,
  }
];

const FeatureCard: React.FC<{ feature: FeatureData; colorClasses: any }> = ({ feature, colorClasses }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px' 
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`bg-zinc-900/40 rounded-[24px] sm:rounded-[40px] p-8 sm:p-10 md:p-12 border border-zinc-800/50 flex flex-col justify-between overflow-hidden relative group transition-all duration-700 hover:scale-[1.02] hover:bg-zinc-900/60 ${colorClasses[feature.color]} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    >
      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-0 pointer-events-none" />

      <div className="relative z-10">
        <div className={`w-14 h-14 bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 group-hover:bg-[#BFF549]/10`}>
          {feature.icon}
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-zinc-800/50 glass text-zinc-500`}>
            {feature.category}
          </span>
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight leading-none">{feature.title}</h3>
        <p className="text-zinc-400 text-base sm:text-lg mb-10 leading-relaxed font-medium">
          {feature.description}
        </p>
        <div className="flex items-end gap-5">
          <div className={`text-4xl sm:text-6xl font-black tracking-tighter leading-none ${feature.color === 'lime' ? 'text-[#BFF549]' : `text-${feature.color}-500`}`}>
            <AnimatedNumber 
              value={feature.metricValue} 
              prefix={feature.metricPrefix} 
              suffix={feature.metricSuffix} 
              trigger={isVisible}
            />
          </div>
          <div className="flex flex-col mb-1">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-tight">verified</span>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{feature.metricLabel}</span>
          </div>
        </div>
      </div>
      
      <div className="h-40 sm:h-48 mt-12 relative opacity-60 group-hover:opacity-100 transition-all duration-1000 flex items-center justify-center z-10">
        {feature.id === 'velocity' && (
          <ResponsiveContainer width="100%" aspect={2.6}>
            <BarChart data={velocityData}>
              <defs>
                <linearGradient id="barGradientLime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#BFF549" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#BFF549" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <Bar dataKey="val" radius={[6, 6, 0, 0]} isAnimationActive={isVisible} animationDuration={1500}>
                {velocityData.map((entry, index) => (
                  <Cell key={index} fill={index === 0 ? 'url(#barGradientLime)' : '#27272a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {feature.id === 'cro' && (
          <ResponsiveContainer width="100%" aspect={3.6}>
            <AreaChart data={conversionData}>
              <defs>
                <linearGradient id="colorPurp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="val" stroke="#a855f7" fillOpacity={1} fill="url(#colorPurp)" strokeWidth={4} isAnimationActive={isVisible} animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {feature.id === 'seo' && (
          <ResponsiveContainer width="100%" aspect={4}>
            <AreaChart data={seoData}>
              <defs>
                <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="stepAfter" dataKey="val" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBlue)" strokeWidth={4} isAnimationActive={isVisible} animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {feature.id === 'neuro' && (
          <ResponsiveContainer width="100%" aspect={3.2}>
            <BarChart data={neuroData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradientPink" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-zinc-950/90 border border-zinc-800 px-2 py-1 rounded shadow-2xl">
                        <p className="text-[10px] font-black text-white uppercase tracking-wider">{payload[0].value}% Score</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 10, fontWeight: 800}} dy={10} />
              <Bar dataKey="val" radius={[4, 4, 0, 0]} isAnimationActive={isVisible} animationDuration={1800}>
                {neuroData.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={entry.val > 80 ? 'url(#barGradientPink)' : '#27272a'}
                    className="transition-all duration-500 hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className={`absolute pointer-events-none transition-all duration-1000 opacity-0 group-hover:opacity-100 blur-[120px] rounded-full z-0 ${
        feature.color === 'lime' ? 'bg-[#BFF549]/15' : `bg-${feature.color}-500/15`
      } ${
        feature.id === 'velocity' ? 'top-0 right-0 w-80 h-80' :
        feature.id === 'neuro' ? '-bottom-20 -right-20 w-64 h-64' :
        feature.id === 'cro' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full' :
        'bottom-0 right-0 w-full h-full'
      }`} />
    </div>
  );
};

const Features: React.FC = () => {
  const [filter, setFilter] = useState<Category>('All');
  const [sort, setSort] = useState<SortKey>('priority');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredAndSortedFeatures = useMemo(() => {
    let result = [...FEATURES_LIST];
    
    if (filter !== 'All') {
      result = result.filter(f => f.category === filter);
    }

    result.sort((a, b) => {
      if (sort === 'impact') return b.impactFactor - a.impactFactor;
      if (sort === 'alphabetical') return a.title.localeCompare(b.title);
      return a.priority - b.priority;
    });

    return result;
  }, [filter, sort]);

  const colorClasses = {
    lime: 'hover:border-[#BFF549]/60 hover:shadow-[0_0_80px_rgba(191,245,73,0.3)]',
    pink: 'hover:border-pink-500/60 hover:shadow-[0_0_80px_rgba(236,72,153,0.3)]',
    purple: 'hover:border-purple-500/60 hover:shadow-[0_0_80px_rgba(168,85,247,0.3)]',
    blue: 'hover:border-blue-500/60 hover:shadow-[0_0_80px_rgba(59,130,246,0.3)]',
  };

  return (
    <section id="features" className="py-24 md:py-40 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center mb-16 sm:mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#BFF549]/20 bg-[#BFF549]/5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BFF549] animate-pulse" />
          <span className="text-[10px] font-black text-[#BFF549] uppercase tracking-[0.3em]">Core Methodology</span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-[0.9] mb-12">
          Precision Engineering <br className="hidden md:block" /> 
          <span className="text-zinc-600">for Digital Dominance.</span>
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16">
          <div className="flex flex-wrap justify-center items-center gap-2 p-2 glass border border-zinc-800 rounded-2xl">
            {(['All', 'Technical', 'Creative', 'Strategic'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-500 ${
                  filter === cat 
                    ? 'bg-[#BFF549] text-zinc-950 shadow-[0_10px_25px_rgba(191,245,73,0.3)]' 
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative group/sort">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-4 px-8 py-4 glass border border-zinc-800 rounded-2xl text-[10px] font-black tracking-widest uppercase text-zinc-400 group-hover/sort:text-white group-hover/sort:border-zinc-700 transition-all duration-300"
            >
              <ArrowUpDown className="w-4 h-4 text-[#BFF549]" />
              {sort === 'priority' ? 'Recommended' : sort === 'impact' ? 'Highest Impact' : 'Alphabetical'}
              <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSortOpen && (
              <div className="absolute top-full mt-3 right-0 w-56 glass border border-zinc-800 rounded-2xl overflow-hidden z-20 shadow-3xl animate-in fade-in slide-in-from-top-2 duration-300">
                {[
                  { key: 'priority', label: 'Recommended' },
                  { key: 'impact', label: 'Highest Impact' },
                  { key: 'alphabetical', label: 'Alphabetical' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setSort(option.key as SortKey);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-6 py-4 text-[10px] font-black tracking-widest uppercase transition-all ${
                      sort === option.key ? 'bg-[#BFF549]/10 text-[#BFF549]' : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 min-h-[700px] transition-all duration-700 ease-in-out">
        {filteredAndSortedFeatures.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} colorClasses={colorClasses} />
        ))}

        {filteredAndSortedFeatures.length === 0 && (
          <div className="col-span-full py-32 text-center glass border border-dashed border-zinc-800 rounded-[40px] flex flex-col items-center justify-center">
            <Filter className="w-16 h-16 text-zinc-800 mb-6" />
            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] mb-6">No capabilities found.</p>
            <button 
              onClick={() => setFilter('All')}
              className="px-10 py-4 bg-zinc-800 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </section>
  );
};

export default Features;