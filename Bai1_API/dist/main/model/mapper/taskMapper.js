"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMapper = void 0;
class TaskMapper {
    static toDto(entity) {
        return {
            id: entity.id,
            title: entity.title,
            description: entity.description,
            status: entity.status,
            createdAt: entity.createdAt,
        };
    }
    static fromCreateDto(dto) {
        return {
            title: dto.title,
            description: dto.description,
            status: dto.status ?? 'To Do',
        };
    }
    static applyUpdate(entity, dto) {
        if (dto.title !== undefined)
            entity.title = dto.title;
        if (dto.description !== undefined)
            entity.description = dto.description;
        if (dto.status !== undefined)
            entity.status = dto.status;
        return entity;
    }
}
exports.TaskMapper = TaskMapper;
//# sourceMappingURL=taskMapper.js.map