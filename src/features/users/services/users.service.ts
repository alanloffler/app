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

  public async findAll(): Promise<IApiResponse<IUser[]>> {
    const response = await apiClient.get("/users");
    return response.data;
  }

  // TODO: Implement real endpoint to include those users soft removed
  public async findAllSoftRemoved(): Promise<IApiResponse<IUser[]>> {
    const response = await apiClient.get("/users");
    return response.data;
  }

  public async findOne(id: string): Promise<IApiResponse<IUser>> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  // TODO: Implement real endpoint for soft removed
  public async findOneSoftRemoved(id: string): Promise<IApiResponse<IUser>> {
    // const response = await apiClient.get(`/users/${id}/soft-removed`);
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }
}

export const UsersService = UsersModuleService.getInstance();
