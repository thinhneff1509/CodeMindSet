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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const taskEntity_1 = require("../model/entity/taskEntity");
let TaskRepository = class TaskRepository {
    constructor(repo) {
        this.repo = repo;
    }
    createAndSave(partial) {
        const entity = this.repo.create(partial);
        return this.repo.save(entity);
    }
    findAll() { return this.repo.find(); }
    findById(id) { return this.repo.findOne({ where: { id } }); }
    save(task) { return this.repo.save(task); }
    remove(task) { return this.repo.remove(task); }
};
exports.TaskRepository = TaskRepository;
exports.TaskRepository = TaskRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(taskEntity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaskRepository);
//# sourceMappingURL=taskRepository.js.map