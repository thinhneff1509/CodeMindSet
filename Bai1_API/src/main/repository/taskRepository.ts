import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../model/entity/taskEntity';

@Injectable()
export class TaskRepository {
    constructor(@InjectRepository(Task) private readonly repo: Repository<Task>) {}

    createAndSave(partial: Partial<Task>) {
        const entity = this.repo.create(partial);
        return this.repo.save(entity);
    }
    findAll() { return this.repo.find(); }
    findById(id: string) { return this.repo.findOne({ where: { id } }); }
    save(task: Task) { return this.repo.save(task); }
    remove(task: Task) { return this.repo.remove(task); }
}
