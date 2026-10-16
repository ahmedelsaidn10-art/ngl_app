import { AppError } from "../../common/error/error.js";

  export const  USER_ALREADY_EXISTS= new AppError('User already exists', 409)
  export const  USER_NOT_EXISTS= new AppError('User Not Exists', 404)

