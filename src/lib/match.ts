export const matchPercent = (userSkills: string[], listingTags: string[]) =>
  Math.round((listingTags.filter((t) => userSkills.includes(t.toLowerCase())).length / (listingTags.length || 1)) * 100);