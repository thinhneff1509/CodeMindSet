import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './createTaskDto';
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
