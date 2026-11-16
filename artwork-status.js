// Explicit temporary art approved for the requested evolution-line expansion. Remove an ID when both painted palettes are bundled.
export const pendingChibiIds=new Set(["larvitar", "pupitar", "tyranitar", "shelgon", "salamence", "garchomp", "frigibax"]);
export const artworkPending=c=>pendingChibiIds.has(typeof c==='string'?c:c.form||c.species);
