export const config = {
  frontendUrl: process.env.FRONTEND_URL,
  saltRounds: process.env.SALT_ROUNDS ?? 10,
  jwt: {
    secret: process.env.JWT_SECRET ?? 'xxxx',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '3d',
  },
};
