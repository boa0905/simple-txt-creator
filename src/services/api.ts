const API_URL = import.meta.env.VITE_API_URL;

export interface OnlinePlayersResponse {
  onlinePlayers: number;
}

export interface RegisteredPlayersResponse {
  registeredPlayers: number;
}

export interface ServerStatsResponse {
  cpu: string;        // %
  memory: string;     // %
  disk: string;       // %
  diskActive: string; // %
  ping: number;       // ms
}

export interface ServerUptimeResponse {
  uptime: {
    current7dRatePercent: number;
    past7dRatePercent: number;
    growthRatePercent: number | null;
  };
}

export interface Character {
  name: string;
  account: string;
  classname: string;
  x: number;
  y: number;
  z: number;
  level: number;
  health: number;
  mana: number;
  strength: number;
  intelligence: number;
  experience: number;
  gold: number;
  online: number;
  gamemaster: number;
  deleted: number;
  donation_point: number;
  // Additional fields available but not shown in interface
  [key: string]: any;
}

export interface CharactersResponse {
  characters: Character[];
}

export interface PlayerAnalyticsResponse {
  daily: {
    today: { date: string; count: number };
    yesterday: { date: string; count: number };
    growthRatePercent: number;
  };
  weekly: {
    thisWeek: { year: number; weekNum: number; count: number };
    lastWeek: { year: number; weekNum: number; count: number };
    growthRatePercent: number;
  };
  monthly: {
    thisMonth: { year: number; monthNum: number; count: number };
    lastMonth: { year: number; monthNum: number; count: number };
    growthRatePercent: number;
  };
  retention: {
    sevenDay: {
      cohortDate: string;
      currentDate: string;
      cohortSize: number;
      retainedUsers: number;
      retentionRatePercent: number;
    };
  };
}

export interface Account {
  name: string;
  password: string;
  created: number;
  lastlogin: number;
  banned: number;
  reward_baned: number;
}

export interface RewardRule {
  rule_id: number;
  skill_name: string;
  min_level: number;
  max_level: number;
  reward_amount: number;
  active: number;
  created: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  img_url: string;
  created: string;
}

export interface Guild {
  name: string;
  leader: string;
  notice: string;
  membersCnt: number;
  score: number;
  battleLvl: number;
  battleXp: number;
  gatherLvl: number;
  gatherXP: number;
  craftLvl: number;
  craftXP: number;
  gold: number;
  pearl: number;
  log_A: number;
  log_B: number;
  plank_A: number;
  plank_B: number;
  ore_A: number;
  ore_B: number;
  ore_C: number;
  metalBar_A: number;
  metalBar_B: number;
  cotton: number;
  wool: number;
  peltSmall: number;
  peltMedium: number;
  fabricCotton: number;
  fabricWool: number;
  threadA: number;
  threadB: number;
  carniFiber: number;
  mosquitoWings: number;
  frogSkin: number;
  spiderWeb: number;
  softLeather: number;
  thickLeather: number;
  airSoul: number;
  earthSoul: number;
  golemPlate: number;
  energyRod: number;
  fireGlue: number;
  silphium: number;
  diamond: number;
  gold_tax: number;
  log_A_tax: number;
  log_B_tax: number;
  plank_A_tax: number;
  plank_B_tax: number;
  ore_A_tax: number;
  ore_B_tax: number;
  ore_C_tax: number;
  metalBar_A_tax: number;
  metalBar_B_tax: number;
  cotton_tax: number;
  wool_tax: number;
  peltSmall_tax: number;
  peltMedium_tax: number;
  fabricCotton_tax: number;
  fabricWool_tax: number;
  threadA_tax: number;
  threadB_tax: number;
  carniFiber_tax: number;
  mosquitoWings_tax: number;
  frogSkin_tax: number;
  spiderWeb_tax: number;
  softLeather_tax: number;
  thickLeather_tax: number;
  airSoul_tax: number;
  earthSoul_tax: number;
  golemPlate_tax: number;
  energyRod_tax: number;
  fireGlue_tax: number;
  tax_time: string;
  coins: number;
  foundedAt: number;
  lastsaved: number;
}

const createAuthHeaders = (accessToken?: string) => {
  return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
};

