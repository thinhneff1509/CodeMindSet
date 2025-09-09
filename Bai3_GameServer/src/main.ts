import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

    const ROOT = process.cwd();
    const WEB_DIR = join(ROOT, 'client', 'web');
    const CSS_DIR = join(ROOT, 'client', 'css');

    // serve static
    app.use('/css', express.static(CSS_DIR));
    app.use(express.static(WEB_DIR));

    // fallback cho "/": mở menu chọn game
    const server = app.getHttpAdapter().getInstance();
    server.get('/', (_req, res) => res.sendFile(join(WEB_DIR, 'index.html')));

    // (tuỳ chọn)
    server.get('/line98.html', (_req, res) => res.sendFile(join(WEB_DIR, 'line98', 'line98.html')));
    server.get('/caro.html',   (_req, res) => res.sendFile(join(WEB_DIR, 'caro',   'caro.html')));

    await app.listen(3000);
    console.log('🚀 http://localhost:3000');
}
bootstrap();
