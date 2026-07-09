/** Inline script — prevents theme flash before hydration */
export default function ThemeInitScript() {
  const script = `(function(){try{var t=localStorage.getItem('jff-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
