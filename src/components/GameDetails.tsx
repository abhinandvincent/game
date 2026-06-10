import React, { useState } from 'react';
import { Game, GameStatus } from '../types';

interface GameDetailsProps {
  game: Game;
  onBack: () => void;
  onUpdateStatus: (gameId: string, status: GameStatus) => void;
  onUpdateGameStats: (
    gameId: string,
    updates: Partial<Pick<Game, 'playtime' | 'achievementsUnlocked' | 'deaths' | 'level' | 'journal'>>
  ) => void;
  onAddSession: (gameId: string, sessionTitle: string, hours: number) => void;
}

export default function GameDetails({
  game,
  onBack,
  onUpdateStatus,
  onUpdateGameStats,
  onAddSession,
}: GameDetailsProps) {
  const [journalText, setJournalText] = useState(game.journal);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Launching game simulator
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchTimer, setLaunchTimer] = useState(3);
  const [launchPlatform, setLaunchPlatform] = useState(game.platform[0] || 'PC');

  // Share overlay
  const [showShare, setShowShare] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Gallery slider / lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleSaveJournal = () => {
    setSaveStatus('saving');
    onUpdateGameStats(game.id, { journal: journalText });
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const triggerLaunchGame = () => {
    setIsLaunching(true);
    setLaunchTimer(3);
    const interval = setInterval(() => {
      setLaunchTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLaunching(false);
            // Auto add 1 hour to simulation details
            onAddSession(game.id, `Simulated Session in ${game.title}`, 1);
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCopyShareText = () => {
    const text = `🎮 QuestLog Progress Update: ${game.title}\n📊 Completion: ${game.progress}%\n⏱️ Playtime: ${game.playtime} Hours\n🏆 Achievements: ${game.achievementsUnlocked}/${game.achievementsTotal}\n💀 Deaths recorded: ${game.deaths}\n🔥 Current Level: ${game.level}\n${game.journal ? `📝 Journal: "${game.journal}"` : ''}`;
    navigator.clipboard.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Safe percentage helper
  const achievementPercentage = game.achievementsTotal > 0 
    ? Math.round((game.achievementsUnlocked / game.achievementsTotal) * 100) 
    : 0;

  return (
    <div className="flex-1 pb-24 md:pb-12 text-[#dae2fd]">
      {/* Cinematic Hero Header */}
      <header className="relative h-[480px] w-full overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover origin-center scale-105 filter brightness-90 saturate-110" 
            src={game.image} 
            alt={game.title}
            referrerPolicy="no-referrer"
          />
          {/* Subtle Parallax Fade Shader overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/60 to-[#0b1326]/10" />
        </div>

        {/* Back navigation buttons */}
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-[#0c1320]/80 backdrop-blur-md rounded-xl border border-white/10 hover:border-[#d0bcff]/50 text-white font-mono text-xs tracking-wider transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>BACK TO VAULT</span>
          </button>
        </div>

        {/* Hero title details block */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-[0.25em] font-semibold block">
              {game.subtitle || game.developer}
            </span>
            <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-white tracking-tight drop-shadow-md">
              {game.title}
            </h1>
            <div className="flex items-center flex-wrap gap-2.5 pt-1">
              <span className="bg-[#4cd7f6] text-[#00424e] px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                {game.metascore} Metascore
              </span>
              <span className="text-[#cbc3d7] font-mono text-xs">
                • {game.genre}
              </span>
              <span className="text-[#cbc3d7]/60 font-mono text-xs">
                • {game.platform.join(', ')}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 items-end">
            <label className="font-mono text-[10px] text-[#cbc3d7] uppercase tracking-wider font-semibold">Your Play Status</label>
            <select
              value={game.status}
              onChange={(e) => onUpdateStatus(game.id, e.target.value as GameStatus)}
              className="bg-[#171f33]/90 backdrop-blur-md border border-white/10 text-[#d0bcff] rounded-xl px-5 py-3 font-mono text-xs focus:ring-2 focus:ring-[#d0bcff] outline-none transition-all cursor-pointer shadow-lg"
            >
              <option value="playing">Currently Playing</option>
              <option value="backlog">In Backlog</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
        </div>
      </header>

      {/* Page Grid Context */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Columns (Main gameplay stats timeline and diary) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Bento statisttics boxes */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-[#d0bcff]">insights</span>
              <h2 className="font-headline font-bold text-lg">Your Journey Stats</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Playtime Card with Incrementers */}
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center relative group accent-glow border-white/10 text-center">
                <span className="font-mono text-[10px] text-[#cbc3d7] uppercase tracking-widest block mb-1">
                  Playtime
                </span>
                <span className="font-headline font-extrabold text-2xl text-white">
                  {game.playtime}h
                </span>
                
                {/* Micro-inputs plus/minus buttons */}
                <div className="flex gap-1.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => onUpdateGameStats(game.id, { playtime: Math.max(0, game.playtime - 1) })}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold font-mono hover:text-[#d0bcff] text-white"
                    title="Minus 1 hour"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => onUpdateGameStats(game.id, { playtime: game.playtime + 1 })}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold font-mono hover:text-[#d0bcff] text-white"
                    title="Plus 1 hour"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Achievements Unlocked Increments */}
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center relative group tracking-tight border-white/10 text-center">
                <span className="font-mono text-[10px] text-[#cbc3d7] uppercase tracking-widest block mb-1">
                  Achievements
                </span>
                <span className="font-headline font-extrabold text-2xl text-white">
                  {game.achievementsUnlocked}/{game.achievementsTotal}
                </span>

                <div className="flex gap-1.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => onUpdateGameStats(game.id, { achievementsUnlocked: Math.max(0, game.achievementsUnlocked - 1) })}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-white font-mono font-bold"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => onUpdateGameStats(game.id, { achievementsUnlocked: Math.min(game.achievementsTotal, game.achievementsUnlocked + 1) })}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-white font-mono font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Deaths tracker increments */}
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center relative group border-white/10 text-center">
                <span className="font-mono text-[10px] text-[#cbc3d7] uppercase tracking-widest block mb-1">
                  Deaths
                </span>
                <span className="font-headline font-extrabold text-2xl text-[#ffb2b7]">
                  {game.deaths}
                </span>

                <div className="flex gap-1.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => onUpdateGameStats(game.id, { deaths: Math.max(0, game.deaths - 5) })}
                    className="w-8 h-6 rounded bg-white/10 hover:bg-[#ffb2b7]/20 flex items-center justify-center text-[10px] text-white font-mono font-bold"
                    title="-5 deaths"
                  >
                    -5
                  </button>
                  <button 
                    onClick={() => onUpdateGameStats(game.id, { deaths: game.deaths + 1 })}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-[#ffb2b7]/20 flex items-center justify-center text-xs text-white font-mono font-bold"
                    title="+1 death"
                  >
                    +1
                  </button>
                  <button 
                    onClick={() => onUpdateGameStats(game.id, { deaths: game.deaths + 10 })}
                    className="w-8 h-6 rounded bg-white/10 hover:bg-[#ffb2b7]/20 flex items-center justify-center text-[10px] text-white font-mono font-bold"
                    title="+10 deaths"
                  >
                    +10
                  </button>
                </div>
              </div>

              {/* Level Tracker Info */}
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center relative group border-white/10 text-center">
                <span className="font-mono text-[10px] text-[#cbc3d7] uppercase tracking-widest block mb-1">
                  Hero Level
                </span>
                <span className="font-headline font-extrabold text-2xl text-white">
                  Lvl {game.level}
                </span>

                <div className="flex gap-1.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => onUpdateGameStats(game.id, { level: Math.max(1, game.level - 1) })}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-white font-mono font-bold"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => onUpdateGameStats(game.id, { level: game.level + 1 })}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs text-white font-mono font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Achievements Progress Indicator */}
          <section className="glass-card p-6 rounded-2xl border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-base text-white">Achievement Progress</h3>
              <span className="font-mono font-bold text-sm text-[#4cd7f6]">{achievementPercentage}%</span>
            </div>
            
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#d0bcff] to-[#4cd7f6] transition-all duration-500 rounded-full" 
                style={{ width: `${achievementPercentage}%` }}
              />
            </div>

            <div className="flex gap-4 mt-6 overflow-x-auto pb-2 custom-scrollbar no-scrollbar text-white">
              {/* Fake list achievements badge metrics */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#222a3d] border border-white/10 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer" title="Elden Lord (Completed Game)">
                <span className="material-symbols-outlined text-[#4cd7f6]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#222a3d] border border-white/10 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer" title="God-Slaying Armament">
                <span className="material-symbols-outlined text-[#4cd7f6]" style={{ fontVariationSettings: "'FILL' 1" }}>swords</span>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#222a3d] border border-white/10 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer" title="Demigod Morgott defeated">
                <span className="material-symbols-outlined text-[#4cd7f6]" style={{ fontVariationSettings: "'FILL' 1" }}>skull</span>
              </div>
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-[#222a3d] border border-white/10 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer ${achievementPercentage < 50 ? 'opacity-30 grayscale' : ''}`} title="Legendary Armaments">
                <span className="material-symbols-outlined text-[#4cd7f6]">auto_fix_high</span>
              </div>
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-[#222a3d] border border-white/10 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer ${achievementPercentage < 80 ? 'opacity-30 grayscale' : ''}`} title="Ranni Lunar Covenant Unveiled">
                <span className="material-symbols-outlined text-white">nights_stay</span>
              </div>
            </div>
          </section>

          {/* Interactive Adventurer's Diary Notes */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-[#d0bcff]">edit_note</span>
              <h2 className="font-headline font-bold text-lg">Adventurer's Journal</h2>
            </div>

            <div className="glass-card p-5 rounded-2xl border-white/10">
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Journal your progress... e.g. Defeated Maliketh after 4 attempts, using Rivers of Blood build..."
                className="w-full h-36 bg-transparent border-none focus:ring-0 text-sm font-sans text-white placeholder:text-gray-500 resize-none outline-none leading-relaxed"
              />
              <div className="flex justify-end pt-3 mt-1 border-t border-white/5">
                <button
                  onClick={handleSaveJournal}
                  disabled={saveStatus === 'saving'}
                  className={`px-5 py-2.5 font-mono text-xs font-semibold tracking-wider rounded-xl transition-all active:scale-95 ${
                    saveStatus === 'saved'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#d0bcff] hover:bg-[#bba5f7] text-[#3c0091] shadow-md shadow-[#d0bcff]/10'
                  }`}
                >
                  {saveStatus === 'saving' && 'Saving...'}
                  {saveStatus === 'saved' && 'Saved Successfully!'}
                  {saveStatus === 'idle' && 'SAVE JOURNAL ENTRY'}
                </button>
              </div>
            </div>
          </section>

          {/* Timeline sessions play log */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-[#d0bcff]">history</span>
              <h2 className="font-headline font-bold text-lg">Recent Sessions</h2>
            </div>

            {game.sessions.length === 0 ? (
              <div className="glass-card p-6 rounded-2xl text-center text-gray-500 text-sm">
                No active play session logs recorded for this game. Use Quick Log or Launch Game to begin!
              </div>
            ) : (
              <div className="space-y-4 pl-1">
                {game.sessions.map((sess, idx) => (
                  <div key={sess.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3.5 h-3.5 rounded-full mt-2.5 shrink-0 ${idx === 0 ? 'bg-[#4cd7f6] ring-4 ring-[#4cd7f6]/20' : 'bg-white/20'}`} />
                      {idx !== game.sessions.length - 1 && <div className="w-0.5 flex-grow bg-white/10 mt-1" />}
                    </div>

                    <div className="glass-card flex-grow p-4 rounded-xl flex justify-between items-center hover:bg-white/[0.03] transition-colors border-white/5">
                      <div>
                        <p className="font-semibold text-sm text-white">{sess.title}</p>
                        <p className="text-[11px] font-mono text-[#cbc3d7]/60 mt-1">
                          {sess.date} &bull; {sess.playtime} Hours
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Sidebar Columns (Metadata, Launch details and Gallery) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Metadata information sheet */}
          <section className="glass-card p-6 rounded-2xl space-y-4 border-white/10">
            <h3 className="font-mono text-xs text-[#d0bcff] font-bold border-b border-white/10 pb-2 mb-2 tracking-widest uppercase">
              Game Metadata
            </h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Release Date</span>
                <span className="text-white font-semibold">{game.releaseDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Developer</span>
                <span className="text-white font-semibold">{game.developer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Publisher</span>
                <span className="text-white font-semibold">{game.publisher}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Average Rating</span>
                <div className="flex items-center gap-1 text-[#4cd7f6] font-bold">
                  <span>{game.averageRating}/5.0</span>
                  <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5">
              <span className="text-gray-400 font-mono text-xs block mb-1.5">Platforms</span>
              <div className="flex flex-wrap gap-1.5">
                {game.platform.map((p) => (
                  <span 
                    key={p} 
                    className="bg-white/10 px-2 py-1 rounded text-[10px] uppercase font-bold text-white border border-white/5"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Action launching panel */}
          <section className="flex flex-col gap-3">
            <button
              onClick={triggerLaunchGame}
              disabled={isLaunching}
              className="flex items-center justify-center gap-2 w-full bg-[#d0bcff] hover:bg-[#bba5f7] text-[#3c0091] font-mono text-xs font-bold py-4 rounded-xl cursor-pointer active:scale-95 transition-all shadow-lg shadow-[#d0bcff]/20 disabled:opacity-80"
            >
              <span className="material-symbols-outlined">play_circle</span>
              <span>LAUNCH GAME</span>
            </button>

            <button
              onClick={() => {
                setShowShare(true);
                handleCopyShareText();
              }}
              className="flex items-center justify-center gap-2 w-full bg-[#171f33] border border-[#4cd7f6] hover:bg-[#4cd7f6]/10 text-[#4cd7f6] font-mono text-xs font-bold py-4 rounded-xl cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">share</span>
              <span>SHARE PROGRESS</span>
            </button>
          </section>

          {/* Gallery display thumbnails */}
          {game.gallery && game.gallery.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-headline font-bold text-[#d0bcff] text-sm px-1">Concept Canvas Gallery</h3>
              
              <div className="grid grid-cols-2 gap-2">
                {game.gallery.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxImage(imgUrl)}
                    className="aspect-video rounded-xl overflow-hidden border border-white/10 relative group hover:border-[#d0bcff]/50 transition-colors"
                  >
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={imgUrl} 
                      alt={`Gallery media ${i}`} 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-[#060e20]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                      <span className="material-symbols-outlined">fullscreen</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

        </aside>

      </div>

      {/* Simulator Overlay */}
      {isLaunching && (
        <div className="fixed inset-0 z-50 bg-[#060e20]/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 rounded-full border-4 border-[#d0bcff]/20 border-t-[#d0bcff] animate-spin flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-[#d0bcff] text-4xl animate-pulse">sports_esports</span>
          </div>

          <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-[0.3em] font-semibold mb-2">
            INTEGRAND LAUNCHING SIMULATOR
          </span>
          <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-white tracking-tight max-w-lg">
            Launching {game.title}...
          </h2>
          <p className="text-[#cbc3d7] text-sm mt-3 font-mono">
            Optimizing hardware channels for <span className="text-white font-bold">{launchPlatform}</span>
          </p>

          <div className="mt-8 font-mono text-sm px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-white/80 select-none">
            Timer: <span className="text-orange-400 font-bold">{launchTimer}s</span> until session simulation finishes &amp; hours record
          </div>
        </div>
      )}

      {/* Share Progress Drawer Modal */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#060e20]/80 backdrop-blur-sm" onClick={() => setShowShare(false)} />
          <div className="relative w-full max-w-md bg-[#131b2e] border border-white/10 rounded-2xl p-6 shadow-2xl z-10 text-white">
            <h3 className="font-headline font-bold text-lg mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4cd7f6]">share</span>
              Progress Card Exported
            </h3>
            <p className="text-xs text-[#cbc3d7] mb-5 font-mono">
              A dynamic status report of your {game.title} journey has been copied to your clipboard.
            </p>

            {/* Simulated Clip view */}
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-xs space-y-2 text-[#dae2fd]/90 overflow-hidden line-clamp-6">
              <p className="text-lime-400">&gt;_ QuestLog System Record</p>
              <p>Game: <span className="text-white font-bold">{game.title}</span></p>
              <p>Completion: <span className="text-white font-bold">{game.progress}%</span></p>
              <p>Hours: <span className="text-white font-bold">{game.playtime} Hours</span></p>
              <p>Achievements: <span className="text-white font-bold">{game.achievementsUnlocked}/{game.achievementsTotal}</span></p>
              <p>Notes: "{game.journal || 'No journal log'}"</p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={handleCopyShareText}
                className="flex-1 py-3 bg-[#4cd7f6] hover:bg-[#38c2de] text-[#00424e] font-mono text-xs font-bold rounded-xl active:scale-95 transition-colors"
              >
                {shareCopied ? 'COPIED AGAIN!' : 'COPY AGAIN'}
              </button>
              <button
                onClick={() => setShowShare(false)}
                className="px-5 py-3 border border-white/10 rounded-xl hover:bg-white/5 font-mono text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox widget zoom */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <img 
            src={lightboxImage} 
            alt="Lightbox view enlarged" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl border border-white/10"
            referrerPolicy="no-referrer"
          />
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/50 text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

    </div>
  );
}
