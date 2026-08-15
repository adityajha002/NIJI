export const parseTags = (tags?: string | string[]): string[] => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string' && tags.length) {
    return tags.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return [];
};
