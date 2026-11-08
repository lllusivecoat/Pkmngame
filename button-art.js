// Lightweight inline interface icons. Decorative only: action names remain text.
const paths={
 home:'M3 11 12 4l9 7v10H3Z M9 21v-7h6v7 M8 8h8',
 explore:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M16 8l-3 5-5 3 3-5Z',
 creatures:'M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0 M2 12h6m8 0h6 M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0',
 pokedex:'M5 2h12l3 3v17H4V3Z M7 5h3v3H7Z M7 11h10v6H7Z M8 20h2m4 0h2',
 bag:'M6 8h12l2 13H4Z M8 8V6a4 4 0 0 1 8 0v2 M8 13h8v5H8Z',
 market:'M4 7h16l-1 15H5Z M8 7V5a4 4 0 0 1 8 0v2 M9 14a3 3 0 1 0 6 0 3 3 0 0 0-6 0 M6 14h3m6 0h3',
 guild:'M12 2 3 6v7q0 6 9 9 9-3 9-9V6Z M8 13h8 M12 9v8',
 arena:'M3 2l8 7-2 3-7-8Z M21 2l-8 7 2 3 7-8Z M8 11l12 11 M16 11 4 22 M5 13l6-6 M13 7l6 6',
 profile:'M5 9V7a7 7 0 0 1 14 0v2 M4 9h17 M7 10v4a5 5 0 0 0 10 0v-4 M3 22q0-6 9-6t9 6 M10 3h4',
 settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M9 2h6l1 4 4 1 2 5-3 3 1 4-5 3-3-2-4 1-4-4 1-4-3-3 3-4 4 1Z',
 swap:'M3 7h17l-4-4 M20 7l-4 4 M21 17H4l4 4 M4 17l4-4',
 potion:'M8 2h8v4H8Z M9 6v5l-5 5v5h16v-5l-5-5V6 M8 16h8 M12 13v6',
 flee:'M4 4h10v17H4 M12 12h10l-4-4 M22 12l-4 4',
 star:'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',
 guard:'M12 2 3 6v7q1 6 9 9 8-3 9-9V6Z M8 12l3 3 5-6',
 grass:'M5 19Q0 3 21 3q0 20-16 16 M4 21 17 8',
 fire:'M13 2q3 8 7 10 4 9-8 10Q-1 20 5 10l3 5q4-4 5-13Z M12 14q-5 6 0 7 5-2 0-7Z',
 water:'M12 2Q9 8 5 12q-5 10 7 10t7-10Z M7 15q-1 4 4 4',
 electric:'M13 2 4 14h7l-1 8 10-13h-8Z',
 flying:'M3 18Q5 4 22 3q-1 9-10 15H3Z M3 22 18 7 M8 17h7 M11 12h7',
 bug:'M7 8h10v9q-5 8-10 0Z M9 8V5l-3-3 M15 8V5l3-3 M12 9v12 M3 10l4 2 M21 10l-4 2 M3 18l4-2 M21 18l-4-2',
 rock:'M2 17 6 6l11-3 5 13-8 6Z M6 6l8 6 3-9 M14 12v10 M2 17l12-5 8 4',
 ghost:'M4 21V10a8 8 0 0 1 16 0v11l-4-3-4 3-4-3Z M8 10v3 M16 10v3',
 dragon:'M4 20Q2 8 16 2l-2 5 7 1-4 5 3 7-7-3-4 5Z M12 11l3-1',
 ground:'M2 21 10 3l5 10 3-5 5 13Z M7 10l3 2 2-2 M3 21h20'
};
export function buttonIcon(name){const key=String(name).toLowerCase();const d=paths[key]||paths.star;return `<svg class="trainer-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`}
export function regionElement(name){return {Greenwood:'Grass','Thunder Ridge':'Electric',Ashlands:'Fire',Frostfall:'Frost'}[name]||'Normal'}
