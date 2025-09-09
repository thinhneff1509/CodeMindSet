import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TasksService } from '../service/taskService';
import { CreateTaskDto } from '../model/dto/createTaskDto';
import { UpdateTaskDto } from '../model/dto/updateTaskDto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly svc: TasksService) {}

    @Post() create(@Body() dto: CreateTaskDto) { return this.svc.create(dto); }
    @Get() findAll() { return this.svc.findAll(); }
    @Get(':id') findById(@Param('id') id: string) { return this.svc.findById(id); }
    @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateTaskDto) { return this.svc.update(id, dto); }
    @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
