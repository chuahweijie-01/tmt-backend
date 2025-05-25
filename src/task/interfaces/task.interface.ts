export interface ITask {
  id?: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  isPriority: boolean;
  createdDate: string;
  deadlineDate: string;
}
