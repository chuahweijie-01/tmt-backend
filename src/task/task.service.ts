import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BaseTaskDocument, Task } from './schemas/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<BaseTaskDocument>,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<BaseTaskDocument> {
    const taskData = {
      ...createTaskDto,
      isCompleted: false,
      userId,
    };
    const createdTask = new this.taskModel(taskData);
    return createdTask.save();
  }

  async updateTaskStatus(
    taskId: string,
    isCompleted: boolean,
  ): Promise<BaseTaskDocument | null> {
    return this.taskModel
      .findByIdAndUpdate(
        taskId,
        { $set: { isCompleted } },
        { new: true, lean: true },
      )
      .exec();
  }

  async findOne(
    taskId: string,
    userId: string,
  ): Promise<BaseTaskDocument | null> {
    return this.taskModel.findOne({ _id: taskId, userId }).lean().exec();
  }

  async findAll(userId: string): Promise<BaseTaskDocument[]> {
    return this.taskModel.find({ userId }).lean().exec();
  }

  async update(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<BaseTaskDocument | null> {
    return this.taskModel
      .findOneAndUpdate(
        { _id: taskId },
        { $set: updateTaskDto },
        { new: true, lean: true },
      )
      .exec();
  }

  async remove(taskId: string): Promise<BaseTaskDocument | null> {
    return this.taskModel.findByIdAndDelete(taskId).lean().exec();
  }
}
