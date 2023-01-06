import {userDTO} from "./userDTO";
import {taskDTO} from "./taskDTO";
import {shareDTO} from "./shareDTO";

export interface planningDTO {
  idPlanning: number;
  usersDTO: userDTO;
  namePlanning: string;
  dateCreated: Date;
  readOnly: boolean;
  taskList: taskDTO[];
  shareList: shareDTO[];
}
