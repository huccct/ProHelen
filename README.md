<div align="center">  
  <h1>ProHelen</h1>
  
  **Visual AI Prompt Design Platform**
  
  *Build sophisticated AI instructions with intuitive visual blocks*

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
  
  [🌐 Live Demo](https://prohelen.dev) · [📖 Documentation](#features) · [⚡ Quick Start](#quick-start)
</div>

---

## ✨ What is ProHelen?

Transform complex AI prompt engineering into **visual building blocks**. No coding required—just drag, drop, and create powerful LLM instructions that actually work.

### 🎯 Core Features

- **🎨 Visual Block System** - 18 specialized blocks for complete prompt control
- **📚 Smart Templates** - Ready-to-use patterns for any use case  
- **⚡ Real-time Preview** - See your AI instructions come to life instantly
- **🤝 Team Collaboration** - Build and share prompts with your team

### 🧩 Block Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| 🎭 **Role & Context** | Define AI identity | System prompts, personas |
| 💬 **Interaction Style** | Communication patterns | Tone, format, style |
| 🎛️ **Task Control** | Goal management | Objectives, constraints |
| 🧠 **Thinking & Logic** | Reasoning processes | Step-by-step, analysis |
| 🚀 **Skills & Development** | Professional growth | Learning, improvement |

---

## 🚀 Quick Start

```bash
# Clone & install
git clone https://github.com/your-username/ProHelen.git
cd ProHelen && pnpm install

# Setup environment
cp .env.example .env.local
# Add your database URL and auth secrets

# Initialize database
pnpm prisma generate && pnpm prisma db push

# Launch
pnpm dev
```

Visit [localhost:3000](http://localhost:3000) 🎉

---

## 🛠️ Built With

**Frontend**: Next.js 15 · React 19 · TypeScript · Tailwind CSS  
**Backend**: Prisma · PostgreSQL · NextAuth.js  
**UI/UX**: Radix UI · Framer Motion · React Flow  

---

## 📁 Project Structure

```
ProHelen/
├── app/           # Next.js routes & API
├── components/    # Reusable UI components  
├── lib/          # Utilities & configs
├── store/        # State management
├── types/        # TypeScript definitions
└── prisma/       # Database schema
```

---

## 🤝 Contributing

Contributions welcome! Check our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">
  <sub>Built with ❤️ by the ProHelen team</sub>
</div>