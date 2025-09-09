import { Controller, Get, Param } from '@nestjs/common';
//không dùng tới do không lưu lịch sử trận đấu
@Controller('games/caro')
export class CaroController {
    @Get('ping')
    ping() {
        return { ok: true, game: 'caro' };
    }
}
