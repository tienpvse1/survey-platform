declare namespace Express {
  interface Request {
    user: import('kysely-codegen').User;
  }
}
