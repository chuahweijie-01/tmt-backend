import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { BaseTaskDocument } from './schemas/task.schema';
import { GetAllTaskResponse } from './types/get-all-task-response';
import { Request } from 'express';
import { AuthenticatedUser } from '@auth/types/authenticated-user';

@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<GetAllTaskResponse[]> {
    const userId = this.getUserIdFromRequest(req);
    const createdTask = await this.taskService.create(createTaskDto, userId);

    if (!createdTask) {
      throw new HttpException(
        'Task failed to create.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.getUserTasksResponse(userId);
  }

  @Get()
  async findAll(@Req() req: Request): Promise<GetAllTaskResponse[]> {
    const userId = this.getUserIdFromRequest(req);
    return this.getUserTasksResponse(userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ): Promise<GetAllTaskResponse[]> {
    const updated = await this.taskService.update(id, updateTaskDto);

    if (!updated) {
      throw new HttpException(
        'Task failed to update.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.getUserTasksResponse(this.getUserIdFromRequest(req));
  }

  @Put(':id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ): Promise<GetAllTaskResponse[]> {
    const updated = await this.taskService.updateTaskStatus(
      id,
      updateTaskDto.isCompleted,
    );

    if (!updated) {
      throw new HttpException(
        'Task status failed to update.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.getUserTasksResponse(this.getUserIdFromRequest(req));
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<GetAllTaskResponse[]> {
    const deleted = await this.taskService.remove(id);

    if (!deleted) {
      throw new HttpException(
        'Task failed to delete.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.getUserTasksResponse(this.getUserIdFromRequest(req));
  }

  private async getUserTasksResponse(
    userId: string,
  ): Promise<GetAllTaskResponse[]> {
    const tasks = await this.taskService.findAll(userId);

    if (!tasks) {
      throw new HttpException(
        'Failed to retrieve tasks.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.mapTaskDocumentToTaskResponse(tasks);
  }

  private mapTaskDocumentToTaskResponse(
    tasks: BaseTaskDocument[],
  ): GetAllTaskResponse[] {
    return tasks.map((task) => ({
      id: String(task._id),
      title: task.title,
      description: task.description,
      deadlineDate: task.deadlineDate,
      isPriority: task.isPriority,
      isCompleted: task.isCompleted,
      createdDate: task.createdAt.toISOString().split('T')[0],
    }));
  }

  private getUserIdFromRequest(req: Request): string {
    const user = req.user as AuthenticatedUser;

    if (!user || !user.userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return user.userId;
  }
}
