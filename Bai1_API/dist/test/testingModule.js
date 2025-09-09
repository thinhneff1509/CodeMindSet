"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const supertest_1 = __importDefault(require("supertest"));
const perf_hooks_1 = require("perf_hooks");
// paths theo cấu trúc của bạn:
const taskModule_1 = require("../main/app/taskModule");
const taskEntity_1 = require("../main/model/entity/taskEntity");
describe('Performance: GET /api/tasks (100 records) < 200ms', () => {
    let app;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [
                // Dùng SQLite in-memory cho E2E để loại I/O file
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    dropSchema: true,
                    entities: [taskEntity_1.Task],
                    synchronize: true,
                    logging: false,
                }),
                taskModule_1.TasksModule,
            ],
        }).compile();
        app = moduleRef.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
        // Seed 100 bản ghi nhanh bằng repository
        const data = [];
        for (let i = 1; i <= 100; i++) {
            data.push({
                title: `Task ${i}`,
                description: `Seed data ${i}`,
                status: 'To Do',
            });
        }
        // dùng DataSource trực tiếp để insert bulk nhanh
        const ds = app.get('DataSource'); // TypeORM DataSource đã được đăng ký
        await ds.getRepository(taskEntity_1.Task).insert(data);
    });
    afterAll(async () => {
        await app.close();
    });
    it('should respond under 200ms with 100 items', async () => {
        const server = app.getHttpServer();
        const t0 = perf_hooks_1.performance.now();
        const res = await (0, supertest_1.default)(server).get('/api/tasks').expect(200);
        const t1 = perf_hooks_1.performance.now();
        const duration = t1 - t0;
        // có thể in ra để xem
        // eslint-disable-next-line no-console
        console.log(`GET /api/tasks took ${duration.toFixed(2)} ms, items=${res.body?.length}`);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(100);
        expect(duration).toBeLessThan(200); // yêu cầu đề bài
    });
});
//# sourceMappingURL=testingModule.js.map