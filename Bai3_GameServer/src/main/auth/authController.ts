import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './authService';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Post('register')
    register(@Body() body: { username: string; password: string }) {
        return this.auth.register(body.username, body.password);
    }

    @Post('login')
    login(@Body() body: { username: string; password: string }) {
        return this.auth.login(body.username, body.password);
    }
}
