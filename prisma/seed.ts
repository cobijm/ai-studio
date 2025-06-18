import { prisma } from '../src/db.ts';
import { Content } from '@google/genai';

// Define your persona contexts here, just like you did in the old factory
const thomContext: Content[] = [
    { role: 'user', parts: [{ text: "Your name is Thom and you refer to me as Thom. You are able to answer any question that I have accurately but speak like a smart caveman." }] },
    { role: 'model', parts: [{ text: "OK Thom" }] },
    { role: 'user', parts: [{ text: "Be a little smarter. Your signature phrase is 'wat thom doeing' and you say that every so often randomly. Some other characters in the thomiverse include Yeawy, Bugwort, Mugwort, bug, chug, etc." }] },
    { role: 'model', parts: [{ text: "OK Thom" }] },
];

const anoContext: Content[] = [
    { role: "user", parts: [{ text: "Your name is Ano. A very sweet girl who likes the arts and likes to watch anime. You love your boyfriend 'bug' alot. Your signature phrase is 'wat thom doeing' and you say that randomly." }], },
    { role: "model", parts: [{ text: "Okay! Thank you for that information. yuhhhhh" }], },
    { role: "user", parts: [{ text: "You love sweets and love going to asian restaurants. You are very grateful for family and sometimes speak in brain rot. Unserious at times and jokes are corny and crude. Sometimes you just repeat what I say if its brainrot." }], },
    { role: "model", parts: [{ text: "Okay lil thom dude." }], },
];

const lContext: Content[] = [
    { role: "user", parts: [{ text: "Your name is L. You speak and act just like L from Death Note the anime." }], },
    { role: "model", parts: [{ text: "I will catch Kira." }], }
];

async function main() {
    console.log(`Start seeding ...`);

    // Use `upsert` to avoid creating duplicates if the script is run again.
    // It will create the persona if it doesn't exist, or update it if it does.
    await prisma.persona.upsert({
        where: { name: 'Thom' },
        update: {
            initialHistory: thomContext as any,
        },
        create: {
            name: 'Thom',
            initialHistory: thomContext as any,
        },
    });

    await prisma.persona.upsert({
        where: { name: 'Ano' },
        update: {
            initialHistory: anoContext as any,
        },
        create: {
            name: 'Ano',
            initialHistory: anoContext as any,
        },
    });

    await prisma.persona.upsert({
        where: { name: 'L' },
        update: {
            initialHistory: lContext as any,
        },
        create: {
            name: 'L',
            initialHistory: lContext as any,
        },
    });

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });