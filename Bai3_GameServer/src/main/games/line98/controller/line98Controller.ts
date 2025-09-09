import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { Line98Service } from '../service/line98Service';
import { MoveDto, NewGameDto } from '../logicGame/line98Type';

@Controller('games/line98')
export class Line98Controller {
    constructor(private readonly service: Line98Service) {}

    @Post('new')
    async newGame(@Body() _dto: NewGameDto) {
        const g = await this.service.newLine98();
        return g;
    }

    @Get(':id')
    async get(@Param('id') id: string) {
        return this.service.getGame(+id);
    }

    @Post('move')
    async move(@Body() dto: MoveDto) {
        return this.service.move(dto);
    }
}
