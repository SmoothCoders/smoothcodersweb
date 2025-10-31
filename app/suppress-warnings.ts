// Suppress non-critical preload warnings in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const warning = args[0];
    if (
      typeof warning === 'string' &&
      (warning.includes('preloaded using link preload') ||
       warning.includes('was preloaded'))
    ) {
      return; // Suppress preload warnings
    }
    originalWarn.apply(console, args);
  };
}

export {};
