import { Game, ActivityFeedItem } from './types';

export const INITIAL_GAMES: Game[] = [
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    subtitle: 'FROMSOFTWARE',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    releaseDate: 'Feb 25, 2022',
    averageRating: 4.9,
    metascore: 96,
    genre: 'Action RPG',
    status: 'playing',
    platform: ['PlayStation 5', 'Windows', 'Xbox Series X'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb3bLZW-P0RjM99OMXGHb6W262bcvc2A1sf6_cb0BLeX44AlE3bTRS-hXK_9zyn2CHKtKLoOXVwhwIrOLLIFdHdRlT1q_JejBhPrwmE0I1ggv4X6pgRBhV_HBXukYEEL5_omQRFi_OMu60RUtliM3lqh9uI4Q4H0FsjTT7w6N37Tu_Y9NjrVmu3eKtzevVeB5BgEeFkp0tsYR6OCS0Obgso6JGX-hsR7REOJGoJ26a1nRdKS1alzFWwklXK4eEJynOS3mJILex-fs',
    progress: 81,
    playtime: 142,
    achievementsTotal: 42,
    achievementsUnlocked: 34,
    deaths: 412,
    level: 125,
    journal: 'Current goal: Explore the Consecrated Snowfield to find the Haligtree Medallion. Need more Somber Smithing Stones [9] for the Moonveil Katana.',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOsE5xTSxSciEL8dLY4QGfqwdD2C0k0G9__RLmJZ6YwnT3ipO4PH_6J3TmFRHsBULsZZINw1C7PCRSMrYGZcH-jUmf24sgQltJCE16fLOLhe2hMm_xtNrMBU7rtuZqTa6Urk1HsVtqG90JnUEd41Gu68xglbco7629xKtMqfEBlnPONNuKJPnx5NNbLgo4sZ8TP8O3mvA3MPEdi8fi3I1M3ihukcAC7FkMIIIjofGDI0Z4ok3ms-qFDU6JcnggA-bB7CNXQR90Mt8',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9jPKdL-9a-PmyVPJ8mSNd9N0EA8CH5UsaHlFsyO5rQ_5_5g5QIxMAhqaSGNRAjyDZ8heOR59WXJF0qj_oBoHE9VShv33bLGfVB82Q0nueDr742f1ibt3XjPVrCfNI_A-zYMTTqsXv6IA8ZXBo3x6ao3EPKgRoKaV1d4PUKsoilA3RFBB6EnB-p6y65okmksaR21aqtFy9J0CMHazSLCFo-b8CR0NBdyb73VKjmT3A44PORKmIbSCTsoLJBermt4PJ128w_zT6l-s',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBkHyjAqZTyUtmaIbWGiaFS5gBsKhBh0Mp1yQCydquFiiKHSqdXa9odvJcA6ZgncXSz3N3QZdJRzRA2-OGA8u0StYmkuJRyeiBEjq4CijksUPbYro3G4e4j4pCuq346kJQh1lSQsle__efBRnKwTYNVcYR4ML_Rgm75BCxUATpWGGzaXMoODEBLV9JXh0bVzkWiiX-uli6HORGkJBL10N0Ao9I4leTSLq7EwrpVNYIa1hMcBZa8AonIHUa9xvwhPCaRzuv6i4zlzfE',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDwEd6IMSu2XpHUOueBPO1Djg8RWYrsv-1S93hUSHwvOSlkv02H52tTn753mSAPyHW8K8KfkKLfwGkkAGfYel3I0hlbZdGJTzGyBE9fR9CwvxdvSk2-qsXKgBglwilu5jcq11M2RTPI2eaL0qbGl8OTgUvS_8-tQlSkuAkp58ggnIEWX0klkNowsWH4q_5fdKfAyx-s-1I8c_R1JginceV16Q_HX-IXk7xx-AqpyB0hnnq5g_z-dd99KD2zRkHFhNT-l9yFGoNePlI'
    ],
    sessions: [
      { id: 'session-e1', title: 'Exploring Caelid', date: 'Oct 24, 2023', playtime: '3h 15m' },
      { id: 'session-e2', title: 'Stormveil Castle Raid', date: 'Oct 21, 2023', playtime: '5h 40m' },
      { id: 'session-e3', title: 'Character Creation & Tutorial', date: 'Oct 20, 2023', playtime: '2h 10m' }
    ]
  },
  {
    id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt Red',
    releaseDate: 'Dec 10, 2020',
    averageRating: 4.8,
    metascore: 90,
    genre: 'Action-RPG',
    status: 'playing',
    platform: ['PC'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb4k0OtEzvONP8W8TwXMLr3FwD1pEaYZsgRWwzHRXpqOdUciUUYqgQrLPFWStd-itpEn7OvZIA-HHFYsfINiUFk3NRCu-7ABiXOCo_WMzFhjvd9x2gTS2zlIXQuS1x8-R74Lrp4D5nUxewCiumSn5TjUfLqcD5w_sG3c_f9n91PywLlVvl4esdk8QQF8DL7JBqsvogqcET3gLHEyOdIyLvVdA_IbZS80JE6Q3_nA3a02SM5FACuddH2mwNYflOSMJ6tyrMNfyDiJU',
    progress: 65,
    playtime: 84,
    achievementsTotal: 44,
    achievementsUnlocked: 28,
    deaths: 98,
    level: 42,
    journal: 'Finished testing Ray tracing Overdrive settings. Framerates are smooth on DLSS 3. Now starting Cyberpsycho sightings.',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJbxRvwu1GUFcERJqwEMPox9_yByBD-nfCvavMItJr0x3fADcXel6AyZuUAGGMSzxj0Hj8wWkb9HlqcQTA94mm8XZPZbPW885HC5ufZHJY5GoRbdjT72oCtxkkGMxvgmRnzjawovTdQuBGIDOtzaWRuY-quzOrUxG5Ogin59EKdACmUqdICmCSGq2u9mGByOgLsMOmC8QxxDEPcXRFmE6_aF9ufPYh1vHPg0pN9ZldlBQEM-djbckqEpcmPlQ_B2Gm13nUKt-j7XU'
    ],
    sessions: [
      { id: 'session-c1', title: 'Raytracing benchmark and testing', date: 'May 12, 2024', playtime: '2h 30m' }
    ]
  },
  {
    id: 'ruins-of-aeon',
    title: 'Ruins of Aeon',
    developer: 'Solari Studio',
    publisher: 'Aether Games',
    releaseDate: 'Apr 14, 2024',
    averageRating: 4.6,
    metascore: 88,
    genre: 'Adventure RPG',
    status: 'backlog',
    platform: ['PS5'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ZilUBuE2anbIdjMnuyB4OvM-9vaThKuTN_Kc-25xX4hyOUbKAmH8okysqPred0HWyTpQ-yOhgx86CdJAo-jErnHN2W71t_EJyEzhoguScof7PIPQw16i3W-wRdavTgUrO2wuK_B_8QxgB6EL29GxlZFda981gS_AxvcF8bmn20rEUp1ZDQKHLfeKQXGK6HZ28nH-_btutBYfl7X_jksfK9PvFO0TMG9MvhBRUV8Gr3P4XP7WcIjcN4zc0LcHvuh1VLrGWCeIxr0',
    progress: 0,
    playtime: 0,
    achievementsTotal: 30,
    achievementsUnlocked: 0,
    deaths: 0,
    level: 1,
    journal: 'Backlogged adventure game. Solari Studios is known for extreme detail. Planning to jump in right after Elden Ring!',
    gallery: [],
    sessions: []
  },
  {
    id: 'stellaris',
    title: 'Stellaris Bound',
    developer: 'Paradox Development Studio',
    publisher: 'Paradox Interactive',
    releaseDate: 'May 9, 2016',
    averageRating: 4.5,
    metascore: 82,
    genre: 'Grand Strategy / Sci-Fi',
    status: 'completed',
    platform: ['Switch'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNj0cJ0rUb67EgmzOcjTVOkAupuNJlDkDa8TetfCtdT51lSp0I3XttU8lcqvj0sjU72gyRzfuKtqF6kGM1sVhCdcDtybS84-QzAS51KmuV5yEORu4HwOCitLdEVBmurXxcUEz09rdx0Ie1WTLzWf8EuaPYMDslc0CYV6y_jw6ktazGXQRnZQBma6k5O6eTBHB49swDXx6tLd5GExTuYkUyEIdY3gqUT4Rw5L2hm9OlTpusUPAk71gqQ4iSYtniaknAxAqEGxmJcQY',
    progress: 100,
    playtime: 320,
    achievementsTotal: 50,
    achievementsUnlocked: 50,
    deaths: 12, // empires fallen
    level: 80,
    journal: 'Successfully achieved galactic federation victory as a benevolent robotic hivemind. Unlocked all achievements.',
    gallery: [],
    sessions: [
      { id: 'session-s1', title: 'Crisis Resolution & End Game', date: 'Jan 15, 2024', playtime: '8h 20m' }
    ]
  },
  {
    id: 'retro-circuit',
    title: 'Retro Circuit',
    developer: 'Nostalgia Arcade',
    publisher: 'Byte Sized',
    releaseDate: 'Nov 3, 2023',
    averageRating: 4.2,
    metascore: 78,
    genre: 'Retro Platformer',
    status: 'dropped',
    platform: ['PC'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMJca-HMV5NfMTTv1uldvuTcdVCWL5ya0aV_HWMGT-jPrfb0hBnda-g5kqBEHaOnq_zZXwVMeycxhGIXvI0_EzhtzGWcad6eRnGKRUXuGJg9djKpG1FOOwpVToBi4RR6vmrnpEocJMCVw6IcM_gmCwQv1oivzOntNu0OG4xFI7VIytTRnjBbNfjepqibL6oR7IeYoFpza-IRYgY5RCLbERApIjAnrAqrdiXzpVNqqwe-aMS5v-EuwOcvq1UXWyMBs3KGuMVq8dwhw',
    progress: 24,
    playtime: 15,
    achievementsTotal: 25,
    achievementsUnlocked: 4,
    deaths: 189, // intense levels!
    level: 8,
    journal: 'Nostalgic synth vibes, but level 9 is insanely unforgiving. Dropping this for now to preserve my hair sanity.',
    gallery: [],
    sessions: [
      { id: 'session-r1', title: 'Ragequitting level 9 challenge', date: 'Dec 12, 2023', playtime: '1h 15m' }
    ],
    lastPlayed: '2M AGO'
  },
  {
    id: 'ethereal-realms',
    title: 'Ethereal Realms',
    developer: 'Mana Bloom',
    publisher: 'Gamer Collective',
    releaseDate: 'Jan 22, 2025',
    averageRating: 4.7,
    metascore: 91,
    genre: 'Zen / Atmospheric',
    status: 'playing',
    platform: ['PC'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGKsCoevmUcGeYEa8MjZdYPJfgieTgCRAarYbtyd0HHtoZnH-GFZbu9x_asyXS1-1uAFNgQ5H-9FJJVBFVG1AZpTuA6guMW4LrO_xcSmHKtfc60ymZIdaqq1MmZlyBZ_hgRAIE5woHC0q2fMANKTYLbXuki419JbYvUFRKeBcyvrF3cc0wuFwOExgzLoqiQm75wHWpUlupTX8cOBi7BPKqcN17RwnvTrB8nNVD7TS9M543hmG1diMqjnfAG8raxgzshGP4fdwgXuU',
    progress: 12,
    playtime: 14,
    achievementsTotal: 30,
    achievementsUnlocked: 3,
    deaths: 2,
    level: 5,
    journal: 'Extremely peaceful, floating islands with magical twin moon. Pure meditation in game format.',
    gallery: [],
    sessions: [
      { id: 'session-et1', title: 'Wandering on Skycliff', date: 'Feb 1, 2024', playtime: '1h 45m' }
    ]
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityFeedItem[] = [
  {
    id: 'act-1',
    gameId: 'cyberpunk-2077',
    type: 'session',
    gameTitle: 'Cyberpunk 2077',
    gameImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb4k0OtEzvONP8W8TwXMLr3FwD1pEaYZsgRWwzHRXpqOdUciUUYqgQrLPFWStd-itpEn7OvZIA-HHFYsfINiUFk3NRCu-7ABiXOCo_WMzFhjvd9x2gTS2zlIXQuS1x8-R74Lrp4D5nUxewCiumSn5TjUfLqcD5w_sG3c_f9n91PywLlVvl4esdk8QQF8DL7JBqsvogqcET3gLHEyOdIyLvVdA_IbZS80JE6Q3_nA3a02SM5FACuddH2mwNYflOSMJ6tyrMNfyDiJU',
    title: 'Logged 4 hours in Cyberpunk 2077',
    subtitle: 'PLAY SESSION',
    description: 'Explored the Badlands and completed the "Chippin\' In" quest line. Levelled up Intelligence to 18.',
    timestamp: '2 HOURS AGO',
    tags: ['ACTION-RPG', 'COMPLETED QUEST']
  },
  {
    id: 'act-2',
    gameId: 'elden-ring',
    type: 'achievement',
    gameTitle: 'Elden Ring',
    gameImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb3bLZW-P0RjM99OMXGHb6W262bcvc2A1sf6_cb0BLeX44AlE3bTRS-hXK_9zyn2CHKtKLoOXVwhwIrOLLIFdHdRlT1q_JejBhPrwmE0I1ggv4X6pgRBhV_HBXukYEEL5_omQRFi_OMu60RUtliM3lqh9uI4Q4H0FsjTT7w6N37Tu_Y9NjrVmu3eKtzevVeB5BgEeFkp0tsYR6OCS0Obgso6JGX-hsR7REOJGoJ26a1nRdKS1alzFWwklXK4eEJynOS3mJILex-fs',
    title: "Completed Achievement: 'The Star'",
    subtitle: 'RARE ACHIEVEMENT',
    description: 'Unlocked after defeating the final boss and witnessing the Ranni ending.',
    timestamp: 'YESTERDAY',
    rarity: 'Epic',
    tags: ['BOSS SLAIN', 'GOLD RATING']
  },
  {
    id: 'act-3',
    gameId: 'stellaris',
    type: 'backlog',
    gameTitle: 'Stellaris Bound',
    gameImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNj0cJ0rUb67EgmzOcjTVOkAupuNJlDkDa8TetfCtdT51lSp0I3XttU8lcqvj0sjU72gyRzfuKtqF6kGM1sVhCdcDtybS84-QzAS51KmuV5yEORu4HwOCitLdEVBmurXxcUEz09rdx0Ie1WTLzWf8EuaPYMDslc0CYV6y_jw6ktazGXQRnZQBma6k5O6eTBHB49swDXx6tLd5GExTuYkUyEIdY3gqUT4Rw5L2hm9OlTpusUPAk71gqQ4iSYtniaknAxAqEGxmJcQY',
    title: 'Added Starfield to Backlog',
    subtitle: 'COLLECTION UPDATE',
    description: 'Planning to start this after finishing Cyberpunk. The planetary exploration looks promising.',
    timestamp: '3 DAYS AGO',
    tags: ['WISHLIST', 'SCI-FI']
  }
];
