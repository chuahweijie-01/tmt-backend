export class UpdateTaskDto {
  readonly title: string;
  readonly description: string;
  readonly deadlineDate: string;
  readonly isPriority: boolean;
  readonly isCompleted: boolean;
}
