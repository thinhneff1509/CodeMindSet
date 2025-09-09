import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './userEntity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {}

    findByUsername(username: string) {
        return this.repo.findOne({ where: { username } });
    }

    findById(id: number) {
        return this.repo.findOne({ where: { id } });
    }

    async create(username: string, passwordHash: string) {
        const u = this.repo.create({ username, password: passwordHash });
        return this.repo.save(u);
    }

    async update(id: number, dto: { email?: string; nickname?: string }) {
        await this.repo.update(id, dto);
        return this.findById(id);
    }
}
