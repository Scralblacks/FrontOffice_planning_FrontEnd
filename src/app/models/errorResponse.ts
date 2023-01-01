import {HttpStatusCode} from "@angular/common/http";

export interface ErrorResponse {
  message: string;
  status: HttpStatusCode;
}
