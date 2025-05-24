import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.get('/invite', (_req: Request, res: Response) => {
    res.redirect('https://discord.com/oauth2/authorize?client_id=1241739031252045935&permissions=268446736&integration_type=0&scope=bot+applications.commands');
});

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});