// Shared painted ground materials for every personal map; authored terrain controls collision.
const cells={grass:[0,0],water:[1,0],stone:[2,0],dirt:[0,1],wood:[1,1],meadow:[2,1]};
export function terrainPatterns(prefix){return Object.entries(cells).map(([name,[x,y]])=>`<pattern id="${prefix}-${name}" width="192" height="192" patternUnits="userSpaceOnUse"><svg width="192" height="192" viewBox="${x*512} ${y*512} 512 512" preserveAspectRatio="none"><image href="assets/terrain-environment.webp" width="1536" height="1024"/></svg></pattern>`).join('')}
export const terrainFill=(prefix,name)=>`url(#${prefix}-${name})`;
