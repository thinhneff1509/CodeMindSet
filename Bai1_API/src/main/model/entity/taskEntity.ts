import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './type/taskType';

@Entity({ name: 'tasks' })
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 120 })
    title!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'text', default: TaskStatus.ToDo })
    status!: TaskStatus;

    @CreateDateColumn()
    createdAt!: Date;
}
