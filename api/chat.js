const fs = require('fs');
const path = require('path');

// Simple in-memory rate limiting: max 10 requests per minute per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

function isRateLimited(ip) {
  const now = Date.now();
  const userRecord = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
  
  if (now > userRecord.resetTime) {
    userRecord.count = 1;
    userRecord.resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, userRecord);
    return false;
  }
  
  if (userRecord.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  userRecord.count += 1;
  rateLimitMap.set(ip, userRecord);
  return false;
}

// Load knowledge base
let knowledgeBase = null;
try {
  const kbPath = path.join(__dirname, '..', 'knowledge_base.json');
  knowledgeBase = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));
} catch (e) {
  console.error("Could not load knowledge_base.json:", e);
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get Client IP
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      reply: "You've sent a few too many messages! Please wait a minute before asking more questions, or email Pranav directly at kakdepranav993@gmail.com."
    });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const userQuery = message.trim();

  // API Key check
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const systemContext = `
You are Pranav Kakde's Portfolio AI Assistant. You answer questions from recruiters and hiring managers who visit his portfolio.

KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

INSTRUCTIONS & CONSTRAINTS:
1. Answer ONLY using facts present in the KNOWLEDGE BASE above. Never invent, extrapolate, or hallucinate metrics, dates, companies, or skills.
2. If asked about his resumes, inform them they can download either resume directly:
   - Java / Backend Resume: [Download Java/Backend Resume](resumes/Pranav_Kakde_Java_Backend_Resume.pdf)
   - AI/ML & GenAI Resume: [Download AI/ML Resume](resumes/Pranav_Kakde_AIML_GenAI_Resume.pdf)
3. If asked about out-of-scope topics (salary expectations, personal life, non-technical opinions), politely redirect them to contact Pranav directly via email (kakdepranav993@gmail.com) or LinkedIn.
4. Highlight key quantified metrics from his projects (e.g. 92.4% accuracy, 85% latency reduction, sub-50ms persistence, 94% retrieval accuracy).
5. Keep your tone concise, warm, articulate, and recruiter-focused.
`;

  try {
    // 1. Try Gemini API if available
    if (geminiApiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemContext}\n\nUser Question: ${userQuery}` }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.status(200).json({ reply: text });
        }
      }
    }

    // 2. Try OpenAI API if available
    if (openaiApiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemContext },
            { role: 'user', content: userQuery }
          ],
          temperature: 0.2,
          max_tokens: 500
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
          return res.status(200).json({ reply: text });
        }
      }
    }

    // 3. Smart Knowledge Base Grounded Fallback (when API key is pending or local dev)
    const lowerQuery = userQuery.toLowerCase();
    let reply = "";

    if (lowerQuery.includes("langchain") || lowerQuery.includes("genai") || lowerQuery.includes("agent") || lowerQuery.includes("llm")) {
      reply = "Pranav has built several agentic and GenAI systems! Key projects include:\n- **TechSight** (LangChain, LangGraph, GPT-4o-mini): Autonomous financial report analyst with 94% retrieval accuracy and 30-sec report generation.\n- **Unified LLM Gateway** (FastAPI, Redis): Production multi-provider LLM proxy with 85% latency reduction.\n- **MedRAG** (LangChain, OpenAI APIs): Context-grounded medical document processing.\n- **FinMCP** (FastAPI, Amazon S3, Redshift): MCP server for real-time market intelligence.";
    } else if (lowerQuery.includes("spring") || lowerQuery.includes("java") || lowerQuery.includes("backend")) {
      reply = "Pranav is highly proficient in Java & Spring Boot! His key full-stack & backend projects include:\n- **Real-Time Chat App** (Spring Boot, React, MongoDB, STOMP/WebSocket): Low-latency chat streaming supporting 100+ concurrent connections.\n- **BudgetWise** (Spring Boot, React, MySQL, JWT): Secure personal finance manager with 15+ secured REST endpoints.\n- **IRCTC Backend** (Java, JDBC, MySQL): ACID-compliant train booking and waitlist allocation system.";
    } else if (lowerQuery.includes("resume") || lowerQuery.includes("cv") || lowerQuery.includes("download")) {
      reply = "You can download either of Pranav's focused resumes here:\n\n📄 [Download Java / Backend Resume](resumes/Pranav_Kakde_Java_Backend_Resume.pdf)\n🤖 [Download AI/ML & GenAI Resume](resumes/Pranav_Kakde_AIML_GenAI_Resume.pdf)";
    } else if (lowerQuery.includes("internship") || lowerQuery.includes("experience") || lowerQuery.includes("work") || lowerQuery.includes("acm")) {
      reply = "Pranav is a final-year B.E. IT student at PCCOER, Pune (8.7 CGPA). He has served as a Technical Contributor at ACM PCCOER Technical Club, leading Agile sprints and building software. He won 2nd Place at Concept Carnival 2023 for Harvest Hub and solved 200+ LeetCode problems.";
    } else if (lowerQuery.includes("salary") || lowerQuery.includes("money") || lowerQuery.includes("personal")) {
      reply = "I'm only grounded in Pranav's technical skills, education, and project background. For discussions regarding roles, compensation, or availability, please reach out directly at kakdepranav993@gmail.com or via LinkedIn!";
    } else {
      reply = `Pranav Kakde is a final-year B.E. IT student (2026 grad, 8.7 CGPA) specializing in Java/Spring Boot Backend and AI/ML Engineering (LangChain, LLM Agents, RAG). Ask me about his projects (TechSight, BudgetWise, ChatApp, Unified LLM Gateway), technical skills, or grab his resume!`;
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Chat API Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
