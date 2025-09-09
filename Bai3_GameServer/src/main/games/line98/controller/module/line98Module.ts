import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Line98Entity } from '../../entity/line98Entity';
import { Line98Service } from '../../service/line98Service';
import { Line98Controller } from '../line98Controller';

@Module({
    imports: [TypeOrmModule.forFeature([Line98Entity])],
    providers: [Line98Service],
    controllers: [Line98Controller],
})
export class Line98Module {}
