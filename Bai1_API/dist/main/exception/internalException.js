"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseException = void 0;
const common_1 = require("@nestjs/common");
class DatabaseException extends common_1.InternalServerErrorException {
    constructor(msg = 'Database error occurred') {
        super(msg);
    }
}
exports.DatabaseException = DatabaseException;
//# sourceMappingURL=internalException.js.map