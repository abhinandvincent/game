import React, { useState, useEffect } from 'react';
import { Game, ActivityFeedItem, GameStatus, PlaySession } from './types';
import { INITIAL_GAMES, INITIAL_ACTIVITY_LOGS } from './initialData';
import Sidebar from './components/Sidebar';
import QuickLogModal from './components/QuickLogModal';
import AddGameModal from './components/AddGameModal';
import GameDetails from './components/GameDetails';

export default function App() {
  // Load core library states from localStorage or defaults
  const [games, setGames] = useState<Game[]>(() => {
    const cached = localStorage.getItem('questlog_games');
    if (cached) {
      try { return JSON.parse(cached); } catch { return INITIAL_GAMES; }
    }
    return INITIAL_GAMES;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityFeedItem[]>(() => {
    const cached = localStorage.getItem('questlog_activity_logs');
    if (cached) {
      try { return JSON.parse(cached); } catch { return INITIAL_ACTIVITY_LOGS; }
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // Profile preferences
  const [profileName, setProfileName] = useState(() => localStorage.getItem('questlog_profile_name') || 'GamerOne');
  const [profileLevel, setProfileLevel] = useState(() => Number(localStorage.getItem('questlog_profile_level') || '42'));
  const [steamSynced, setSteamSynced] = useState(() => localStorage.getItem('questlog_steam_synced') === 'true');

  // Interactive filters
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'library' | 'activity' | 'settings' | 'details'>('library');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  // Search & Filter parameters in Library page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'All' | 'PC' | 'PS5' | 'Switch'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [sortBy, setSortBy] = useState<'Recent' | 'Title' | 'Playtime' | 'Metascore'>('Recent');

  // Modals active state Control
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);

  // Active Tab Filter (Activity Feed)
  const [activityFeedFilter, setActivityFeedFilter] = useState<'All' | 'Logs' | 'Social'>('All');

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem('questlog_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('questlog_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('questlog_profile_name', profileName);
  }, [profileName]);

  useEffect(() => {
    localStorage.setItem('questlog_profile_level', String(profileLevel));
  }, [profileLevel]);

  useEffect(() => {
    localStorage.setItem('questlog_steam_synced', String(steamSynced));
  }, [steamSynced]);

  // Action listeners
  const handleUpdateStatus = (gameId: string, status: GameStatus) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        // Calculate progress automatically upon complete trigger!
        const prog = status === 'completed' ? 100 : g.progress;
        return { ...g, status, progress: prog };
      }
      return g;
    }));

    // Log update activity
    const targetGame = games.find(g => g.id === gameId);
    if (targetGame) {
      const log: ActivityFeedItem = {
        id: `log-${Date.now()}-${Math.random()}`,
        gameId,
        gameTitle: targetGame.title,
        gameImage: targetGame.image,
        type: 'backlog',
        title: `Status update: ${targetGame.title}`,
        subtitle: 'COLLECTION UPDATE',
        description: `Status changed to "${status.toUpperCase()}". Updated in QuestLog Vault.`,
        timestamp: 'JUST NOW',
        tags: ['STATUS CHANGE', status.toUpperCase()]
      };
      setActivityLogs(prev => [log, ...prev]);
    }
  };

  const handleUpdateGameStats = (
    gameId: string,
    updates: Partial<Pick<Game, 'playtime' | 'achievementsUnlocked' | 'deaths' | 'level' | 'journal'>>
  ) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return { ...g, ...updates };
      }
      return g;
    }));
  };

  // Record custom play sessions
  const handleAddSession = (gameId: string, sessionTitle: string, hours: number) => {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newSession: PlaySession = {
      id: `session-${Date.now()}`,
      title: sessionTitle || 'Played Session',
      date: formattedDate,
      playtime: `${hours}h`
    };

    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        const updatedSessions = [newSession, ...g.sessions];
        const newPlaytime = g.playtime + hours;
        // Increase progress slightly as they record playtime!
        const newProgress = Math.min(100, g.progress + Math.round(hours * 1.5));
        return {
          ...g,
          sessions: updatedSessions,
          playtime: newPlaytime,
          progress: newProgress,
          lastPlayed: 'JUST NOW'
        };
      }
      return g;
    }));

    const targetGame = games.find(g => g.id === gameId);
    if (!targetGame) return;

    // Trigger user level projection exp points
    setProfileLevel(prev => prev + (hours > 2 ? 1 : 0));

    // Append beautiful chronological timeline feed Item
    const log: ActivityFeedItem = {
      id: `act-${Date.now()}`,
      gameId,
      gameTitle: targetGame.title,
      gameImage: targetGame.image,
      type: 'session',
      title: `Logged ${hours} hours in ${targetGame.title}`,
      subtitle: 'PLAY SESSION',
      description: `${sessionTitle}. Levelled up in-game progress metrics.`,
      timestamp: 'JUST NOW',
      tags: ['SESSION RECORDED', `${hours}H PLAYED`]
    };

    setActivityLogs(prev => [log, ...prev]);
  };

  // Full manual callback logging from QuickLogModal
  const handleQuickLogSession = (
    gameId: string,
    sessionTitle: string,
    hours: number,
    unlockedAchievement: boolean,
    achievementName?: string
  ) => {
    handleAddSession(gameId, sessionTitle, hours);

    if (unlockedAchievement && achievementName) {
      const targetGame = games.find(g => g.id === gameId);
      if (!targetGame) return;

      // Update unlocked achievement count
      setGames(prev => prev.map(g => {
        if (g.id === gameId) {
          const unlockedCount = Math.min(g.achievementsTotal, g.achievementsUnlocked + 1);
          return {
            ...g,
            achievementsUnlocked: unlockedCount
          };
        }
        return g;
      }));

      // Populate achievement milestone item entry
      const logAch: ActivityFeedItem = {
        id: `act-ach-${Date.now()}`,
        gameId,
        gameTitle: targetGame.title,
        gameImage: targetGame.image,
        type: 'achievement',
        title: `Completed Achievement: '${achievementName}'`,
        subtitle: 'RARE ACHIEVEMENT',
        description: `Unlocked during your session in ${targetGame.title}. Verified by System.`,
        timestamp: 'JUST NOW',
        rarity: 'Epic',
        tags: ['MILESTONE', achievementName.toUpperCase()]
      };

      // Slight timeout delay so both don't generate index duplicate timestamps instantly!
      setTimeout(() => {
        setActivityLogs(prev => [logAch, ...prev]);
      }, 200);
    }
  };

  const handleAddGame = (newGameData: Omit<Game, 'id' | 'sessions'>) => {
    const newId = newGameData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check duplication
    if (games.some(g => g.id === newId)) {
      alert('This game already exists in your local vault.');
      return;
    }

    const newGame: Game = {
      ...newGameData,
      id: newId,
      sessions: []
    };

    setGames(prev => [newGame, ...prev]);

    // Record creation activity
    const log: ActivityFeedItem = {
      id: `log-add-${Date.now()}`,
      gameId: newId,
      gameTitle: newGame.title,
      gameImage: newGame.image,
      type: 'backlog',
      title: `Added ${newGame.title} to Vault`,
      subtitle: 'COLLECTION SUMMARY',
      description: `New catalog entry created with initial status: "${newGame.status.toUpperCase()}".`,
      timestamp: 'JUST NOW',
      tags: ['NEW ENTRY', newGame.status.toUpperCase()]
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  // Trigger simulated steam synchronization
  const handleSteamSyncTrigger = () => {
    if (steamSynced) {
      // De-link
      setSteamSynced(false);
      return;
    }

    setSteamSynced(true);
    
    // Inject nice steam preview game: "Baldur's Gate 3" has been added!
    const bg3Id = 'baldurs-gate-3';
    if (!games.some(g => g.id === bg3Id)) {
      const bg3Game: Game = {
        id: bg3Id,
        title: "Baldur's Gate 3",
        developer: 'Larian Studios',
        publisher: 'Larian Studios',
        releaseDate: 'Aug 3, 2023',
        averageRating: 4.9,
        metascore: 96,
        genre: 'Tactical RPG',
        status: 'playing',
        platform: ['PC', 'PlayStation 5'],
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwEd6IMSu2XpHUOueBPO1Djg8RWYrsv-1S93hUSHwvOSlkv02H52tTn753mSAPyHW8K8KfkKLfwGkkAGfYel3I0hlbZdGJTzGyBE9fR9CwvxdvSk2-qsXKgBglwilu5jcq11M2RTPI2eaL0qbGl8OTgUvS_8-tQlSkuAkp58ggnIEWX0klkNowsWH4q_5fdKfAyx-s-1I8c_R1JginceV16Q_HX-IXk7xx-AqpyB0hnnq5g_z-dd99KD2zRkHFhNT-l9yFGoNePlI',
        progress: 48,
        playtime: 120,
        achievementsTotal: 53,
        achievementsUnlocked: 24,
        deaths: 29,
        level: 12,
        journal: 'Currently in Act III entering Baldur\'s Gate city. Rescued Karlach and Shadowheart romance path active.',
        gallery: [],
        sessions: [
          { id: 'session-bg1', title: 'Fallen demigod challenge', date: 'June 2, 2026', playtime: '3h 30m' }
        ]
      };

      setGames(prev => [bg3Game, ...prev]);

      const log: ActivityFeedItem = {
        id: `act-steam-${Date.now()}`,
        gameId: bg3Id,
        gameTitle: "Baldur's Gate 3",
        gameImage: bg3Game.image,
        type: 'session',
        title: 'Auto-Synced Game: Baldur\'s Gate 3',
        subtitle: 'STEAM API INTEGRATION',
        description: 'Loaded 120 recorded achievements and 5,400 minutes of authenticated remote gameplay sessions.',
        timestamp: 'JUST NOW',
        tags: ['STEAM SYNC', 'AUTO_IMPORTED']
      };
      setActivityLogs(prev => [log, ...prev]);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Wipe all local data and reset QuestLog defaults?')) {
      localStorage.removeItem('questlog_games');
      localStorage.removeItem('questlog_activity_logs');
      localStorage.removeItem('questlog_profile_name');
      localStorage.removeItem('questlog_profile_level');
      localStorage.removeItem('questlog_steam_synced');
      setGames(INITIAL_GAMES);
      setActivityLogs(INITIAL_ACTIVITY_LOGS);
      setProfileName('GamerOne');
      setProfileLevel(42);
      setSteamSynced(false);
      setCurrentTab('library');
      setSelectedGameId(null);
    }
  };

  const handleOpenGameDetails = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentTab('details');
  };

  // Compute stats helper
  const totalPlaytime = games.reduce((acc, g) => acc + g.playtime, 0);
  const completedCount = games.filter(g => g.status === 'completed').length;
  const backlogCount = games.filter(g => g.status === 'backlog').length;
  const activeNowPlaying = games.filter(g => g.status === 'playing');

  // Filter & sort logic for games catalog grid
  const filteredAndSortedGames = games
    .filter(g => {
      // Search Box Filter
      const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.developer.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Platform Filter
      const matchesPlatform = selectedPlatform === 'All' || 
        g.platform.some(p => p.toLowerCase().includes(selectedPlatform.toLowerCase()));

      // Status Filter
      const matchesStatus = selectedStatus === 'All Status' || 
        g.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesPlatform && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'Title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'Playtime') {
        return b.playtime - a.playtime;
      }
      if (sortBy === 'Metascore') {
        return b.metascore - a.metascore;
      }
      // 'Recent' is standard fall-through ordering
      return 0; // maintain database defaults sequence
    });

  const selectedGame = games.find(g => g.id === selectedGameId);

  return (
    <div className="flex relative min-h-screen bg-[#0b1326] text-[#dae2fd] overflow-x-hidden selection:bg-[#d0bcff]/30 selection:text-[#d0bcff]">
      
      {/* Sidebar Controls */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedGameId(null);
        }}
        onQuickLogClick={() => setIsQuickLogOpen(true)}
        profileName={profileName}
        profileLevel={profileLevel}
      />

      {/* Main Content Layout Body */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-0 min-h-screen flex flex-col">
        
        {/* TAB CONTROLS RENDERING */}

        {/* 1. CUSTOM DETAILS PAGE VIEW */}
        {currentTab === 'details' && selectedGame ? (
          <GameDetails
            game={selectedGame}
            onBack={() => setCurrentTab('library')}
            onUpdateStatus={handleUpdateStatus}
            onUpdateGameStats={handleUpdateGameStats}
            onAddSession={handleAddSession}
          />
        ) : (
          <div className="flex-1 px-6 md:px-12">
            
            {/* Nav top header */}
            <header className="sticky top-0 z-30 pt-6 pb-4 flex flex-col gap-4 bg-[#0b1326]/60 backdrop-blur-xl border-b border-white/5 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h1 className="font-headline font-extrabold text-2xl md:text-3xl tracking-tight text-white capitalize">
                    {currentTab === 'dashboard' && 'Dashboard Overview'}
                    {currentTab === 'library' && 'Game Library'}
                    {currentTab === 'activity' && 'Activity Logs & Milestones'}
                    {currentTab === 'settings' && 'Profile Station'}
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  {/* Notification bells */}
                  <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative shrink-0">
                    <span className="material-symbols-outlined text-[#cbc3d7] hover:text-[#d0bcff]">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#4cd7f6] rounded-full"></span>
                  </button>

                  <div className="w-9 h-9 rounded-full border border-[#d0bcff]/30 overflow-hidden shrink-0">
                    <img 
                      alt="User profile avatar" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-IPkrl8AFYFb-kUxrj3PGBXwgEkpXG8jNgWY2iTlFV2gDq6EizYfo-WPh8iVpJZEmeAbWkKxQ03dyDmkr-2XKgu3gbiLLzf0oBws6UTDQB94G0qIPrOs6-5WB_PeJXuAn10g7XLna1xVacVG_Pih7GnPFlR8bH7PUBLKUlEstGMrJLxyphNzMmmuSajoIPcEZ3YkHb5Y8s5896zdEtFkXi6xeVIS2qHZ-uG-uyczd3zPoJ1dQwm20hEEHl2brBlFjiHHcH2LIWOs"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </header>

            {/* TAB CONTENT: DASHBOARD TAB */}
            {currentTab === 'dashboard' && (
              <div className="space-y-8 animate-fadeIn pb-12">
                
                {/* Welcome banners */}
                <section className="bg-gradient-to-r from-[#d0bcff]/10 via-transparent to-[#4cd7f6]/10 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="font-headline font-bold text-xl text-white">
                      Welcome back, <span className="text-[#d0bcff]">{profileName}</span>!
                    </h2>
                    <p className="text-sm text-[#cbc3d7] mt-1">Ready to sync and record your demigods or sci-fi achievements today?</p>
                  </div>
                  <div className="flex gap-2 font-mono text-xs">
                    <span className="px-3 py-1.5 bg-[#4cd7f6]/1% text-[#4cd7f6] border border-[#4cd7f6]/30 rounded-lg uppercase tracking-wider font-bold">
                      Explorer Level {profileLevel}
                    </span>
                  </div>
                </section>

                {/* Quick numeric overview statistics */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Total hours */}
                  <div className="glass-card p-6 rounded-2xl border-white/10 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 text-[#d0bcff] opacity-5 transform scale-150 group-hover:scale-110 transition-transform duration-700 select-none">
                      <span className="material-symbols-outlined !text-7xl">schedule</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#cbc3d7] uppercase tracking-wider block font-semibold">Total Playtime</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-headline font-extrabold text-3xl text-white">{totalPlaytime.toLocaleString()}</span>
                      <span className="text-xs text-gray-400">Hours Vaulted</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#d0bcff] to-[#4cd7f6] w-[75%]"></div>
                    </div>
                  </div>

                  {/* Games completed */}
                  <div className="glass-card p-6 rounded-2xl border-white/10 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 text-[#4cd7f6] opacity-5 transform scale-150 group-hover:scale-110 transition-transform duration-700 select-none">
                      <span className="material-symbols-outlined !text-7xl">military_tech</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#cbc3d7] uppercase tracking-wider block font-semibold">Games Completed</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-headline font-extrabold text-3xl text-white">{completedCount}</span>
                      <span className="text-xs text-gray-400">Total Titles</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4cd7f6] w-[50%]"></div>
                    </div>
                  </div>

                  {/* Backlogs */}
                  <div className="glass-card p-6 rounded-2xl border-white/10 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 text-rose-400 opacity-5 transform scale-150 group-hover:scale-110 transition-transform duration-700 select-none">
                      <span className="material-symbols-outlined !text-7xl">inventory_2</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#cbc3d7] uppercase tracking-wider block font-semibold">Current Backlog</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-headline font-extrabold text-3xl text-white">{backlogCount}</span>
                      <span className="text-xs text-gray-400">To-Play queue</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 w-[35%]"></div>
                    </div>
                  </div>

                </section>

                {/* Now Playing Carousel component slider block */}
                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4cd7f6]">play_circle</span>
                      Active Play List (Now Playing)
                    </h2>
                    <span className="font-mono text-[10px] text-[#cbc3d7] uppercase tracking-wider">
                      {activeNowPlaying.length} ACTIVE GAMES
                    </span>
                  </div>

                  {activeNowPlaying.length === 0 ? (
                    <div className="glass-card p-10 rounded-2xl text-center text-gray-500 border-dashed border-white/10 text-sm">
                      No games currently flagged as 'Playing'. Set standard status filters in the Library Catalog to populate!
                    </div>
                  ) : (
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                      {activeNowPlaying.map((gameItem) => (
                        <div 
                          key={gameItem.id} 
                          onClick={() => handleOpenGameDetails(gameItem.id)}
                          className="min-w-[280px] md:min-w-[400px] snap-start glass-card rounded-2xl overflow-hidden group border border-white/10 hover:border-[#d0bcff]/40 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl shadow-black/20"
                        >
                          <div className="relative h-44 overflow-hidden">
                            <img 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                              src={gameItem.image} 
                              alt={gameItem.title}
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] to-transparent"></div>
                            
                            <div className="absolute top-3 right-3">
                              <span className="bg-[#171f33]/90 text-[#4cd7f6] px-2 py-1 rounded text-[9px] font-bold font-mono uppercase tracking-wider border border-[#4cd7f6]/20">
                                {gameItem.status.toUpperCase()}
                              </span>
                            </div>

                            <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                              {gameItem.platform.map(plat => (
                                <span key={plat} className="bg-[#0b1326]/60 backdrop-blur-md border border-white/10 text-white text-[9px] px-2 py-0.5 rounded-full font-mono font-semibold uppercase">
                                  {plat === 'Nintendo Switch' ? 'Switch' : plat}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <h3 className="font-headline font-bold text-white text-base group-hover:text-[#d0bcff] transition-colors line-clamp-1">{gameItem.title}</h3>
                              <span className="font-mono text-[10px] text-gray-400 capitalize">{gameItem.genre}</span>
                            </div>

                            <div className="flex justify-between items-center text-xs mt-2 font-mono">
                              <span className="text-gray-400">Gameplay Progress</span>
                              <span className="text-[#4cd7f6] font-bold">{gameItem.progress}%</span>
                            </div>

                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-1">
                              <div 
                                className="h-full bg-gradient-to-r from-[#4cd7f6] to-[#d0bcff] transition-all rounded-full" 
                                style={{ width: `${gameItem.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 block text-right">Last session: {gameItem.lastPlayed || 'N/A'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Mid Stats Recent Log */}
                <section className="space-y-4">
                  <h2 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#d0bcff]">history</span>
                    Recent Activity Logs
                  </h2>

                  <div className="flex flex-col gap-3">
                    {activityLogs.slice(0, 3).map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => handleOpenGameDetails(item.gameId)}
                        className="glass-card p-4 rounded-xl flex items-center justify-between gap-4 group hover:bg-white/[0.03] transition-all border-white/5 cursor-pointer"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img 
                            src={item.gameImage} 
                            alt={item.gameTitle} 
                            className="w-12 h-12 object-cover rounded-lg shrink-0 border border-white/10 group-hover:border-[#d0bcff]/30 transition-colors"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm text-white truncate">{item.title}</h4>
                            <span className="text-[11px] font-mono text-[#cbc3d7]/60 mt-0.5 block truncate">
                              {item.subtitle} &bull; {item.description}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-wider bg-[#4cd7f6]/5 px-2.5 py-1 rounded-md border border-[#4cd7f6]/10">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* TAB CONTENT: LIBRARY CATALOG VIEW */}
            {currentTab === 'library' && (
              <div className="space-y-6 animate-fadeIn pb-12">
                
                {/* Search, Filter platform, status controls block */}
                <section className="glass-card p-5 rounded-2xl border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
                  
                  {/* Search box */}
                  <div className="w-full md:w-80 relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#cbc3d7] text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Vault by title, genre, creator..."
                      className="w-full bg-[#171f33]/70 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#d0bcff] placeholder:text-gray-500 font-sans transition-all"
                    />
                  </div>

                  {/* Platform Quick Chips */}
                  <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.03] rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
                    {['All', 'PC', 'PS5', 'Switch'].map((plat) => {
                      const isActive = selectedPlatform === plat;
                      return (
                        <button
                          key={plat}
                          onClick={() => setSelectedPlatform(plat as any)}
                          className={`px-4.5 py-1.5 text-[11px] font-semibold tracking-wider font-mono rounded-lg uppercase transition-all ${
                            isActive
                              ? 'bg-[#4cd7f6] text-[#001f26] font-extrabold shadow-md shadow-[#4cd7f6]/10'
                              : 'text-gray-400 hover:text-white transition-colors'
                          }`}
                        >
                          {plat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dropdowns Status filter & sorts */}
                  <div className="flex gap-2.5 w-full md:w-auto">
                    
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="bg-[#171f33]/70 border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold text-[#cbc3d7] tracking-wider font-mono focus:outline-none focus:border-[#d0bcff] cursor-pointer"
                    >
                      <option value="All Status">All Status</option>
                      <option value="playing">Playing</option>
                      <option value="backlog">Backlog</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-[#171f33]/70 border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold text-[#cbc3d7] tracking-wider font-mono focus:outline-none focus:border-[#d0bcff] cursor-pointer"
                    >
                      <option value="Recent">Sort: Recent</option>
                      <option value="Title">Sort: Title</option>
                      <option value="Playtime">Sort: Playtime</option>
                      <option value="Metascore">Sort: Metascore</option>
                    </select>

                  </div>

                </section>

                {/* Games Catalog Dynamic Grid */}
                <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  
                  {/* Create Add Entry card trigger */}
                  <button
                    onClick={() => setIsAddGameOpen(true)}
                    className="group relative aspect-[3/4] flex flex-col items-center justify-center gap-3 bg-[#171f33]/30 border-2 border-dashed border-white/10 rounded-2xl hover:border-[#d0bcff]/50 hover:bg-[#d0bcff]/5 active:scale-95 transition-all duration-300 pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#222a3d] flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#d0bcff] group-hover:text-[#3c0091] transition-all">
                      <span className="material-symbols-outlined text-[30px] font-bold">add</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#cbc3d7] group-hover:text-[#d0bcff] uppercase tracking-widest font-bold">
                      Add New Entry
                    </span>
                  </button>

                  {/* Standard cards items loop */}
                  {filteredAndSortedGames.map((gameItem) => {
                    
                    // Style determination badge colors
                    let badgeColor = 'text-[#cbc3d7] bg-white/5 border-white/10';
                    if (gameItem.status === 'playing') badgeColor = 'text-[#4cd7f6] bg-[#4cd7f6]/10 border-[#4cd7f6]/20';
                    if (gameItem.status === 'backlog') badgeColor = 'text-[#d0bcff] bg-[#d0bcff]/10 border-[#d0bcff]/20';
                    if (gameItem.status === 'completed') badgeColor = 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
                    if (gameItem.status === 'dropped') badgeColor = 'text-rose-400 bg-rose-400/10 border-rose-400/20';

                    return (
                      <div
                        key={gameItem.id}
                        onClick={() => handleOpenGameDetails(gameItem.id)}
                        className="group glass-panel rounded-2xl overflow-hidden card-glow cursor-pointer transition-all duration-300 flex flex-col hover:-translate-y-1 shadow-md shadow-black/10"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden shrink-0">
                          <img 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            src={gameItem.image} 
                            alt={gameItem.title} 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326]/90 to-transparent opacity-75"></div>
                          
                          {/* Top Status Tags */}
                          <div className="absolute top-2.5 right-2.5">
                            <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold border tracking-wider uppercase ${badgeColor}`}>
                              {gameItem.status}
                            </span>
                          </div>

                          {/* Desktop windows or console material icon */}
                          <div className="absolute bottom-2.5 left-2.5 flex gap-1 text-gray-400">
                            {gameItem.platform.includes('PC') && (
                              <span className="material-symbols-outlined text-[16px]" title="PC Support">desktop_windows</span>
                            )}
                            {gameItem.platform.includes('PlayStation 5') && (
                              <span className="material-symbols-outlined text-[16px]" title="PlayStation Console">videogame_asset</span>
                            )}
                            {gameItem.platform.includes('Nintendo Switch') && (
                              <span className="material-symbols-outlined text-[16px]" title="Nintendo Switch Handy">nest_multi_room</span>
                            )}
                            {gameItem.platform.includes('Xbox Series X') && (
                              <span className="material-symbols-outlined text-[16px]" title="Microsoft Xbox Controller">sports_esports</span>
                            )}
                          </div>
                        </div>

                        {/* Card metadata metrics */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <h3 className="font-headline font-bold text-xs md:text-sm text-white group-hover:text-[#d0bcff] transition-colors line-clamp-1">
                            {gameItem.title}
                          </h3>

                          {gameItem.status === 'playing' ? (
                            <div className="mt-2 space-y-1">
                              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#d0bcff] to-[#4cd7f6]" 
                                  style={{ width: `${gameItem.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                                <span className="text-gray-500 uppercase">XP PROGRESS</span>
                                <span className="text-[#4cd7f6] font-bold">{gameItem.progress}%</span>
                              </div>
                            </div>
                          ) : gameItem.status === 'backlog' ? (
                            <div className="mt-3.5 flex justify-between items-center text-[10px] font-mono leading-none">
                              <span className="text-gray-500 uppercase">VAULT QUEUE</span>
                              <span className="text-white">BACKLOGGED</span>
                            </div>
                          ) : gameItem.status === 'completed' ? (
                            <div className="mt-3 flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <span 
                                  key={s} 
                                  className="material-symbols-outlined text-[12px] text-amber-400" 
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  star
                                </span>
                              ))}
                              <span className="font-mono text-[9px] text-[#4cd7f6] font-bold ml-auto uppercase opacity-85">100% DONE</span>
                            </div>
                          ) : (
                            <div className="mt-3.5 flex justify-between items-center text-[10px] font-mono leading-none">
                              <span className="text-gray-400 uppercase font-bold text-rose-400/90 tracking-wider">Dropped</span>
                              <span className="text-gray-500 font-bold">{gameItem.lastPlayed || 'PAUSED'}</span>
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}
                </section>

                {filteredAndSortedGames.length === 0 && (
                  <div className="glass-card p-16 rounded-2xl border-dashed border-white/10 text-center text-gray-500 text-sm">
                    No games found matching selection queries. Reset filters or Add a new entry!
                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT: TIMELINE ACTIVITY FEED */}
            {currentTab === 'activity' && (
              <div className="space-y-6 animate-fadeIn pb-12">
                
                {/* Filters activity row */}
                <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h2 className="font-headline font-bold text-lg text-white">Chronological Milestones</h2>
                    <p className="text-xs text-[#cbc3d7] mt-0.5">Logs of play sessions, achievements registered, and platform backlog actions.</p>
                  </div>

                  <div className="flex gap-1.5 p-1 bg-white/[0.03] rounded-full border border-white/5 font-mono text-xs">
                    {(['All', 'Logs', 'Social'] as any[]).map((feedType) => (
                      <button
                        key={feedType}
                        onClick={() => setActivityFeedFilter(feedType)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
                          activityFeedFilter === feedType
                            ? 'bg-[#d0bcff] text-[#3c0091]'
                            : 'text-[#cbc3d7] hover:text-white'
                        }`}
                      >
                        {feedType}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Left/Right layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Timeline listing */}
                  <div className="lg:col-span-8 flex-grow space-y-4">
                    
                    <div className="relative pl-6 md:pl-10">
                      
                      {/* Central vertical pipeline */}
                      <div className="absolute left-2.5 md:left-4.5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#d0bcff] via-purple-700/60 to-transparent" />

                      {activityLogs.map((actItem) => {
                        return (
                          <div key={actItem.id} className="relative mb-8 group animate-fadeIn">
                            
                            {/* Point Indicator badge */}
                            <div className="absolute -left-6 md:-left-8.5 top-2.5 w-3 h-3 rounded-full bg-[#d0bcff] ring-4 ring-[#d0bcff]/20 shrink-0 z-10 block" />

                            <div className="glass-card p-5 rounded-2xl border-white/5 hover:bg-white/[0.03] transition-colors duration-300">
                              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-3.5">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={actItem.gameImage} 
                                    alt={actItem.gameTitle} 
                                    className="w-10 h-10 object-cover rounded-lg shrink-0 border border-white/10"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <h4 className="font-semibold text-sm text-white group-hover:text-[#4cd7f6] transition-colors">
                                      {actItem.title}
                                    </h4>
                                    <span className="font-mono text-[9px] text-[#cbc3d7]/60 uppercase tracking-widest leading-none mt-1 block">
                                      {actItem.subtitle}
                                    </span>
                                  </div>
                                </div>

                                <time className="font-mono text-[10px] text-[#d0bcff] tracking-wider uppercase shrink-0 bg-[#d0bcff]/10 border border-[#d0bcff]/10 px-2 py-0.5 rounded-md">
                                  {actItem.timestamp}
                                </time>
                              </div>

                              <p className="text-xs text-[#cbc3d7] font-sans leading-relaxed">
                                {actItem.description}
                              </p>

                              {actItem.tags && actItem.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-4">
                                  {actItem.tags.map(t => (
                                    <span key={t} className="bg-white/5 px-2 py-0.5 rounded text-[9px] font-mono text-[#cbc3d7]/80 border border-white/5 uppercase">
                                      {t}
                                    </span>
                                  ))}
                                  {actItem.rarity && (
                                    <span className="bg-[#4cd7f6]/10 border border-[#4cd7f6]/20 px-2 py-0.5 rounded text-[9px] font-mono text-[#4cd7f6] uppercase font-bold">
                                      {actItem.rarity}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                          </div>
                        );
                      })}

                    </div>

                    <button className="w-full py-4 glass-card hover:bg-white/[0.03] text-[#d0bcff] font-mono text-xs font-bold tracking-widest rounded-xl transition-all border-dashed border-[#d0bcff]/30 text-center">
                      LOAD PREVIOUS VAULT ACTIVITIES
                    </button>

                  </div>

                  {/* Sidebar stats panel */}
                  <aside className="lg:col-span-4 space-y-6">
                    
                    {/* Trending catalog details */}
                    <div className="glass-card p-5 rounded-2xl border-white/10">
                      <span className="font-mono text-[10px] text-[#d0bcff] uppercase tracking-wider block font-bold mb-3">
                        Trending in community
                      </span>
                      
                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-lg cursor-pointer">
                          <span className="text-[#4cd7f6] font-extrabold text-[#d0bcff]">#1</span>
                          <div className="flex-grow">
                            <p className="text-white text-xs font-semibold font-headline">Baldur's Gate 3</p>
                            <p className="text-gray-400 text-[10px]">12.4k active explorers</p>
                          </div>
                          <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">trending_up</span>
                        </div>

                        <div className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-lg cursor-pointer">
                          <span className="text-[#4cd7f6] font-extrabold">#2</span>
                          <div className="flex-grow">
                            <p className="text-white text-xs font-semibold font-headline">Alan Wake 2</p>
                            <p className="text-gray-400 text-[10px]">8.1k active logs</p>
                          </div>
                          <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">trending_up</span>
                        </div>

                        <div className="flex items-center gap-3 p-1.5 hover:bg-white/5 rounded-lg cursor-pointer">
                          <span className="text-gray-400 font-extrabold">#3</span>
                          <div className="flex-grow">
                            <p className="text-white text-xs font-semibold font-headline">Hades II</p>
                            <p className="text-gray-400 text-[10px]">5.3k actively playing</p>
                          </div>
                          <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">trending_up</span>
                        </div>
                      </div>
                    </div>

                    {/* Pro tip card block */}
                    <div className="rounded-2xl overflow-hidden relative h-48 border border-white/10 flex flex-col justify-end p-5">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDws5Vi427QbZv7BwutxwokIoulm5N8ux2GOwbZNB6USVtDQy5A8jXKLTI7opr6q7NNZWrkIvmfi9M7-e2_JhZFzy669ubTd9Rg532Ww04SA1jJMazN9QfzBP7p69FPIQqtdE-3xs6PKeMMzC95YrAddbnYTVfc5iGNMwaKae_tCjceFaa7UzHK_WFBmPXrdVxw-eUkSNceGj5SKk5ETzaiwvHyjY-Vj9faVLHQ6uhm8e0T7LWl9TL7KeH8M4wSEe-vEeKQs3B5Ico" 
                        alt="Pro tips background graphic" 
                        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.25] saturate-75"
                        referrerPolicy="no-referrer"
                      />
                      <div className="relative z-10 space-y-1 text-white">
                        <span className="font-mono text-[9px] text-[#4cd7f6] uppercase tracking-[0.25em] font-extrabold block">QuestLog Pro Tip</span>
                        <h4 className="font-headline font-semibold text-sm text-white">Integrate Authenticated Networks</h4>
                        <p className="text-[11px] text-[#cbc3d7] font-sans">
                          Steam, Xbox, and PlayStation accounts auto-sync in profile settings to catalog achievements.
                        </p>
                      </div>
                    </div>

                  </aside>

                </div>

              </div>
            )}

            {/* TAB CONTENT: PROFILE STATION SETTINGS */}
            {currentTab === 'settings' && (
              <div className="space-y-6 animate-fadeIn pb-12 w-full max-w-3xl">
                
                {/* Profile form section */}
                <section className="glass-card p-6 rounded-2xl border-white/10 space-y-5">
                  <h3 className="font-headline font-bold text-base text-white border-b border-white/10 pb-2 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#d0bcff]">settings_accessibility</span>
                    Explorer Credentials Settings
                  </h3>

                  <div className="space-y-4">
                    {/* Name change */}
                    <div className="space-y-1.55">
                      <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-bold">
                        Gamer Handle Moniker
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="GamerOne"
                        className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d0bcff] text-sm font-semibold"
                      />
                    </div>

                    {/* Level change */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-bold">
                        Explorer Level (Lvl)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={profileLevel}
                        onChange={(e) => setProfileLevel(Number(e.target.value))}
                        className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d0bcff] text-sm"
                      />
                    </div>
                  </div>
                </section>

                {/* Integration channels mock accounts config */}
                <section className="glass-card p-6 rounded-2xl border-white/10 space-y-4">
                  <h3 className="font-headline font-bold text-base text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4cd7f6]">sync_alt</span>
                    Automatic Steam Sync Gateway
                  </h3>
                  <p className="text-xs text-[#cbc3d7] leading-relaxed">
                    Connecting to Steam automatically scans your active library titles, synchronizing total playtimes, backlog additions, and demigod level achievement records dynamically using standard background channels.
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSteamSyncTrigger}
                      className={`font-mono text-xs font-bold px-5 py-3.5 rounded-xl border flex items-center gap-2.5 transition-all select-none cursor-pointer ${
                        steamSynced
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-[#171f33] border-[#4cd7f6]/50 hover:bg-[#4cd7f6]/10 text-[#4cd7f6]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {steamSynced ? 'check_circle' : 'stream'}
                      </span>
                      <span>{steamSynced ? 'AUTHENTICATED AND ACTIVE' : 'CONNECT STEAM SYSTEM'}</span>
                    </button>
                    {steamSynced && (
                      <p className="text-[10px] text-emerald-400/80 font-mono mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">done</span>
                        Status: Connected. Simulated import game (Baldur's Gate 3) has been mounted into Library.
                      </p>
                    )}
                  </div>
                </section>

                {/* Operations and reset actions */}
                <section className="glass-card p-6 rounded-2xl border border-rose-500/20 bg-rose-500/[0.02] space-y-4">
                  <h3 className="font-headline font-bold text-base text-rose-300 flex items-center gap-2">
                    <span className="material-symbols-outlined">warning</span>
                    System Management Operations
                  </h3>
                  <p className="text-xs text-[#cbc3d7] leading-relaxed">
                    Performing resets clears custom journal logs, session timelines, added vault titles, and restores the pristine default pre-populated mockup games catalog instantly. This layout stays saved in localStorage client metrics.
                  </p>

                  <div className="pt-1.5">
                    <button
                      onClick={handleResetData}
                      className="px-5 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 font-mono text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      RESET SYSTEM VAULT TO DEFAULT
                    </button>
                  </div>
                </section>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Floating Action Button (Quick Log FAB) - visible on phone bar index or general sidebar */}
      <button
        onClick={() => setIsQuickLogOpen(true)}
        className="fixed bottom-20 md:bottom-10 right-6 md:right-10 w-16 h-16 rounded-full bg-[#d0bcff] hover:bg-[#bba5f7] hover:shadow-[0_0_25px_rgba(208,188,255,0.4)] text-[#3c0091] flex items-center justify-center select-none active:scale-90 transition-all z-40 focus:outline-none"
        title="Quick Log a gaming session"
      >
        <span className="material-symbols-outlined text-[32px] font-bold">add</span>
      </button>

      {/* BACKGROUND GLOWS METRICS */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#d0bcff]/6 blur-[130px] rounded-full"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#4cd7f6]/6 blur-[130px] rounded-full"></div>
      </div>

      {/* MODALS GATEWAY */}

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        games={games}
        onLogSession={handleQuickLogSession}
      />

      <AddGameModal
        isOpen={isAddGameOpen}
        onClose={() => setIsAddGameOpen(false)}
        onAddGame={handleAddGame}
      />

    </div>
  );
}
