import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const DEFAULT_DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.MONGODB_URI ||
  'mongodb+srv://youandmevoyage_db_user:7yWNzIScQgQboWli@cluster0.4nr0hxt.mongodb.net/youandmevoyage?retryWrites=true&w=majority&appName=Cluster0';

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: DEFAULT_DATABASE_URL,
      },
    },
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
