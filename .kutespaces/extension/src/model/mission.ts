import { Task } from "./task";

export interface Mission {
  id: MissionID;
  tasks: Task[];
  description: string;
}

export type MissionID = number;
