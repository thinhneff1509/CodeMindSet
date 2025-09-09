import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Line98Entity {
    @PrimaryGeneratedColumn()
    id: number;

    // 9x9: lưu mảng 2D (serialize thành TEXT)
    @Column({ type: 'simple-json' })
    board: number[][];

    @Column({ type: 'integer', default: 0 })
    score: number;

    // 3 màu tiếp theo (serialize thành TEXT)
    @Column({ type: 'simple-json' })
    nextColors: number[];

    @Column({ type: 'integer', nullable: true })
    userId: number | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
