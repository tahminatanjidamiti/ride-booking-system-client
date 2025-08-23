export type { ISendOtp, IVerifyOtp, ILogin } from "./auth.type";


export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}


type ZodIssue = {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
};

type ErrorSource = {
  path: string;
  message: string;
};

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSources?: ErrorSource[];
  err?: {
    issues: ZodIssue[];
    name: string;
  };
  stack?: string;
}