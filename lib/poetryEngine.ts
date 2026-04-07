import poetryData from '@/data/poetry_db.json';

export interface Poem {
  id: string;
  author?: string;
  content: string;
  tags: string[];
  color: string;
}

export const poetryEngine = {
  // 根据选中的情绪从 300 首库中匹配
  getPoemByMood: (mood: string): Poem => {
    const pool = poetryData.bundle.filter(p => p.tags.includes(mood));
    const finalPool = pool.length > 0 ? pool : poetryData.bundle;
    return finalPool[Math.floor(Math.random() * finalPool.length)];
  }
};