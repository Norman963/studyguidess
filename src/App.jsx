/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, X, Maximize2, Minimize2, Play, Info } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(gamesData.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getCategoryDot = (cat) => {
    switch (cat) {
      case 'All': return 'bg-blue-400';
      case 'Puzzle': return 'bg-emerald-400';
      case 'Arcade': return 'bg-purple-400';
      case 'Action': return 'bg-red-400';
      case 'Classic': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen flex p-4 md:p-6 gap-6 overflow-x-hidden">
      <div className="bg-mesh" />

      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col glass w-72 h-[calc(100vh-3rem)] sticky top-6 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-10 overflow-hidden">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg border border-white/20 shrink-0" />
          <h1 className="text-2xl font-black tracking-tighter leading-none">ARCADE<span className="text-white/20">_</span></h1>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-4 px-2">Navigation</p>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group
                ${activeCategory === cat 
                  ? 'glass bg-white/10 text-white shadow-xl translate-x-1' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
            >
              <div className={`w-2 h-2 rounded-full ${getCategoryDot(cat)} shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:scale-125 transition-transform`} />
              {cat === 'All' ? 'Popular Games' : `${cat} Games`}
            </button>
          ))}
        </nav>

        <div className="card-glass p-4 mt-6">
          <div className="text-[10px] uppercase font-black text-white/30 mb-2">SYSTEM STATUS</div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            Servers Online
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col gap-6">
        {/* Header */}
        <header className="glass rounded-2xl md:rounded-3xl p-3 md:p-4 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex-1 max-w-lg relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white/70 transition-colors" />
            <input
              type="text"
              placeholder="Search Games..."
              className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all font-medium text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 px-2">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">LIVE PLAYERS</span>
              <span className="text-xs font-bold">1,402 Online</span>
            </div>
            <div className="w-10 h-10 rounded-full glass border-white/20 flex items-center justify-center bg-emerald-500/10">
               <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            </div>
          </div>
        </header>

        {/* Mobile Categories (Scrollable) */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-xl text-xs font-black uppercase transition-all
                ${activeCategory === cat 
                  ? 'glass bg-white/10 text-white shadow-lg' 
                  : 'text-white/50 hover:bg-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <section className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game) => (
                <motion.div
                  layout
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedGame(game)}
                  className="group cursor-pointer flex flex-col card-glass rounded-2xl overflow-hidden shadow-2xl shadow-black/20"
                >
                  <div className={`aspect-video relative overflow-hidden m-2 rounded-xl`}>
                    <div className={`absolute inset-0 opacity-80 ${game.color.replace('bg-', 'bg-gradient-to-br from-')}`} />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    <Gamepad2 className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 group-hover:scale-125 transition-transform duration-500 text-white" />
                    <div className="absolute top-3 left-3 px-2 py-0.5 glass border-white/10 rounded-lg text-[9px] font-black uppercase tracking-wider backdrop-blur-md">
                      {game.category}
                    </div>
                  </div>
                  <div className="p-5 pt-2">
                    <div className="flex flex-col gap-1 mb-4">
                      <h3 className="text-base font-black uppercase tracking-tight leading-tight">{game.title}</h3>
                      <p className="text-white/40 text-[11px] font-medium truncate font-mono">
                        {game.description}
                      </p>
                    </div>
                    <button className="w-full py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all transform group-active:scale-95 shadow-[0_8px_16px_-4px_rgba(255,255,255,0.2)]">
                      Play Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredGames.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="glass w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-white/20" />
              </div>
              <h2 className="text-xl font-black mb-2 uppercase tracking-wide">Signal Lost</h2>
              <p className="text-white/40 text-sm max-w-xs">We couldn't find any games matching your request in the grid.</p>
            </div>
          )}
        </section>

        {/* Footer in Main Content */}
        <footer className="glass rounded-3xl p-8 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-md" />
                <span className="text-sm font-black uppercase tracking-tighter">ARCADE_</span>
              </div>
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest">
                Excellence in browser gaming
              </p>
            </div>
            <div className="flex gap-12">
               <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/40">
                  <a href="#" className="hover:text-white transition-colors">Contact</a>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
               </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 overflow-hidden"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedGame(null)}
            />
            
            <motion.div
              layoutId={selectedGame.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-7xl flex flex-col glass rounded-3xl overflow-hidden shadow-[0_64px_96px_-12px_rgba(0,0,0,0.8)] transition-all duration-500 ${
                isFullscreen ? 'fixed inset-0 max-w-none rounded-none border-0 h-screen' : 'h-[90vh]'
              }`}
            >
              <div className="flex items-center justify-between px-6 md:px-8 py-4 glass border-0 border-b border-white/5">
                <div className="flex items-center gap-4">
                   <div className={`flex p-2 rounded-xl glass border-white/20`}>
                      <Gamepad2 className="w-5 h-5" />
                   </div>
                   <div className="flex flex-col">
                      <h2 className="text-lg md:text-xl font-black uppercase tracking-tight leading-none">{selectedGame.title}</h2>
                      <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">{selectedGame.category}</span>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleFullscreen}
                    className="p-3 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-2xl transition-all border border-red-500/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-black/40 relative">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              {!isFullscreen && (
                <div className="p-6 glass border-0 border-t border-white/5">
                   <div className="flex items-start gap-4">
                      <div className="mt-1 glass p-2 rounded-lg">
                        <Info className="w-4 h-4 text-white/40" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-[12px] font-bold text-white/30 uppercase tracking-widest">Description</p>
                        <p className="text-white/70 max-w-4xl text-sm leading-relaxed">
                          {selectedGame.description}
                        </p>
                      </div>
                   </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
