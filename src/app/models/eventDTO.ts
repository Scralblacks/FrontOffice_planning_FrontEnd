import {actionDTO} from "./actionDTO";

export interface eventDTO {
  idEvent?: number;
  idPlanning: number;
  username: string;
  planningName: string;
  dateCreated: Date;
  actionDTO: actionDTO;
}
