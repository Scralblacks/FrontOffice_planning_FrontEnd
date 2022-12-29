import {AddressDTO} from "./addressDTO";
import {roleDTO} from "./roleDTO";

export interface userDTO {
  idUser?: number;
  planningId?: number;
  username: string;
  email: string;
  password: string;
  photo?: string;
  addressDTO?: AddressDTO;
  roleDTOList: roleDTO[];
  sharedPlanningId?: number[];
}
