"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const createTaskDto_1 = require("./createTaskDto");
class UpdateTaskDto extends (0, swagger_1.PartialType)(createTaskDto_1.CreateTaskDto) {
}
exports.UpdateTaskDto = UpdateTaskDto;
//# sourceMappingURL=updateTaskDto.js.map