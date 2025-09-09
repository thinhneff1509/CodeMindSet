import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Line98Entity } from '../entity/line98Entity';
import { newBoard, randomColors, placeRandomBalls, canMove, applyMove, step, isGameOver } from '../logicGame/line98Logic';
import { MoveDto } from '../logicGame/line98Type';

@Injectable()
export class Line98Service {
    constructor(@InjectRepository(Line98Entity) private repo: Repository<Line98Entity>) {}

    async newLine98(userId?: number) {
        let board = newBoard();
        // bắt đầu bằng 5 bóng random
        board = placeRandomBalls(board, randomColors(5));
        const nextColors = randomColors(3);
        const game = this.repo.create({ board, nextColors, score: 0, userId: userId ?? null });
        return this.repo.save(game);
    }

    async getGame(id:number){
        const g = await this.repo.findOne({ where: { id } });
        if (!g) throw new NotFoundException('Game not found');
        return g;
    }

    async move(dto: MoveDto) {
        const g = await this.getGame(dto.gameId);
        if (!canMove(g.board, dto.from, dto.to)) {
            throw new BadRequestException('Invalid move');
        }
        applyMove(g.board, dto.from, dto.to);
        const { board, scored, nextColors } = step(g.board, g.nextColors);
        g.board = board;
        g.score += scored;
        g.nextColors = nextColors;
        await this.repo.save(g);
        return { game: g, gameOver: isGameOver(g.board) };
    }
}
