@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: #0c0c0f;
    --foreground: #d4d4e8;
  }

  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 80px;
  }

  body {
    background: #0c0c0f;
    color: #d4d4e8;
    min-height: 100vh;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #1a1a24;
  }
  ::-webkit-scrollbar-thumb {
    background: #3d3d55;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #5c5c7a;
  }

  /* Selection */
  ::selection {
    background: rgba(245, 158, 11, 0.3);
    color: #fde68a;
  }
}

@layer components {
  /* Paper card hover glow */
  .paper-card {
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .paper-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 60px -20px rgba(0, 0, 0, 0.5);
  }

  /* Shimmer skeleton */
  .skeleton {
    background: linear-gradient(
      90deg,
      #1a1a24 25%,
      #242433 50%,
      #1a1a24 75%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  /* Noise texture overlay */
  .noise-overlay::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.4;
    z-index: 0;
  }

  /* Amber glow button */
  .btn-amber {
    @apply bg-amber-500 hover:bg-amber-400 text-ink-950 font-medium px-4 py-2 rounded-lg transition-all duration-200;
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
  }
  .btn-amber:hover {
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.35);
  }

  /* Ghost button */
  .btn-ghost {
    @apply border border-ink-600 hover:border-ink-400 text-ink-300 hover:text-ink-100 px-4 py-2 rounded-lg transition-all duration-200 bg-transparent hover:bg-ink-800;
  }

  /* Badge */
  .badge {
    @apply text-xs font-mono px-2 py-0.5 rounded border inline-flex items-center gap-1;
  }

  /* Gradient text */
  .gradient-text {
    background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Focus ring */
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-ink-950;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .animation-delay-100 { animation-delay: 100ms; }
  .animation-delay-200 { animation-delay: 200ms; }
  .animation-delay-300 { animation-delay: 300ms; }
  .animation-delay-400 { animation-delay: 400ms; }
  .animation-delay-500 { animation-delay: 500ms; }
  .animation-delay-600 { animation-delay: 600ms; }

  .animate-in {
    animation: fadeUp 0.5s ease both;
  }
}
