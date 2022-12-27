import {Address} from "./address";

export interface User {

  id?: number;

  userName?: string;

  email: string;

  password: string;

  photo?: string;

  address: Address;
}
