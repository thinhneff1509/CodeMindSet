import { Controller, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './usersService';
import { JwtAuthGuard } from '../auth/jwt/jwtGuard';

@Controller('users')
export class UsersController {
    constructor(private users: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    updateMe(@Req() req, @Body() dto: { email?: string; nickname?: string }) {
        return this.users.update(req.user.sub, dto);
    }
}
