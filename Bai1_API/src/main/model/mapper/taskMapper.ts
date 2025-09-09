import { Task } from '../entity/taskEntity';
import { TaskDto } from '../dto/taskDto';
import { CreateTaskDto } from '../dto/createTaskDto';
import { UpdateTaskDto } from '../dto/updateTaskDto';

export class TaskMapper {
    static toDto(entity: Task): TaskDto {
        return {
            id: entity.id,
            title: entity.title,
            description: entity.description,
            status: entity.status,
            createdAt: entity.createdAt,
        };
    }

    static fromCreateDto(dto: CreateTaskDto): Partial<Task> {
        return {
            title: dto.title,
            description: dto.description,
            status: (dto.status as any) ?? 'To Do',
        };
    }

    static applyUpdate(entity: Task, dto: UpdateTaskDto): Task {
        if (dto.title !== undefined) entity.title = dto.title;
        if (dto.description !== undefined) entity.description = dto.description;
        if (dto.status !== undefined) entity.status = dto.status as any;
        return entity;
    }
}
