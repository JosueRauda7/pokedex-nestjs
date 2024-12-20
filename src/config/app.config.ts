export const EnvConfiguration = () => ({
  envieronment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3000,
  defaultLimit: process.env.DEFAULT_LIMIT || 10,
  defaultOffset: process.env.DEFAULT_OFFSET || 0,
});
