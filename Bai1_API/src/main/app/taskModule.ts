// src/task/tasks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../model/entity/taskEntity';
import { TasksController } from '../controller/taskController';
import { TasksService } from '../service/taskService';
import { TaskRepository } from '../repository/taskRepository';

@Module({
    // working Entity Task
    imports: [TypeOrmModule.forFeature([Task])],

    // Controller quản lý request/response
    controllers: [TasksController],

    // Class inject vào service, repository
    providers: [TasksService, TaskRepository],

    exports: [TasksService],
})
export class TasksModule {}
