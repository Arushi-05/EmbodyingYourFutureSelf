import { PrismaClient } from '/Users/arushikapoor/Desktop/EYFSDev/src/generated/client'
import 'dotenv/config'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
import { PrismaPg } from '@prisma/adapter-pg'
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
export const prisma = new PrismaClient({ adapter })
//if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma