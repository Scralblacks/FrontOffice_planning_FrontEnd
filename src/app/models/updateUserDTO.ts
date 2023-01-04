export interface UpdateUserDTO {
  idUser: number;
  username: string;
  password?: string;
  email: string,
  photo?: string;
  city: string;
  postalCode: string;
}
