"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class TaskNotFoundException extends common_1.NotFoundException {
    constructor(id) {
        super(`Task with ID "${id}" not found`);
    }
}
exports.TaskNotFoundException = TaskNotFoundException;
//# sourceMappingURL=notFoundException.js.map