import './build.js';
import { fixture } from '../tests/account-fixture.js';
const demo = await fixture();
console.log(`Lokal demo: ${demo.origin}\nKun testkonti. Data forsvinder, når denne proces stoppes.`);
async function close() { await demo.close(); process.exit(0); }
process.once('SIGINT', close); process.once('SIGTERM', close);
