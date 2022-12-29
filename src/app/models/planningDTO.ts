import {userDTO} from "./userDTO";
import {taskDTO} from "./taskDTO";
import {shareDTO} from "./shareDTO";

export interface planningDTO {
  idPlanning:number;
  usersDTO:userDTO;
  namePlanning:string;
  dateCreated:Date;
  isReadOnly:boolean;
  taskList: taskDTO[];
  shareList: shareDTO[];
}
