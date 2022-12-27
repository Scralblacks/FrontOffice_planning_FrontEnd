import {AddressDTO} from "./addressDTO";

export interface UserDTO {
  idUser?: number;
  username: string;
  email: string;
  password: string;
  photo?: string;
  addressDTO: AddressDTO;
}
