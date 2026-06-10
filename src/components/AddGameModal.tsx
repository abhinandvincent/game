import React, { useState } from 'react';
import { Game, GameStatus } from '../types';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: Omit<Game, 'id' | 'sessions'>) => void;
}

const PRESET_IMAGES = [
  {
    name: 'Cosmic Starfield',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZO7GrrumhJ8yzzQe0TyVEWpk27BBv11BfqLCfp27E61np0uvsjKXLs0hntZ18nw0tsPq2ODpKjLEDgwMO1NkOmyen8KZk9tM8WOHp1EDdsiMKzec0UMNz9zrROw_zD_qd3OLyZTXjhfshNXLoCNvptvU13pFitQMyaQgON9DOX2bnYnxZ7-oY6KVO1EL7PbF_5jGFzK0tWvUCrS5OenYGqo0w5yrCZLhKy0SxOnHzKV6uzqiQ4NlLNtqoefU0N2C7GNvOT1wOkJc',
  },
  {
    name: 'Neon Cyber City',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb4k0OtEzvONP8W8TwXMLr3FwD1pEaYZsgRWwzHRXpqOdUciUUYqgQrLPFWStd-itpEn7OvZIA-HHFYsfINiUFk3NRCu-7ABiXOCo_WMzFhjvd9x2gTS2zlIXQuS1x8-R74Lrp4D5nUxewCiumSn5TjUfLqcD5w_sG3c_f9n91PywLlVvl4esdk8QQF8DL7JBqsvogqcET3gLHEyOdIyLvVdA_IbZS80JE6Q3_nA3a02SM5FACuddH2mwNYflOSMJ6tyrMNfyDiJU',
  },
  {
    name: 'Ancient Temple Ruins',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ZilUBuE2anbIdjMnuyB4OvM-9vaThKuTN_Kc-25xX4hyOUbKAmH8okysqPred0HWyTpQ-yOhgx86CdJAo-jErnHN2W71t_EJyEzhoguScof7PIPQw16i3W-wRdavTgUrO2wuK_B_8QxgB6EL29GxlZFda981gS_AxvcF8bmn20rEUp1ZDQKHLfeKQXGK6HZ28nH-_btutBYfl7X_jksfK9PvFO0TMG9MvhBRUV8Gr3P4XP7WcIjcN4zc0LcHvuh1VLrGWCeIxr0',
  },
  {
    name: 'Bioluminescent Forest',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9jPKdL-9a-PmyVPJ8mSNd9N0EA8CH5UsaHlFsyO5rQ_5_5g5QIxMAhqaSGNRAjyDZ8heOR59WXJF0qj_oBoHE9VShv33bLGfVB82Q0nueDr742f1ibt3XjPVrCfNI_A-zYMTTqsXv6IA8ZXBo3x6ao3EPKgRoKaV1d4PUKsoilA3RFBB6EnB-p6y65okmksaR21aqtFy9J0CMHazSLCFo-b8CR0NBdyb73VKjmT3A44PORKmIbSCTsoLJBermt4PJ128w_zT6l-s'
  }
];

