export class CreateTaskDto {
  readonly title: string;
  readonly description: string;
  readonly deadlineDate: string;
  readonly isPriority: boolean;
}
