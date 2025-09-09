import { Controller, Get, Param } from '@nestjs/common';
// Nếu có lưu lịch sử thì có thêm vào

@Controller('games/caro')
export class CaroController {
    @Get('ping')
    ping() {
        return { ok: true, game: 'caro' };
    }
}
