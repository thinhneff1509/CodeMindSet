import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { performance } from 'perf_hooks';

import { TasksModule } from '../src/main/app/taskModule';
import { Task } from '../src/main/model/entity/taskEntity';

describe('Performance: GET /api/tasks (100 records) < 200ms', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    dropSchema: true,
                    entities: [Task],
                    synchronize: true,
                    logging: false,
                }),
                TasksModule,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();

        // seed 100 bản ghi
        const ds = app.get(DataSource);
        const repo = ds.getRepository(Task);
        const bulk: Partial<Task>[] = Array.from({ length: 100 }, (_, i) => ({
            title: `Task ${i + 1}`,
            description: `Seed data ${i + 1}`,
            status: 'To Do' as any,
        }));
        await repo.insert(bulk);
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /api/tasks under 200ms', async () => {
        const server = app.getHttpServer();
        const t0 = performance.now();
        const res = await request(server).get('/api/tasks').expect(200);
        const t1 = performance.now();

        const duration = t1 - t0;
        console.log(`GET /api/tasks took ${duration.toFixed(2)} ms, items=${res.body?.length}`);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(100);
        expect(duration).toBeLessThan(200);
    });
});
