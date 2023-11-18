import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
const settings = localStorage.getItem('theme') === 'dark' ?
    {
        startOnLoad: true,
        theme: 'dark',
        darkMode: true,
    }
 :
    {
        startOnLoad: true,
        theme: 'base',
        darkMode: false,
        themeVariables: {
            tertiaryColor: 'rgba(103,97,97,0.37)'
        }
    }
;
mermaid.initialize(settings);
