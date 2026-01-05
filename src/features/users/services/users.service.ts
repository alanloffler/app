import type { IApiResponse } from "@core/interfaces/api-response.interface";
import type { IUser } from "@users/interfaces/user.interface";
import { apiClient } from "@core/client/client";

class UsersModuleService {
  private static instance: UsersModuleService;

  public static getInstance(): UsersModuleService {
    if (!UsersModuleService.instance) {
      UsersModuleService.instance = new UsersModuleService();
    }

    return UsersModuleService.instance;
  }

  public async create(data: Partial<IUser>): Promise<IApiResponse<IUser>> {
    const response = await apiClient.post("/users", data);
    return response.data;
  }
}

export const UsersService = UsersModuleService.getInstance();
