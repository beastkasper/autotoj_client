export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* Gradient background orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" />

      <main className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo mark */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <span className="text-2xl font-black tracking-tight text-white">
            aT
          </span>
        </div>

        {/* Title */}
        <h1 className="max-w-lg bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-5xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl">
          autoTOJ
        </h1>

        {/* Subtitle */}
        <p className="max-w-md text-lg leading-relaxed text-zinc-400">
          Современная платформа для автоматизации. Построена на{" "}
          <span className="font-medium text-zinc-200">Next.js</span>,{" "}
          <span className="font-medium text-zinc-200">TypeScript</span> и{" "}
          <span className="font-medium text-zinc-200">Redux Toolkit</span>.
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            "Next.js 16",
            "TypeScript Strict",
            "Tailwind CSS",
            "Shadcn/UI",
            "Redux Toolkit",
            "RTK Query",
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm transition-colors hover:border-indigo-500/40 hover:text-white"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-4 flex gap-4">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            Документация
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-colors hover:border-white/20 hover:text-white"
          >
            GitHub
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 text-xs text-zinc-600">
        autoTOJ &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
