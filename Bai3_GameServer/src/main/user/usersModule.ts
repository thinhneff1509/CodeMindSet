import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './userEntity';
import { UsersService } from './usersService';
import { UsersController } from './userController';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService], // AuthService using
})
export class UsersModule {}
