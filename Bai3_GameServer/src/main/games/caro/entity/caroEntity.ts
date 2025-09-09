import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('caro_games')
export class CaroGameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    roomId: string;

    @Column({ nullable: true })
    playerX?: string;

    @Column({ nullable: true })
    playerO?: string;

    @Column({ nullable: true })
    winner?: 'X' | 'O';

    // lưu danh sách nước đi [{r,c,v,timestamp}]
    @Column({ type: 'text', nullable: true })
    movesJson?: string;

    @CreateDateColumn()
    createdAt: Date;
}
