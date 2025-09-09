import { Response } from "express";

export class ApiResponse {
  static success(
    res: Response,
    data: any,
    message = "Success",
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    message = "Error",
    statusCode = 500,
    errors?: any
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  static paginated(
    res: Response,
    data: any[],
    totalItems: number,
    page: number,
    limit: number,
    message = "Success"
  ) {
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
