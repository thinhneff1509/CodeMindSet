import { BadRequestException } from '@nestjs/common';

export class InvalidTaskStatusException extends BadRequestException {
    constructor(status: string) {
        super(`Invalid task status: ${status}`);
    }
}
