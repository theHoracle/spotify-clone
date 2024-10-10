export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  secret: process.env.JWT_SECRET,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASSWORD,
  dbPort: parseInt(process.env.DB_PORT) || 5432,
});
