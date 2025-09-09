import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../model/entity/taskEntity';
import { TasksModule } from './taskModule';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'tasks.db',
            entities: [Task],
            synchronize: true,         // only DEV
            logging: false,
        }),
        TasksModule,
    ],
})
export class AppModule {}