export default function AddGameModal({
  isOpen,
  onClose,
  onAddGame,
}: AddGameModalProps) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [developer, setDeveloper] = useState('');
  const [publisher, setPublisher] = useState('');
  const [releaseDate, setReleaseDate] = useState('2024');
  const [averageRating, setAverageRating] = useState<number>(4.5);
  const [metascore, setMetascore] = useState<number>(85);
  const [status, setStatus] = useState<GameStatus>('backlog');
  const [playtime, setPlaytime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  
  // Platform selection
  const [platforms, setPlatforms] = useState<string[]>(['PC']);
  
  // Cover selection
  const [selectedPresetUrl, setSelectedPresetUrl] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isPreset, setIsPreset] = useState(true);

  if (!isOpen) return null;

  const handlePlatformToggle = (plat: string) => {
    if (platforms.includes(plat)) {
      setPlatforms(platforms.filter((p) => p !== plat));
    } else {
      setPlatforms([...platforms, plat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddGame({
      title,
      developer: developer || 'Unknown Developer',
      publisher: publisher || 'Unknown Publisher',
      releaseDate: releaseDate || 'June 2026',
      averageRating: Number(averageRating),
      metascore: Number(metascore),
      genre: genre || 'Video Game',
      status,
      platform: platforms.length > 0 ? platforms : ['PC'],
      image: isPreset ? selectedPresetUrl : (customImageUrl || PRESET_IMAGES[0].url),
      progress: status === 'completed' ? 100 : Number(progress),
      playtime: Number(playtime),
      achievementsTotal: 40,
      achievementsUnlocked: status === 'completed' ? 40 : 0,
      deaths: 0,
      level: 1,
      journal: 'Added to vault.',
      gallery: [],
    });

    // Reset fields
    setTitle('');
    setGenre('');
    setDeveloper('');
    setPublisher('');
    setReleaseDate('2024');
    setAverageRating(4.5);
    setMetascore(85);
    setStatus('backlog');
    setPlaytime(0);
    setProgress(0);
    setPlatforms(['PC']);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#060e20]/85 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl glass-card rounded-2xl overflow-hidden shadow-2xl z-10 border border-white/10 p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-5">
          <h3 className="font-headline font-bold text-lg text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d0bcff]">library_add</span>
            Add New Vault Entry
          </h3>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 text-[#cbc3d7] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Genre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.55">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold">
                Game Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hades II / God of War"
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm"
              />
            </div>

            <div className="space-y-1.55">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold">
                Genre / Category
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Rogue-like Action / Metroidvania"
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm"
              />
            </div>
          </div>

          {/* Developer & Release Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold">
                Developer
              </label>
              <input
                type="text"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                placeholder="Supergiant Games"
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold">
                Publisher
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Self-Published"
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold">
                Release Date / Year
              </label>
              <input
                type="text"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                placeholder="e.g. May 2024"
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm"
              />
            </div>
          </div>

          {/* Status, Playtime, Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold font-bold">
                Play Vault Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GameStatus)}
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm cursor-pointer"
              >
                <option value="backlog">Backlog</option>
                <option value="playing">Currently Playing</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold font-bold font-mono">
                Playtime Hours
              </label>
              <input
                type="number"
                min="0"
                value={playtime}
                onChange={(e) => setPlaytime(Number(e.target.value))}
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold font-bold">
                Gameplay Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                disabled={status === 'completed'}
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm disabled:opacity-40"
              />
            </div>
          </div>

          {/* Scores details (Metascore & Rating) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold font-bold">
                Metascore (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={metascore}
                onChange={(e) => setMetascore(Number(e.target.value))}
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold font-bold">
                Your Rating (0-5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={averageRating}
                onChange={(e) => setAverageRating(Number(e.target.value))}
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm"
              />
            </div>
          </div>

          {/* Platforms checkboxes */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold">
              Available Platforms
            </label>
            <div className="flex flex-wrap gap-2.5">
              {['PC', 'PlayStation 5', 'Nintendo Switch', 'Xbox Series X'].map((plat) => {
                const isActive = platforms.includes(plat);
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => handlePlatformToggle(plat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isActive
                        ? 'bg-[#4cd7f6]/10 text-[#4cd7f6] border-[#4cd7f6]/30 shadow-md shadow-[#4cd7f6]/5'
                        : 'bg-[#171f33] border-white/10 text-[#cbc3d7] hover:border-white/20'
                    }`}
                  >
                    {plat === 'Nintendo Switch' ? 'Switch' : plat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Img choose */}
          <div className="space-y-3.5 pt-1">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[10px] text-[#cbc3d7]/80 uppercase tracking-widest block font-semibold">
                Cover Art Selection
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreset(true)}
                  className={`px-3 py-1 rounded text-[10px] font-bold ${
                    isPreset ? 'bg-[#d0bcff] text-[#3c0091]' : 'bg-white/5 text-[#cbc3d7]'
                  }`}
                >
                  Presets
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreset(false)}
                  className={`px-3 py-1 rounded text-[10px] font-bold ${
                    !isPreset ? 'bg-[#d0bcff] text-[#3c0091]' : 'bg-white/5 text-[#cbc3d7]'
                  }`}
                >
                  Custom URL
                </button>
              </div>
            </div>

            {isPreset ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                {PRESET_IMAGES.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => setSelectedPresetUrl(img.url)}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all group ${
                      selectedPresetUrl === img.url ? 'border-[#d0bcff] scale-95 shadow-md shadow-[#d0bcff]/25' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" alt={img.name} referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white tracking-tight leading-tight truncate">{img.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Paste game cover image URL here..."
                className="w-full bg-[#171f33] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#d0bcff] text-sm"
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-white font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#d0bcff] hover:bg-[#bba5f7] text-[#3c0091] font-bold rounded-xl transition-all shadow-lg shadow-[#d0bcff]/15"
            >
              Add to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
