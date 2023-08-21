export const createSlug = (title) => {
  // Remove special characters, except for hyphens and spaces
  const sanitizedTitle = title
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase();

  // Replace spaces with hyphens
  const slug = sanitizedTitle.replace(/\s+/g, "-");

  return slug;
};
