import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/usersService';

@Injectable()
export class AuthService {
    constructor(private users: UsersService, private jwt: JwtService) {}

    async register(username: string, password: string) {
        const existed = await this.users.findByUsername(username);
        if (existed) throw new ConflictException('Username is taken');

        const hashed = await bcrypt.hash(password, 10);
        const user = await this.users.create(username, hashed);
        return { id: user.id, username: user.username };
    }

    async login(username: string, password: string) {
        const user = await this.users.findByUsername(username);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, username: user.username };
        const access_token = await this.jwt.signAsync(payload);
        return { access_token };
    }
}
