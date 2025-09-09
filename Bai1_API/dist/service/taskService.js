"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const taskRepository_1 = require("../repository/taskRepository");
const taskMapper_1 = require("../model/mapper/taskMapper");
let TasksService = class TasksService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        const entity = await this.repo.createAndSave(taskMapper_1.TaskMapper.fromCreateDto(dto));
        return taskMapper_1.TaskMapper.toDto(entity);
    }
    async findAll() {
        const list = await this.repo.findAll();
        return list.map(taskMapper_1.TaskMapper.toDto);
    }
    async findById(id) {
        const entity = await this.repo.findById(id);
        if (!entity)
            throw new common_1.NotFoundException();
        return taskMapper_1.TaskMapper.toDto(entity);
    }
    async update(id, dto) {
        const entity = await this.repo.findById(id);
        if (!entity)
            throw new common_1.NotFoundException();
        taskMapper_1.TaskMapper.applyUpdate(entity, dto);
        const saved = await this.repo.save(entity);
        return taskMapper_1.TaskMapper.toDto(saved);
    }
    async remove(id) {
        const entity = await this.repo.findById(id);
        if (!entity)
            throw new common_1.NotFoundException();
        await this.repo.remove(entity);
        return { deleted: true };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [taskRepository_1.TaskRepository])
], TasksService);
//# sourceMappingURL=taskService.js.map