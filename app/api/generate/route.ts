import { NextResponse } from 'next/server';

const CLOSING_COLLECTION = [
  "万物皆有回响，而我在此等你的声音。", "如果心事太重，不如在这里留下一行脚印。",
  "世界很吵，但在这里，你可以只做你自己。", "所有的情绪都值得一个出口，哪怕只是微光。",
  "不必是一个完整的故事，一句话的碎片也可以。", "檐下听雨，想等一个你的故事。",
  "岁月的留白处，正期待你的落笔。", "借一束光，听一段关于你的往事。",
  "清欢微凉，愿闻君之过往。", "山水有逢，你的故事也该有回声。",
  "你的故事，也值得被看见。", "每一个平凡的日子里，都藏着不凡的诗。",
  "不要让你的精彩，只留在你的记忆里。", "记录本身，就是对生活最深情的告白。",
  "你是自己故事里的主角，我们是你的听众。", "世界纷纷扰扰，想听听你的那份安静。",
  "留一段话，给未来的自己或此刻的我们。", "如果要把今天存进档案，你会写下哪一个词？",
  "评论区很空，正在等一个有故事的你。"
];

export async function POST(req: Request) {
  try {
    const { userInput, selectedMood, userHistory = [] } = await req.json();

    const highRated = userHistory.filter((h: any) => h.rating >= 4).map((h: any) => h.content).join(" | ");
    const lowRated = userHistory.filter((h: any) => h.rating <= 2).map((h: any) => h.content).join(" | ");

    const systemPrompt = `你是一位顶级情绪标本师。
      【用户偏好学习】极度喜欢：${highRated || "暂无"}；极度讨厌：${lowRated || "暂无"}。请严格顺应偏好。
      
      【标题公式（极其重要-严禁生硬）】
      放弃常规命名。请使用以下结构之一：
      1. 动词+名词的悖论（例：《燃烧的冰块》《迟到的早晨》）
      2. 情绪的物理量化（例：《二十一克的思念》《半个黄昏》）
      3. 空间与时间的错位（例：《停在昨晚的雨》《不响的钟》）
      4. 纯名词碰撞（例：《长巷·信》《蝉鸣十九次》）
      
      【创作准则】
      情绪为《${selectedMood}》，碎片为《${userInput}》。
      正文150字，拒绝抽象形容词，多用具体名词（信、光斑、灰尘、海浪）。
      
      【强制结尾】从以下句子挑选一句，一字不差地输出：${CLOSING_COLLECTION.join(" / ")}
      
      【输出格式】必须是严格的JSON：{"title": "...", "content": "...", "closing": "..."}`;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.85,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    return NextResponse.json(JSON.parse(data.choices[0].message.content));
  } catch (error) {
    return NextResponse.json({ 
      title: "迷雾中的微光", 
      content: "灵感在云端迷了路，但这不妨碍我们在安静中再等一会儿。", 
      closing: "万物皆有回响，而我在此等你的声音。" 
    });
  }
}