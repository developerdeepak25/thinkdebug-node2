// express.d.ts
declare module 'express-serve-static-core' {
    interface Request {
        user?: any; // User object from auth middleware
    }
  }