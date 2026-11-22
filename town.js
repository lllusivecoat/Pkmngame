// Retain retired town-project save data for compatibility; construction is no longer a game system.
export function normalizeTown(raw){return {version:1,projects:raw?.projects&&typeof raw.projects==='object'?Object.fromEntries(Object.entries(raw.projects).filter(([id,n])=>typeof id==='string'&&Number.isInteger(n)).map(([id,n])=>[id,Math.max(0,Math.min(3,n))])):{}}}
