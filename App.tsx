@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Noto+Sans+KR:wght@100;300;400;700;900&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', 'Noto Sans KR', 'Helvetica Neue', 'Arial', ui-sans-serif, system-ui, sans-serif;
  --color-sand-beige: #f5f2ed;
  --color-butter-yellow: #fef9c3;
  --color-amber-glow: #fbbf24;
  --color-ink: #1c1917;
  --letter-spacing-tight-custom: -0.02em;
}

@layer base {
  body {
    @apply bg-sand-beige text-ink antialiased overflow-x-hidden selection:bg-amber-glow/30;
    font-family: var(--font-sans);
    letter-spacing: var(--letter-spacing-tight-custom);
  }
}

@keyframes mesh-gradient {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(5%, 10%) scale(1.1); }
  66% { transform: translate(-5%, 5%) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.mesh-container {
  @apply fixed inset-0 -z-50 overflow-hidden pointer-events-none;
  background: var(--color-sand-beige);
}

.mesh-blob {
  @apply absolute rounded-full blur-[120px] opacity-40 mix-blend-multiply transition-all duration-[10s] ease-in-out;
  animation: mesh-gradient 20s infinite alternate;
}

.mesh-blob-1 {
  @apply w-[600px] h-[600px] bg-butter-yellow -top-[10%] -left-[10%];
  animation-delay: 0s;
}

.mesh-blob-2 {
  @apply w-[500px] h-[500px] bg-amber-glow/20 -bottom-[10%] -right-[10%];
  animation-delay: -5s;
}

.mesh-blob-3 {
  @apply w-[400px] h-[400px] bg-stone-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
  animation-delay: -10s;
}

.parallax-container {
  @apply relative w-full h-full;
}

.floating-text {
  @apply transition-transform duration-700 ease-out;
}

.mask-transition {
  clip-path: circle(0% at var(--mx) var(--my));
}

.mask-transition-active {
  clip-path: circle(150% at var(--mx) var(--my));
  transition: clip-path 1.2s cubic-bezier(0.77, 0, 0.175, 1);
}

@layer utilities {
  .tracking-tight-custom {
    letter-spacing: -0.05em;
  }
  
  .light-burst {
    background: radial-gradient(circle, rgba(238, 242, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
  }
}
