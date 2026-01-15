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

  public async findAll(role: string): Promise<IApiResponse<IUser[]>> {
    const response = await apiClient.get(`/users/role/${role}`);
    return response.data;
  }

  public async findAllSoftRemoved(role: string): Promise<IApiResponse<IUser[]>> {
    const response = await apiClient.get(`/users/all-soft-remove/${role}`);
    return response.data;
  }

  public async findOne(id: string): Promise<IApiResponse<IUser>> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  public async findOneSoftRemoved(id: string): Promise<IApiResponse<IUser>> {
    const response = await apiClient.get(`/users/soft-remove/${id}`);
    return response.data;
  }

  public async findOneWithCredentials(id: string): Promise<IApiResponse<IUser>> {
    const response = await apiClient.get(`/users/credential/${id}`);
    return response.data;
  }

  public async update(id: string, data: Partial<IUser>): Promise<IApiResponse<IUser>> {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  }

  public async remove(id: string): Promise<IApiResponse<IUser>> {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }

  public async softRemove(id: string): Promise<IApiResponse<IUser>> {
    const response = await apiClient.delete(`/users/soft-remove/${id}`);
    return response.data;
  }

  public async restore(id: string): Promise<IApiResponse<IUser>> {
    const response = await apiClient.patch(`/users/restore/${id}`);
    return response.data;
  }

  public async checkEmailAvailability(email: string): Promise<IApiResponse<boolean>> {
    const response = await apiClient.get(`/users/check/email/${email}`);
    return response.data;
  }

  public async checkIcAvailability(id: string): Promise<IApiResponse<boolean>> {
    const response = await apiClient.get(`/users/check/ic/${id}`);
    return response.data;
  }

  public async checkUsernameAvailability(username: string): Promise<IApiResponse<boolean>> {
    const response = await apiClient.get(`/users/check/username/${username}`);
    return response.data;
  }
}

export const UsersService = UsersModuleService.getInstance();
