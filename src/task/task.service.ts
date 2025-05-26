import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as mockTasks from '../assets/mock/task.json';
import { ITask } from './interfaces/task.interface';

@Injectable()
export class TaskService {
  data: ITask[] = mockTasks as ITask[];

  create(createTaskDto: CreateTaskDto) {
    const newTask: ITask = {
      id: Date.now().toString(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      isCompleted: false,
      isPriority: createTaskDto.isPriority,
      createdDate: new Date().toISOString().split('T')[0],
      deadlineDate: createTaskDto.deadlineDate,
    };
    this.data.push(newTask);
    return this.data;
  }

  findAll(): ITask[] {
    return this.data;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): ITask[] {
    const taskIndex = this.data.findIndex((task) => task.id === id.toString());
    if (taskIndex > -1) {
      const updatedTask = {
        ...this.data[taskIndex],
        ...updateTaskDto,
        updatedDate: new Date().toISOString().split('T')[0],
      };
      this.data[taskIndex] = updatedTask;
    }

    return this.data;
  }

  remove(id: number) {
    const taskIndex = this.data.findIndex((task) => task.id === id.toString());
    if (taskIndex > -1) {
      this.data.splice(taskIndex, 1);
    }
    return this.data;
  }
}
