import { writable } from 'svelte/store';

// Check if user has a theme preference in localStorage, otherwise use system preference
function getInitialTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Create a writable store with the initial theme
export const theme = writable<'dark' | 'light'>(getInitialTheme());

// Update document class and localStorage when theme changes
theme.subscribe(value => {
  if (typeof window !== 'undefined') {
    if (value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', value);
  }
});

// Function to toggle the theme
export function toggleTheme(): void {
  theme.update(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
}