import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from '../repository/taskRepository';
import { TaskMapper } from '../model/mapper/taskMapper';
import { CreateTaskDto } from '../model/dto/createTaskDto';
import { UpdateTaskDto } from '../model/dto/updateTaskDto';

@Injectable()
export class TasksService {
    constructor(private readonly repo: TaskRepository) {}

    async create(dto: CreateTaskDto) {
        const entity = await this.repo.createAndSave(TaskMapper.fromCreateDto(dto));
        return TaskMapper.toDto(entity);
    }

    async findAll() {
        const list = await this.repo.findAll();
        return list.map(TaskMapper.toDto);
    }

    async findById(id: string) {
        const entity = await this.repo.findById(id);
        if (!entity) throw new NotFoundException();
        return TaskMapper.toDto(entity);
    }

    async update(id: string, dto: UpdateTaskDto) {
        const entity = await this.repo.findById(id);
        if (!entity) throw new NotFoundException();
        TaskMapper.applyUpdate(entity, dto);
        const saved = await this.repo.save(entity);
        return TaskMapper.toDto(saved);
    }

    async remove(id: string) {
        const entity = await this.repo.findById(id);
        if (!entity) throw new NotFoundException();
        await this.repo.remove(entity);
        return { deleted: true };
    }
}
