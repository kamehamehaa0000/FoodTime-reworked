class ApiResponse {
  statusCode: number
  data: any
  message: string
  success: boolean
  constructor(statusCode: number, data: any, message = 'Success') {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < 400
  }
}
export default ApiResponse
/*
class ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: T, message: string = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
 */
