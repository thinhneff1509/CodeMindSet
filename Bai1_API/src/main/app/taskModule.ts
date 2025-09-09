// src/task/tasks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../model/entity/taskEntity';
import { TasksController } from '../controller/taskController';
import { TasksService } from '../service/taskService';
import { TaskRepository } from '../repository/taskRepository';

@Module({
    // Nói với NestJS là module này sẽ làm việc với Entity Task
    imports: [TypeOrmModule.forFeature([Task])],

    // Controller quản lý request/response (HTTP API)
    controllers: [TasksController],

    // Các class sẽ được inject vào (service, repository,…)
    providers: [TasksService, TaskRepository],

    // Nếu module khác muốn dùng service này thì export ra
    exports: [TasksService],
})
export class TasksModule {}
