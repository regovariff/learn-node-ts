// // SEEDING EXAMPLE
// // Run by ts-node prisma/seed.ts


// import { prisma } from "../src/lib/prisma";

// async function main() {
//     await prisma.user.create({
//         data: {
//             username: 'admin',
//             password: 'hashed-password',
//         },
//     });
// }

// main()
//     .then(() => console.log('Seeded!'))
//     .catch(console.error)
//     .finally(() => prisma.$disconnect());
