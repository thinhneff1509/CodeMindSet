"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksModule = void 0;
// src/task/tasks.module.ts
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const taskEntity_1 = require("../model/entity/taskEntity");
const taskController_1 = require("../controller/taskController");
const taskService_1 = require("../service/taskService");
const taskRepository_1 = require("../repository/taskRepository");
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = __decorate([
    (0, common_1.Module)({
        // Nói với NestJS là module này sẽ làm việc với Entity Task
        imports: [typeorm_1.TypeOrmModule.forFeature([taskEntity_1.Task])],
        // Controller quản lý request/response (HTTP API)
        controllers: [taskController_1.TasksController],
        // Các class sẽ được inject vào (service, repository,…)
        providers: [taskService_1.TasksService, taskRepository_1.TaskRepository],
        // Nếu module khác muốn dùng service này thì export ra
        exports: [taskService_1.TasksService],
    })
], TasksModule);
//# sourceMappingURL=taskModule.js.map