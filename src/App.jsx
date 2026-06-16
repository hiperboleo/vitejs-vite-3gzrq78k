import React, { useState, useMemo, useEffect } from 'react';
import { Coffee, Flame, Droplet, Star, Wind, Zap, Filter, ArrowUpDown, X, Award, Plus, Minus, Package, Loader2, CupSoda } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';

// A SUA Configuração Firebase Oficial
const firebaseConfig = {
  apiKey: "AIzaSyDj2wpcvGbm6OxEC-6OKFpYs78hCtSU38Y",
  authDomain: "espresso-trunfo.firebaseapp.com",
  projectId: "espresso-trunfo",
  storageBucket: "espresso-trunfo.firebasestorage.app",
  messagingSenderId: "731978997608",
  appId: "1:731978997608:web:fca6134088483f0be680dd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "espresso-trunfo-oficial";

const initialCoffeeData = [
  {
    id: 'amendoas', name: 'Amêndoas Torradas', brand: 'Baggio Café', line: 'Aromas',
    color: '#b281b3', description: 'Toque suave e amendoado, perfeito para paladares delicados.',
    stats: { intensidade: 7, docura: 6, corpo: 5, aroma: 8, acidez: 3 }, superTrunfo: false,
    notes: ['Amendoado', 'Suave'], stock: 12, preparation: ['Espresso 40ml']
  },
  {
    id: 'vanilla', name: 'Vanilla', brand: 'Baggio Café', line: 'Aromas',
    color: '#00b4d8', description: 'Clássico e aveludado, com notas doces de baunilha.',
    stats: { intensidade: 7, docura: 8, corpo: 5, aroma: 9, acidez: 2 }, superTrunfo: false,
    notes: ['Baunilha', 'Doce'], stock: 8, preparation: ['Espresso 40ml', 'Lungo 110ml']
  },
  {
    id: 'menta', name: 'Chocolate com Menta', brand: 'Baggio Café', line: 'Aromas',
    color: '#7cb342', description: 'Refrescante e surpreendente. O equilíbrio do cacau com a menta.',
    stats: { intensidade: 7, docura: 7, corpo: 6, aroma: 9, acidez: 2 }, superTrunfo: false,
    notes: ['Chocolate', 'Menta'], stock: 0, preparation: ['Espresso 40ml']
  },
  {
    id: 'trufado', name: 'Chocolate Trufado', brand: 'Baggio Café', line: 'Aromas',
    color: '#5d4037', description: 'Intenso, cremoso e com notas profundas de trufa de chocolate.',
    stats: { intensidade: 8, docura: 7, corpo: 7, aroma: 10, acidez: 2 }, superTrunfo: true,
    notes: ['Chocolate', 'Intenso'], stock: 15, preparation: ['Ristretto 25ml', 'Espresso 40ml']
  },
  {
    id: 'avela', name: 'Chocolate com Avelã', brand: 'Baggio Café', line: 'Aromas',
    color: '#e53935', description: 'A combinação perfeita que lembra os melhores cremes de avelã.',
    stats: { intensidade: 7, docura: 7, corpo: 7, aroma: 9, acidez: 2 }, superTrunfo: false,
    notes: ['Chocolate', 'Avelã'], stock: 10, preparation: ['Espresso 40ml']
  },
  {
    id: 'caramelo', name: 'Caramelo', brand: 'Baggio Café', line: 'Aromas',
    color: '#d4af37', description: 'Doce na medida certa, aroma inconfundível de caramelo tostado.',
    stats: { intensidade: 7, docura: 9, corpo: 5, aroma: 9, acidez: 2 }, superTrunfo: false,
    notes: ['Caramelo', 'Doce'], stock: 7, preparation: ['Espresso 40ml']
  },
  {
    id: 'arara', name: 'Arara', brand: 'Coffee++', line: 'Origens',
    color: '#F9A826',
    description: 'Doçura natural marcante com notas de caramelo e frutas amarelas.',
    stats: { intensidade: 6, docura: 9, corpo: 6, aroma: 8, acidez: 5 }, superTrunfo: false,
    notes: ['Caramelo', 'Frutado', 'Doce'], stock: 20, preparation: ['Espresso 40ml']
  },
  {
    id: 'tokyo', name: 'Tokyo Vivalto Lungo', brand: 'Nespresso', line: 'World Explorations',
    color: '#4b6faa',
    description: 'Aromas florais refinados e um toque de complexidade elegante.',
    stats: { intensidade: 6, docura: 5, corpo: 4, aroma: 8, acidez: 5 }, superTrunfo: false,
    notes: ['Floral', 'Complexo'], stock: 14,
    image: 'https://www.nespresso.com/ecom/medias/sys_master/public/16724845232158/tokyo-lungo-2x.png?impolicy=small&imwidth=112&imdensity=1',
    preparation: ['Lungo 110ml']
  },
  {
    id: 'ethiopia', name: 'Ethiopia', brand: 'Nespresso', line: 'Master Origins',
    color: '#F47C59',
    description: 'Colhido à mão sob o sol. Notas florais exuberantes e de geleia de frutas.',
    stats: { intensidade: 4, docura: 7, corpo: 3, aroma: 9, acidez: 6 }, superTrunfo: false,
    notes: ['Floral', 'Frutado'], stock: 6,
    image: 'https://www.nespresso.com/ecom/medias/sys_master/public/16653733724190/ethiopia-2x.png?impolicy=small&imwidth=112&imdensity=1',
    preparation: ['Espresso 40ml', 'Lungo 110ml']
  },
  {
    id: 'volluto', name: 'Volluto', brand: 'Nespresso', line: 'Ispirazione Italiana',
    color: '#E6C200',
    description: 'Doce e leve, com notas reconfortantes de biscoito e cereais.',
    stats: { intensidade: 4, docura: 8, corpo: 4, aroma: 7, acidez: 4 }, superTrunfo: false,
    notes: ['Biscoito', 'Cereais', 'Doce'], stock: 11,
    image: 'https://www.nespresso.com/ecom/medias/sys_master/public/16724852604958/volluto-2x.png?impolicy=small&imwidth=112&imdensity=1',
    preparation: ['Espresso 40ml']
  },
  {
    id: 'mexico', name: 'Mexico', brand: 'Nespresso', line: 'Master Origins',
    color: '#C35831',
    description: 'Intenso e com notas de especiarias e madeira, originário de Chiapas.',
    stats: { intensidade: 7, docura: 4, corpo: 8, aroma: 8, acidez: 3 }, superTrunfo: false,
    notes: ['Especiarias', 'Amadeirado'], stock: 9, preparation: ['Espresso 40ml', 'Lungo 110ml']
  },
  {
    id: 'caramellonespresso', name: 'Caramello', brand: 'Nespresso', line: 'Barista Creations',
    color: '#E5C088',
    description: 'Aroma reconfortante de caramelo amendoado sobre base de arábicas suaves.',
    stats: { intensidade: 6, docura: 8, corpo: 5, aroma: 9, acidez: 3 }, superTrunfo: false,
    notes: ['Caramelo', 'Amendoado'], stock: 18,
    image: 'https://www.nespresso.com/ecom/medias/sys_master/public/17431332945950/C-1061-Responsive-PLP.png?impolicy=small&imwidth=112&imdensity=1',
    preparation: ['Espresso 40ml']
  },
  {
    id: 'cioccolatino', name: 'Cioccolatino', brand: 'Nespresso', line: 'Barista Creations',
    color: '#4A3424',
    description: 'Elegantes notas de chocolate amargo criam uma harmonia indulgente.',
    stats: { intensidade: 6, docura: 7, corpo: 6, aroma: 9, acidez: 2 }, superTrunfo: false,
    notes: ['Chocolate', 'Amargo'], stock: 13,
    image: 'https://www.nespresso.com/ecom/medias/sys_master/public/17431322361886/C-1060-Responsive-PLP.png?impolicy=small&imwidth=112&imdensity=1',
    preparation: ['Espresso 40ml']
  },
  {
    id: 'vaniglianespresso', name: 'Vaniglia', brand: 'Nespresso', line: 'Barista Creations',
    color: '#E8D5B5',
    description: 'Aroma clássico de baunilha em perfeita harmonia com um expresso suave e sedoso.',
    stats: { intensidade: 6, docura: 8, corpo: 5, aroma: 9, acidez: 3 }, superTrunfo: false,
    notes: ['Baunilha', 'Suave'], stock: 10,
    image: 'https://www.nespresso.com/ecom/medias/sys_master/public/17432222531614/C-1062-Responsive-PLP.png?impolicy=small&imwidth=112&imdensity=1',
    preparation: ['Espresso 40ml']
  },
  {
    id: 'freddo', name: 'Freddo Intenso', brand: 'Nespresso', line: 'Barista Creations',
    color: '#1D3B5C',
    description: 'Torrado escuro para revelar notas amadeiradas e de cereais torrados quando servido com gelo.',
    stats: { intensidade: 9, docura: 3, corpo: 8, aroma: 7, acidez: 2 }, superTrunfo: false,
    notes: ['Amadeirado', 'Cereais', 'Torrado'], stock: 22,
    preparation: ['Espresso 40ml', 'Com Gelo']
  },
  {
    id: 'espressoroast', name: 'Espresso Roast', brand: 'Starbucks', line: 'by Nespresso',
    color: '#4B515D',
    description: 'O coração do café artesanal. Torra muito escura, rico e com notas de caramelo.',
    stats: { intensidade: 11, docura: 3, corpo: 9, aroma: 8, acidez: 2 }, superTrunfo: false,
    notes: ['Caramelo', 'Torrado', 'Intenso'], stock: 0,
    preparation: ['Ristretto 25ml', 'Espresso 40ml']
  }
];

const defaultStats = {
  intensidade: { min: 0, max: 13, limit: 13 },
  docura: { min: 0, max: 10, limit: 10 },
  corpo: { min: 0, max: 10, limit: 10 },
  acidez: { min: 0, max: 10, limit: 10 },
  aroma: { min: 0, max: 10, limit: 10 }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [brandFilter, setBrandFilter] = useState('Todas');
  const [noteFilter, setNoteFilter] = useState('Todas');
  const [prepFilter, setPrepFilter] = useState('Todas');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [statsFilter, setStatsFilter] = useState(defaultStats);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Erro no login anônimo", error);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const coffeesRef = collection(db, 'artifacts', appId, 'public', 'data', 'coffees');
    
    const unsubscribe = onSnapshot(coffeesRef, (snapshot) => {
      if (snapshot.empty) {
        initialCoffeeData.forEach(async (coffee) => {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'coffees', coffee.id), coffee);
        });
      } else {
        const fetched = snapshot.docs.map(doc => doc.data());
        
        const mergedCoffees = initialCoffeeData.map(initialCoffee => {
          const savedCoffee = fetched.find(f => f.id === initialCoffee.id);
          if (savedCoffee) {
            return { ...initialCoffee, stock: savedCoffee.stock };
          }
          setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'coffees', initialCoffee.id), initialCoffee);
          return initialCoffee;
        });

        setCoffees(mergedCoffees);
        setLoading(false);
      }
    }, (error) => {
      console.error("Erro ao buscar cápsulas do Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const uniqueBrands = useMemo(() => [...new Set(coffees.map(c => c.brand))], [coffees]);
  const uniqueNotes = useMemo(() => [...new Set(coffees.flatMap(c => c.notes))], [coffees]);
  const uniquePreps = useMemo(() => {
    const preps = coffees.flatMap(c => c.preparation || []);
    return [...new Set(preps)].sort();
  }, [coffees]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (brandFilter !== 'Todas') count++;
    if (noteFilter !== 'Todas') count++;
    if (prepFilter !== 'Todas') count++;
    if (inStockOnly) count++;
    Object.keys(statsFilter).forEach(key => {
      if (statsFilter[key].min > 0 || statsFilter[key].max < statsFilter[key].limit) count++;
    });
    return count;
  }, [brandFilter, noteFilter, prepFilter, inStockOnly, statsFilter]);

  const resetFilters = () => {
    setBrandFilter('Todas');
    setNoteFilter('Todas');
    setPrepFilter('Todas');
    setStatsFilter(defaultStats);
    setSearch('');
    setSortOrder('name-asc');
    setInStockOnly(false);
  };

  const handleSliderChange = (statKey, newMin, newMax) => {
    setStatsFilter(prev => ({
      ...prev,
      [statKey]: { ...prev[statKey], min: newMin, max: newMax }
    }));
  };

  const updateStock = async (id, delta) => {
    if (!user) return;
    const coffee = coffees.find(c => c.id === id);
    if (!coffee) return;
    
    const newStock = Math.max(0, coffee.stock + delta);
    
    setCoffees(prev => prev.map(c => c.id === id ? { ...c, stock: newStock } : c));
    
    const coffeeRef = doc(db, 'artifacts', appId, 'public', 'data', 'coffees', id);
    await updateDoc(coffeeRef, { stock: newStock }).catch(err => console.error("Erro ao guardar:", err));
  };

  const filteredAndSorted = useMemo(() => {
    if (!coffees.length) return [];
    
    let result = coffees.filter(coffee => {
      const matchSearch = coffee.name.toLowerCase().includes(search.toLowerCase()) || 
                          coffee.description.toLowerCase().includes(search.toLowerCase());
      const matchBrand = brandFilter === 'Todas' || coffee.brand === brandFilter;
      const matchNote = noteFilter === 'Todas' || coffee.notes.includes(noteFilter);
      const matchPrep = prepFilter === 'Todas' || (coffee.preparation && coffee.preparation.includes(prepFilter));
      const matchStock = inStockOnly ? coffee.stock > 0 : true;
      const matchStats = Object.keys(statsFilter).every(key => {
        const val = coffee.stats[key] || 0;
        return val >= statsFilter[key].min && val <= statsFilter[key].max;
      });

      return matchSearch && matchBrand && matchNote && matchPrep && matchStock && matchStats;
    });

    result.sort((a, b) => {
      switch (sortOrder) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'int-desc': return b.stats.intensidade - a.stats.intensidade;
        case 'doc-desc': return b.stats.docura - a.stats.docura;
        case 'corpo-desc': return b.stats.corpo - a.stats.corpo;
        case 'acidez-desc': return b.stats.acidez - a.stats.acidez;
        case 'stock-desc': return b.stock - a.stock;
        case 'stock-asc': return a.stock - b.stock;
        default: return 0;
      }
    });

    return result;
  }, [coffees, search, brandFilter, noteFilter, prepFilter, statsFilter, inStockOnly, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-amber-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl font-bold uppercase tracking-wider text-stone-300">A aquecer a caldeira...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-stone-800 p-4 md:p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <Coffee className="text-amber-500 w-8 h-8" />
            <h1 className="text-2xl md:text-3xl font-black text-stone-100 uppercase tracking-wider">Espresso Trunfo</h1>
          </div>
          
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="text" 
              placeholder="Buscar cápsula..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 px-4 py-2 bg-stone-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-stone-400"
            />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors relative ${showFilters ? 'bg-amber-600 text-white' : 'bg-stone-700 hover:bg-stone-600 text-stone-200'}`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filtros & Ordenação</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Painel de Filtros */}
        {showFilters && (
          <div className="bg-stone-800 p-6 rounded-2xl shadow-xl space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-700 pb-4 gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><ArrowUpDown className="w-5 h-5 text-amber-500"/> Configurações de Busca</h2>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-stone-700 hover:bg-stone-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold text-stone-200 select-none">
                  <input 
                    type="checkbox" 
                    checked={inStockOnly} 
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  Apenas com Estoque
                </label>

                {activeFiltersCount > 0 && (
                  <button onClick={resetFilters} className="text-sm flex items-center gap-1 text-stone-400 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" /> Limpar
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-stone-400">Marca</label>
                <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="p-2 rounded-lg bg-stone-700 text-white focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="Todas">Todas</option>
                  {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-stone-400">Nota Sensorial</label>
                <select value={noteFilter} onChange={e => setNoteFilter(e.target.value)} className="p-2 rounded-lg bg-stone-700 text-white focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="Todas">Todas</option>
                  {uniqueNotes.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-stone-400">Preparo (Essenza Mini)</label>
                <select value={prepFilter} onChange={e => setPrepFilter(e.target.value)} className="p-2 rounded-lg bg-stone-700 text-white focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="Todas">Todos</option>
                  {uniquePreps.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-stone-400">Ordenar por</label>
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="p-2 rounded-lg bg-stone-700 text-white focus:ring-2 focus:ring-amber-500 outline-none font-bold text-amber-100">
                  <option value="name-asc">Nome (A-Z)</option>
                  <option value="stock-desc">Estoque: Maior para Menor</option>
                  <option value="stock-asc">Estoque: Menor para Maior</option>
                  <option value="int-desc">Maior Intensidade</option>
                  <option value="doc-desc">Maior Doçura</option>
                  <option value="corpo-desc">Maior Corpo</option>
                  <option value="acidez-desc">Maior Acidez</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pt-4 border-t border-stone-700">
              {[
                { key: 'intensidade', label: 'Intensidade', icon: Flame },
                { key: 'docura', label: 'Doçura', icon: Star },
                { key: 'corpo', label: 'Corpo', icon: Droplet },
                { key: 'acidez', label: 'Acidez', icon: Zap },
                { key: 'aroma', label: 'Aroma', icon: Wind },
              ].map(stat => {
                const limit = statsFilter[stat.key].limit;
                const minVal = statsFilter[stat.key].min;
                const maxVal = statsFilter[stat.key].max;
                
                return (
                  <div key={stat.key} className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-stone-300 flex items-center justify-between">
                      <span className="flex items-center gap-1"><stat.icon className="w-4 h-4 text-amber-500" /> {stat.label}</span>
                      <span className="bg-stone-700 px-2 rounded text-xs">{minVal} a {maxVal}</span>
                    </label>
                    <div className="relative w-full h-5 flex items-center">
                      <div className="absolute w-full h-1.5 bg-stone-700 rounded-full"></div>
                      <div 
                        className="absolute h-1.5 bg-amber-500 rounded-full" 
                        style={{ left: `${(minVal / limit) * 100}%`, right: `${100 - (maxVal / limit) * 100}%` }}
                      ></div>
                      <input 
                        type="range" min="0" max={limit} value={minVal} 
                        onChange={(e) => handleSliderChange(stat.key, Math.min(Number(e.target.value), maxVal), maxVal)}
                        className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 
                                  [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
                                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-amber-100 
                                  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-600 [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                      />
                      <input 
                        type="range" min="0" max={limit} value={maxVal} 
                        onChange={(e) => handleSliderChange(stat.key, minVal, Math.max(Number(e.target.value), minVal))}
                        className="absolute w-full appearance-none bg-transparent pointer-events-none z-30 
                                  [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
                                  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-amber-100 
                                  [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-600 [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ecrã de Cartões */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
          {filteredAndSorted.length === 0 ? (
            <div className="col-span-full text-center py-12 text-stone-400">
              <Coffee className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl">Opa! Nem pingando na Clever Drip... nenhuma cápsula atendeu aos critérios ou estás sem stock dessa maravilha.</p>
            </div>
          ) : (
            filteredAndSorted.map(coffee => (
              <div 
                key={coffee.id} 
                className={`relative bg-[#f4f1ea] rounded-xl shadow-lg transition-all duration-300 transform overflow-visible flex flex-col ${coffee.stock === 0 ? 'opacity-70 grayscale-[0.3]' : 'hover:shadow-2xl hover:-translate-y-1'}`}
                style={{ borderTopWidth: '10px', borderTopColor: coffee.stock === 0 ? '#9ca3af' : coffee.color }}
              >
                {/* Círculo Flutuante */}
                <div 
                  className="absolute -top-6 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-md overflow-hidden text-white border-4"
                  style={{ 
                    backgroundColor: coffee.image ? '#ffffff' : (coffee.stock === 0 ? '#9ca3af' : coffee.color),
                    borderColor: coffee.image ? (coffee.stock === 0 ? '#9ca3af' : coffee.color) : '#f4f1ea'
                  }}
                >
                  {coffee.image ? (
                    <img 
                      src={coffee.image} 
                      alt={coffee.name} 
                      className={`w-full h-full p-0.5 transition-transform object-contain transform hover:scale-110`} 
                    />
                  ) : (
                    <Coffee className="w-5 h-5" />
                  )}
                </div>

                {/* Selo Super Trunfo */}
                {coffee.superTrunfo && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-yellow-900 text-xs font-black px-3 py-1 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.6)] flex items-center gap-1 z-10 border border-yellow-200">
                    <Award className="w-4 h-4" /> SUPER TRUNFO
                  </div>
                )}

                <div className="p-5 pt-8 flex-1 flex flex-col">
                  <div className="mb-2">
                    <p className="text-xs font-bold text-stone-500 tracking-wider uppercase">{coffee.brand} • {coffee.line}</p>
                    <h3 className="text-xl font-black text-stone-800 leading-tight mt-1">
                      {coffee.name} {coffee.stock === 0 && <span className="text-sm text-red-500 ml-1">(Esgotado)</span>}
                    </h3>
                  </div>

                  <div className="bg-stone-200 rounded-lg p-3 mb-4 relative">
                    <p className="text-sm italic text-stone-700 leading-snug">"{coffee.description}"</p>
                  </div>

                  {/* Badges: Notas + Preparo */}
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex flex-wrap gap-1.5">
                      {coffee.notes.map(note => (
                        <span key={note} className="px-2 py-0.5 bg-stone-300 text-stone-700 text-[10px] font-bold rounded-full uppercase tracking-wide">
                          {note}
                        </span>
                      ))}
                    </div>
                    
                    {coffee.preparation && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {coffee.preparation.map(prep => (
                          <span key={prep} className="flex items-center gap-1 px-2 py-0.5 border border-stone-400 text-stone-600 text-[10px] font-bold rounded-full bg-[#f4f1ea] shadow-sm uppercase">
                            {prep.includes('Gelo') ? <CupSoda className="w-3 h-3 text-blue-500"/> : <Droplet className="w-3 h-3 text-stone-500"/>}
                            {prep}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Barras de Progresso na Cor da Cápsula */}
                  <div className="space-y-3 mb-4 flex-1">
                    {[
                      { key: 'intensidade', label: 'Intensidade', icon: Flame, max: 13 },
                      { key: 'docura', label: 'Doçura', icon: Star, max: 10 },
                      { key: 'corpo', label: 'Corpo', icon: Droplet, max: 10 },
                      { key: 'acidez', label: 'Acidez', icon: Zap, max: 10 },
                      { key: 'aroma', label: 'Aroma', icon: Wind, max: 10 }
                    ].map(stat => (
                      <div key={stat.key} className="flex items-center gap-2 text-stone-800">
                        <div className="w-6 flex justify-center"><stat.icon className="w-4 h-4 text-stone-500" /></div>
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] font-bold uppercase mb-0.5">
                            <span>{stat.label}</span>
                            <span>{coffee.stats[stat.key]} / {stat.max}</span>
                          </div>
                          <div className="w-full bg-stone-300 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${(coffee.stats[stat.key] / stat.max) * 100}%`,
                                backgroundColor: coffee.stock === 0 ? '#9ca3af' : coffee.color 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Controlo de Stock */}
                  <div className="mt-auto pt-4 border-t border-stone-300 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-600 font-bold text-sm">
                      <Package className={`w-4 h-4 ${coffee.stock === 0 ? 'text-red-500' : ''}`} />
                      <span className={coffee.stock === 0 ? 'text-red-500' : ''}>ESTOQUE</span>
                    </div>
                    <div className="flex items-center bg-stone-200 rounded-full p-1 shadow-inner">
                      <button 
                        onClick={() => updateStock(coffee.id, -1)} 
                        disabled={coffee.stock === 0}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-stone-800 hover:bg-stone-100 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className={`w-10 text-center font-black ${coffee.stock === 0 ? 'text-red-500' : 'text-stone-800'}`}>
                        {coffee.stock}
                      </span>
                      <button 
                        onClick={() => updateStock(coffee.id, 1)} 
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-stone-800 hover:bg-stone-100 shadow-sm transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}