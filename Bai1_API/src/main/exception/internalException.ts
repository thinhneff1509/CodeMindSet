import { InternalServerErrorException } from '@nestjs/common';

export class DatabaseException extends InternalServerErrorException {
    constructor(msg = 'Database error occurred') {
        super(msg);
    }
}
