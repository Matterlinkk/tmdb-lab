import express from 'express';
import { getRepoInfo } from './endpoints/endpoints.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views/index.html')));

app.get('/repos', async (req, res) => {
    const username = req.query.username || 'Matterlinkk';
    try {
        const data = await getRepoInfo(username);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
