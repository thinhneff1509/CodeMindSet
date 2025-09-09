import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './main/auth/authModule';
import { UsersModule } from './main/user/usersModule';
import { Line98Module } from './main/games/line98/controller/module/line98Module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            autoLoadEntities: true,
            synchronize: true,
        }),
        UsersModule,
        AuthModule,
        Line98Module,

    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
