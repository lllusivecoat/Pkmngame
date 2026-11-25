// One source for career milestones and Rook's progressively revealed destinations.
export const reputationTiers=[
 {reputation:0,name:'Local Gym',map:'bramble'},
 {reputation:20,name:'Rising Gym',map:'tideglass'},
 {reputation:60,name:'Recognised Gym',map:'emberhollow'},
 {reputation:100,name:'Trusted Gym',map:'moonfen'},
 {reputation:180,name:'Established Gym',map:'frostwatch'},
 {reputation:300,name:'Renowned Gym',map:'sunscar'},
 {reputation:500,name:'Premier Gym',map:'ironroot'},
 {reputation:900,name:'Master Gym',map:'astralcrown'}
];
export const gymReputationTier=rep=>reputationTiers.filter(t=>rep>=t.reputation).at(-1)||reputationTiers[0];
export const nextReputationTier=rep=>reputationTiers.find(t=>t.reputation>rep)||null;
