import React from 'react';

interface SidebarProps {
  currentTab: 'dashboard' | 'library' | 'activity' | 'settings' | 'details';
  setCurrentTab: (tab: 'dashboard' | 'library' | 'activity' | 'settings') => void;
  onQuickLogClick: () => void;
  profileName: string;
  profileLevel: number;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  onQuickLogClick,
  profileName,
  profileLevel,
}: SidebarProps) {
  return (
    <>
      {/* Side Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#131b2e]/80 backdrop-blur-xl border-r border-white/10 p-6 gap-6 z-40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#d0bcff] flex items-center justify-center shadow-lg shadow-[#d0bcff]/20">
            <span className="material-symbols-outlined text-[#3c0091] font-bold">rocket_launch</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg text-[#d0bcff] tracking-tight">QuestLog</span>
            <span className="font-mono text-[10px] text-[#cbc3d7]/70 tracking-widest uppercase">
              {profileName}
            </span>
          </div>
        </div>

        {/* User Stats Mini-Block */}
        <div className="flex items-center gap-3 mb-4 px-2 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#d0bcff]/30 shrink-0">
            <img 
              alt="User profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-IPkrl8AFYFb-kUxrj3PGBXwgEkpXG8jNgWY2iTlFV2gDq6EizYfo-WPh8iVpJZEmeAbWkKxQ03dyDmkr-2XKgu3gbiLLzf0oBws6UTDQB94G0qIPrOs6-5WB_PeJXuAn10g7XLna1xVacVG_Pih7GnPFlR8bH7PUBLKUlEstGMrJLxyphNzMmmuSajoIPcEZ3YkHb5Y8s5896zdEtFkXi6xeVIS2qHZ-uG-uyczd3zPoJ1dQwm20hEEHl2brBlFjiHHcH2LIWOs"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-white truncate">{profileName}</span>
            <span className="font-mono text-[9px] text-[#cbc3d7] uppercase tracking-widest truncate">
              Lvl {profileLevel} Explorer
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-mono text-xs tracking-wider text-left ${
              currentTab === 'dashboard'
                ? 'bg-[#d0bcff]/20 text-[#d0bcff] border-r-4 border-[#d0bcff]'
                : 'text-[#cbc3d7] hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">dashboard</span>
            <span>DASHBOARD</span>
          </button>

          <button
            onClick={() => setCurrentTab('library')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-mono text-xs tracking-wider text-left ${
              currentTab === 'library' || currentTab === 'details'
                ? 'bg-[#d0bcff]/20 text-[#d0bcff] border-r-4 border-[#d0bcff]'
                : 'text-[#cbc3d7] hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">library_books</span>
            <span>LIBRARY</span>
          </button>

          <button
            onClick={() => setCurrentTab('activity')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-mono text-xs tracking-wider text-left ${
              currentTab === 'activity'
                ? 'bg-[#d0bcff]/20 text-[#d0bcff] border-r-4 border-[#d0bcff]'
                : 'text-[#cbc3d7] hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">insights</span>
            <span>ACTIVITY</span>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-mono text-xs tracking-wider text-left ${
              currentTab === 'settings'
                ? 'bg-[#d0bcff]/20 text-[#d0bcff] border-r-4 border-[#d0bcff]'
                : 'text-[#cbc3d7] hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">settings</span>
            <span>SETTINGS</span>
          </button>
        </nav>

        <button
          onClick={onQuickLogClick}
          className="w-full py-3.5 bg-[#d0bcff] hover:bg-[#bba5f7] text-[#3c0091] font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-[#d0bcff]/15 font-mono text-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>QUICK LOG</span>
        </button>
      </aside>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe h-16 bg-[#171f33]/95 backdrop-blur-lg border-t border-white/10 shadow-2xl rounded-t-xl">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center p-2 transition-all ${
            currentTab === 'dashboard' ? 'text-[#d0bcff]' : 'text-[#cbc3d7] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="font-mono text-[9px] mt-0.5 tracking-wider uppercase">Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('library')}
          className={`flex flex-col items-center justify-center p-2 transition-all ${
            currentTab === 'library' || currentTab === 'details' ? 'text-[#d0bcff]' : 'text-[#cbc3d7] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">video_library</span>
          <span className="font-mono text-[9px] mt-0.5 tracking-wider uppercase">Library</span>
        </button>

        <button
          onClick={() => setCurrentTab('activity')}
          className={`flex flex-col items-center justify-center p-2 transition-all ${
            currentTab === 'activity' ? 'text-[#d0bcff]' : 'text-[#cbc3d7] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">equalizer</span>
          <span className="font-mono text-[9px] mt-0.5 tracking-wider uppercase">Stats</span>
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className={`flex flex-col items-center justify-center p-2 transition-all ${
            currentTab === 'settings' ? 'text-[#d0bcff]' : 'text-[#cbc3d7] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">person</span>
          <span className="font-mono text-[9px] mt-0.5 tracking-wider uppercase">Profile</span>
        </button>
      </nav>
    </>
  );
}
