import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'SECRET_KEY_CHANGE_ME',
            passReqToCallback: true,
        });
    }
    async validate(payload: { sub: number; username: string }) {
        // payload sẽ gán vào req của user
        return payload;
    }
}
