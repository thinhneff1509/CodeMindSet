import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TASK_STATUS_VALUES } from '../entity/type/taskType';

export class TaskDto {
    @ApiProperty() id!: string;
    @ApiProperty() title!: string;
    @ApiProperty({ required: false }) description?: string;
    @ApiProperty({ enum: TASK_STATUS_VALUES }) status!: TaskStatus;
    @ApiProperty() createdAt!: Date;
}