export const apiService = {
  getOnlinePlayers: async (accessToken?: string): Promise<OnlinePlayersResponse> => {
    const response = await fetch(`${API_URL}/db/characters/stats/online`, {
      headers: createAuthHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch online players');
    }
    return response.json();
  },

  getRegisteredPlayers: async (accessToken?: string): Promise<RegisteredPlayersResponse> => {
    const response = await fetch(`${API_URL}/db/characters/stats/registered`, {
      headers: createAuthHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch registered players');
    }
    return response.json();
  },

  getCharacters: async (accessToken?: string): Promise<Character[]> => {
    const response = await fetch(`${API_URL}/db/characters`, {
      headers: createAuthHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch characters');
    }
    return response.json();
  },

  updateCharacter: async (name: string, updates: Partial<Character>, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    const response = await axios.put(`${API_URL}/db/characters/${name}`, updates, {
      headers: {
        'Content-Type': 'application/json',
        ...createAuthHeaders(accessToken),
      },
    });
    return response.data;
  },

  getServerStats: async (accessToken?: string): Promise<ServerStatsResponse> => {
    const response = await fetch(`${API_URL}/system/stats`, {
      headers: createAuthHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch system stats");
    }
    return response.json();
  },

  getServerUptime: async (accessToken?: string): Promise<ServerUptimeResponse> => {
    const axios = (await import('axios')).default;
    const response = await axios.get(`${API_URL}/db/server-sessions/summary`, {
      headers: createAuthHeaders(accessToken),
    });
    return response.data;
  },

  getPlayerAnalytics: async (accessToken?: string): Promise<PlayerAnalyticsResponse> => {
    const axios = (await import('axios')).default;
    const response = await axios.get(`${API_URL}/db/player-analytics/summary`, {
      headers: createAuthHeaders(accessToken),
    });
    return response.data;
  },

  getGuilds: async (accessToken?: string): Promise<Guild[]> => {
    const axios = (await import('axios')).default;
    const response = await axios.get(`${API_URL}/db/guild-info`, {
      headers: createAuthHeaders(accessToken),
    });
    return response.data;
  },

  updateGuild: async (name: string, updates: Partial<Guild>, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    const response = await axios.put(`${API_URL}/db/guild-info/${encodeURIComponent(name)}`, updates, {
      headers: {
        'Content-Type': 'application/json',
        ...createAuthHeaders(accessToken),
      },
    });
    return response.data;
  },

  getAccounts: async (accessToken?: string): Promise<Account[]> => {
    const axios = (await import('axios')).default;
    const response = await axios.get(`${API_URL}/db/accounts`, {
      headers: createAuthHeaders(accessToken),
    });
    return response.data;
  },

  setBan: async (accountName: string, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    await axios.put(`${API_URL}/db/accounts/${accountName}/setban`, {}, {
      headers: createAuthHeaders(accessToken),
    });
  },

  clearBan: async (accountName: string, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    await axios.put(`${API_URL}/db/accounts/${accountName}/clearban`, {}, {
      headers: createAuthHeaders(accessToken),
    });
  },

  setRewardBan: async (accountName: string, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    await axios.put(`${API_URL}/db/accounts/${accountName}/setrewardban`, {}, {
      headers: createAuthHeaders(accessToken),
    });
  },

  clearRewardBan: async (accountName: string, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    await axios.put(`${API_URL}/db/accounts/${accountName}/clearrewardban`, {}, {
      headers: createAuthHeaders(accessToken),
    });
  },

  getRewardRules: async (accessToken?: string): Promise<RewardRule[]> => {
    const axios = (await import('axios')).default;
    const response = await axios.get(`${API_URL}/db/mnee-reward-rules`, {
      headers: createAuthHeaders(accessToken),
    });
    // Handle the API response format - it might be wrapped in an object
    return Array.isArray(response.data) ? response.data : [];
  },

  updateRewardRule: async (ruleId: number, updatedData: Omit<RewardRule, 'rule_id' | 'created'>, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    await axios.put(`${API_URL}/db/mnee-reward-rules/${ruleId}`, updatedData, {
      headers: {
        'Content-Type': 'application/json',
        ...createAuthHeaders(accessToken),
      },
    });
  },

  createRewardRule: async (ruleData: Omit<RewardRule, 'rule_id' | 'created'>, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    await axios.post(`${API_URL}/db/mnee-reward-rules`, ruleData, {
      headers: {
        'Content-Type': 'application/json',
        ...createAuthHeaders(accessToken),
      },
    });
  },

  deleteRewardRule: async (ruleId: number, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    await axios.delete(`${API_URL}/db/mnee-reward-rules/${ruleId}`, {
      headers: createAuthHeaders(accessToken),
    });
  },

  // News API methods
  getNews: async (accessToken?: string): Promise<NewsArticle[]> => {
    if (!API_URL || API_URL === 'undefined') {
      console.warn('API_URL is not configured');
      return [];
    }
    const axios = (await import('axios')).default;
    const response = await axios.get(`${API_URL}/db/news`, {
      headers: createAuthHeaders(accessToken),
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  createNews: async (newsData: Omit<NewsArticle, 'id' | 'created'>, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    await axios.post(`${API_URL}/db/news`, newsData, {
      headers: {
        'Content-Type': 'application/json',
        ...createAuthHeaders(accessToken),
      },
    });
  },

  updateNews: async (newsId: number, updatedData: Omit<NewsArticle, 'id' | 'created'>, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    await axios.put(`${API_URL}/db/news/${newsId}`, updatedData, {
      headers: {
        'Content-Type': 'application/json',
        ...createAuthHeaders(accessToken),
      },
    });
  },

  deleteNews: async (newsId: number, accessToken?: string): Promise<void> => {
    const axios = (await import('axios')).default;
    await axios.delete(`${API_URL}/db/news/${newsId}`, {
      headers: createAuthHeaders(accessToken),
    });
  }
};