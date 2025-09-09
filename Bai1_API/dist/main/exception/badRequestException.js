"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTaskStatusException = void 0;
const common_1 = require("@nestjs/common");
class InvalidTaskStatusException extends common_1.BadRequestException {
    constructor(status) {
        super(`Invalid task status: ${status}`);
    }
}
exports.InvalidTaskStatusException = InvalidTaskStatusException;
//# sourceMappingURL=badRequestException.js.map