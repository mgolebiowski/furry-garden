/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType<any>;
  export default component;
}

declare module '*.csv?raw' {
  const content: string;
  export default content;
}

declare module '*/locales/*.json' {
  const content: Record<string, any>;
  export default content;
}
