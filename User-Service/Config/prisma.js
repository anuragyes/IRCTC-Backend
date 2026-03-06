const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const  {config} = require("./index"); // make sure path is correct

const globalForPrisma = global;

if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg({
    connectionString:config.DATABASE_URL
  });

    console.log("database" , config.DATABASE_URL)

  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log:
      config.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

exports.prisma = globalForPrisma.prisma;
