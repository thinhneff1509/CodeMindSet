import { Module } from '@nestjs/common';
import { CaroGateway } from '../../gateway/caroGateway';

@Module({
    providers: [CaroGateway],
    exports: [],
})
export class CaroModule {}
