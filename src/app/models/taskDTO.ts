import {eventDTO} from "./eventDTO";

export interface taskDTO {
  idTask?: number;
  idPlanning: number;
  nameTask: string;
  description?: string;
  dateCreated?: Date;
  dateTaskStart: Date;
  dateTaskEnd: Date;
  eventList?: eventDTO[];
}
