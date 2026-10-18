import './build.js';
import { createServices } from '../server/auth.js';
import { appServer } from '../server/http.js';
const services = createServices();
const app = appServer(); app.configure(services);
const port = Number(new URL(services.origin).port || 3000);
app.server.listen(port, '127.0.0.1', () => console.log(`Matematik: ${services.origin}`));
