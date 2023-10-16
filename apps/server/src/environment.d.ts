export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // application configurations
      SERVER_PORT: string | null;
      JWT_SECRET: string;
      ACCESS_TOKEN_EXPIRATION: string | null;
      REFRESH_TOKEN_EXPIRATION: string | null;

      // database configurations
      POSTGRES_PASSWORD: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT: string;
      POSTGRES_DB: string;
    }
  }
}
