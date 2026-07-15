const requiredEnvVariables = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
] as const;

export const validateEnv = (): void => {
  for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
      throw new Error(
        `Missing required environment variable: ${variable}`
      );
    }
  }
};
