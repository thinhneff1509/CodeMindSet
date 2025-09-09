import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string; // bcrypt hash

    @Column({ nullable: true })
    email?: string;

    @Column({ default: 'Newbie' })
    nickname: string;
}
