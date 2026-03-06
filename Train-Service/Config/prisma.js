const { PrismaClient } = require('@prisma/client');
const { config } = require('./index');

const globalForPrisma = global;

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log:
      config.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}


// async function test() {
//   console.log("Seat model:", prisma.seat);
//   console.log("Booking model:", prisma.booking);
// }

// test();

exports.prisma = globalForPrisma.prisma;


