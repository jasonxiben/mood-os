"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Star, Wind, Aperture } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MoodOS() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedMood, setSelectedMood] = useState('思念');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('mood_os_v9');
    if (saved) {
      setStories(JSON.parse(saved));
    } else {
      setShowTutorial(true);
    }

    // 捕捉鼠标位置用于互动背景
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRate = (idx: number, rating: number) => {
    const updated = [...stories];
    updated[idx].rating = rating;
    setStories(updated);
    localStorage.setItem('mood_os_v9', JSON.stringify(updated));
  };

  const handleCopy = (item: any, index: number) => {
    const text = `【${item.title}】\n\n${item.content}\n\n${item.closing}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const generate = async () => {
    if (loading || !userInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput, selectedMood, userHistory: stories })
      });
      const data = await res.json();
      const updated = [{ ...data, moodTag: selectedMood, id: Date.now(), rating: 0 }, ...stories].slice(0, 20);
      setStories(updated);
      localStorage.setItem('mood_os_v9', JSON.stringify(updated));
      setUserInput('');
    } catch (e) {
      console.error("捕捉失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1D1D1F] p-6 md:p-16 font-sans relative overflow-x-hidden selection:bg-sky-200">
      
      {/* 动态游离的情绪背景光晕，跟随鼠标产生微弱偏移，增强可玩性 */}
      <motion.div 
        animate={{ x: mousePos.x / 40, y: mousePos.y / 40 }}
        className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sky-200/40 rounded-full blur-[140px] pointer-events-none z-0"
      />

      {/* --- 开屏引导页 (带弹簧动画) --- */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/40"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white/90 p-16 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-white max-w-lg text-center"
            >
              <Wind className="w-12 h-12 text-sky-400 mx-auto mb-8 animate-pulse" />
              <h2 className="text-3xl font-normal tracking-[0.2em] text-[#1D1D1F] mb-6">诗境·清欢</h2>
              <p className="text-slate-600 leading-loose mb-10 text-[15px] font-normal">
                欢迎来到 Mood OS。<br/>
                在这里，每一次情绪的投递都会凝结成一座标本。<br/>
                请通过评分告诉系统你的偏好，<br/>
                它将随着时间推移，成为最懂你的灵魂写手。
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTutorial(false)}
                className="bg-[#1D1D1F] text-white px-10 py-4 rounded-full tracking-widest text-sm shadow-2xl"
              >
                开启标本之旅
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 全屏魔法加载动画 --- */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Aperture className="w-16 h-16 text-sky-500/80 mb-6" />
            </motion.div>
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm tracking-[0.5em] text-slate-600 uppercase font-bold"
            >
              情绪解析中 / 进化重组
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 主界面 --- */}
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col xl:flex-row justify-between items-center mb-24 gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center xl:text-left cursor-default"
          >
            <motion.h1 
              whileHover={{ scale: 1.02, textShadow: "0px 0px 15px rgba(56,189,248,0.3)" }}
              className="text-4xl font-normal tracking-[0.4em] text-[#1D1D1F] flex items-center justify-center xl:justify-start gap-4 transition-all"
            >
              <Wind className="w-8 h-8 text-sky-500/80" /> 诗境·清欢
            </motion.h1>
            <p className="text-[12px] text-slate-500 mt-5 tracking-[0.6em] font-medium">持续进化的情绪系统</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full xl:w-auto gap-4 p-3 bg-white/80 backdrop-blur-3xl rounded-full border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <select 
              value={selectedMood} 
              onChange={e => setSelectedMood(e.target.value)} 
              className="bg-transparent px-6 py-2 text-[15px] font-medium text-slate-700 focus:outline-none tracking-widest cursor-pointer"
            >
              {['思念','孤独','热恋','伤感','治愈','释然'].map(m => <option key={m}>{m}</option>)}
            </select>
            <div className="w-[1px] h-8 bg-slate-200 my-auto"></div>
            <input 
              value={userInput} 
              onChange={e => setUserInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="在此留下你的心事..." 
              className="bg-transparent border-none px-6 text-[15px] w-full xl:w-64 focus:outline-none placeholder:text-slate-400 font-normal" 
            />
            <motion.button 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={generate} 
              className="bg-[#1D1D1F] px-8 py-3.5 rounded-full hover:bg-black shadow-xl flex items-center justify-center min-w-[100px]"
            >
              <span className="text-white text-sm tracking-widest">封装情绪</span>
            </motion.button>
          </motion.div>
        </header>
        
        {/* --- 空白期交互态 --- */}
        {stories.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: ["0px 0px 0px rgba(56,189,248,0)", "0px 0px 60px rgba(56,189,248,0.2)", "0px 0px 0px rgba(56,189,248,0)"]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-32 h-32 rounded-full border border-sky-100 flex items-center justify-center bg-white/40 backdrop-blur-md mb-8 cursor-pointer"
              onClick={() => document.querySelector('input')?.focus()}
            >
              <Sparkles className="w-8 h-8 text-sky-300" />
            </motion.div>
            <p className="tracking-[0.4em] text-slate-400 text-sm font-light">系统正在沉睡，投入碎片唤醒</p>
          </motion.div>
        )}

        {/* --- 卡片生成区 --- */}
        <motion.main 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence mode='popLayout'>
            {stories.map((item, idx) => (
              <motion.div 
                layout
                key={item.id} 
                initial={{ opacity: 0, scale: 0.8, y: 100, rotateX: -20 }} // 像从地下信箱弹射出来的初始状态
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                transition={{ type: "spring", stiffness: 120, damping: 15, mass: 1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group flex flex-col justify-between p-12 rounded-[48px] bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] min-h-[480px] origin-bottom"
              >
                <div>
                  <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>
                      <span className="text-[12px] tracking-[0.3em] font-bold text-slate-400">{item.moodTag}存档</span>
                    </div>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {[1,2,3,4,5].map(s => (
                        <motion.div key={s} whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }}>
                          <Star 
                            onClick={() => handleRate(idx, s)} 
                            className={`w-4 h-4 cursor-pointer transition-colors ${item.rating >= s ? 'fill-sky-400 text-sky-400' : 'text-slate-200 hover:text-sky-200'}`} 
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <motion.h2 layout="position" className="text-2xl font-medium text-[#1D1D1F] mb-10 leading-snug tracking-wide selection:bg-sky-100">
                    {item.title}
                  </motion.h2>
                  <p className="text-[#34495E] leading-[2.4] font-normal text-[16px] text-justify selection:bg-sky-100">
                    “{item.content}”
                  </p>
                </div>

                <div className="mt-12 pt-8 flex items-center justify-between">
                  <p className="text-[13px] text-sky-800/60 font-medium tracking-widest">{item.closing}</p>
                  <motion.button 
                    whileHover={{ scale: 1.1, backgroundColor: "#F0F9FF" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCopy(item, idx)} 
                    className="p-3 bg-slate-50 rounded-full transition-colors"
                  >
                    {copiedIndex === idx ? <Check className="w-4 h-4 text-sky-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
}