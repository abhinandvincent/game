import React, { useState } from 'react';
import { Game } from '../types';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  onLogSession: (
    gameId: string,
    sessionTitle: string,
    hours: number,
    unlockedAchievement: boolean,
    achievementName?: string
  ) => void;
}

export default function QuickLogModal({
  isOpen,
  onClose,
  games,
  onLogSession,
}: QuickLogModalProps) {
  const [selectedGameId, setSelectedGameId] = useState(games[0]?.id || '');
  const [sessionTitle, setSessionTitle] = useState('');
  const [hours, setHours] = useState<number>(2);
  const [unlockAchievement, setUnlockAchievement] = useState(false);
  const [achievementName, setAchievementName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGameId) return;

    onLogSession(
      selectedGameId,
      sessionTitle || 'Generic Play Session',
      Number(hours),
      unlockAchievement,
      unlockAchievement ? achievementName || 'Epic Achiever' : undefined
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      // Reset state and close
      setSessionTitle('');
      setHours(2);
      setUnlockAchievement(false);
      setAchievementName('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#060e20]/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden shadow-2xl z-10 transition-all scale-100 border border-white/10 p-6">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30 animate-bounce">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h3 className="font-headline font-bold text-xl text-white">Adventure Logged!</h3>
            <p className="text-[#cbc3d7] text-sm mt-1">XP granted +450. Achievements updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d0bcff]">add_circle</span>
                Quick Adventure Log
              </h3>
              <button 
                type="button" 
                onClick={onClose}
                className="p-1 text-[#cbc3d7] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Select Game */}
            <div className="space-y-1.55">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block">
                Select Active Game
              </label>
              <select
                value={selectedGameId}
                onChange={(e) => setSelectedGameId(e.target.value)}
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d0bcff] cursor-pointer text-sm"
              >
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.genre})
                  </option>
                ))}
              </select>
            </div>

            {/* Session Headline */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block">
                What did you do? (Session Title)
              </label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="e.g. Cleared Stormveil main gate, farmed elements"
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d0bcff] text-sm placeholder:text-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Playtime Hours */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block">
                  Hours Logged
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d0bcff] text-sm"
                />
              </div>

              {/* Achievement Trigger Toggle */}
              <div className="flex flex-col justify-end pb-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#cbc3d7] hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={unlockAchievement}
                    onChange={(e) => setUnlockAchievement(e.target.checked)}
                    className="w-4 h-4 bg-[#171f33] rounded border-white/10 text-[#d0bcff] focus:ring-0 focus:ring-offset-0"
                  />
                  <span>Unlocked Achievement</span>
                </label>
              </div>
            </div>

            {/* Achievement Details */}
            {unlockAchievement && (
              <div className="space-y-1.5 p-3.5 rounded-xl bg-[#d0bcff]/5 border border-[#d0bcff]/20 animate-fadeIn">
                <label className="font-mono text-[10px] text-[#d0bcff] uppercase tracking-widest block">
                  Achievement Title
                </label>
                <input
                  type="text"
                  value={achievementName}
                  onChange={(e) => setAchievementName(e.target.value)}
                  placeholder="e.g. God-Slaying Armament"
                  className="w-full bg-[#171f33]/40 border border-[#d0bcff]/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm placeholder:text-[#cbc3d7]/40"
                />
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-white font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#d0bcff] hover:bg-[#bba5f7] text-[#3c0091] font-bold rounded-xl transition-all shadow-lg shadow-[#d0bcff]/10"
              >
                Log Adventure
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
