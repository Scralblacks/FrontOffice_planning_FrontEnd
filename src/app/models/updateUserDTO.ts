export interface UpdateUserDTO {
  idUser: number;
  username: string;
  password?: string;
  email: string,
  city: string;
  postalCode: string;
}
