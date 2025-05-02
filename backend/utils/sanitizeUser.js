export const sanitizeUser = (user) => {
  const { password, created_at, updated_at, ...sanitizedUser } = user;
  return sanitizedUser;
};
