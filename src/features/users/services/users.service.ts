import type { IApiResponse } from "@core/interfaces/api-response.interface";
import type { ICreateProfessionalForm } from "@users/interfaces/create-professional.interface";
import type { IUser } from "@users/interfaces/user.interface";
import type { TUserRole } from "@roles/interfaces/user-role.type";
import { apiClient } from "@core/client/client";

class UsersModuleService {
  private static instance: UsersModuleService;

  public static getInstance(): UsersModuleService {
    if (!UsersModuleService.instance) {
      UsersModuleService.instance = new UsersModuleService();
    }

    return UsersModuleService.instance;
  }

  public async createProfessional(data: ICreateProfessionalForm): Promise<IApiResponse<IUser>> {
    const payload = {
      user: {
        ic: data.ic,
        userName: data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      },
      profile: {
        licenseId: data.licenseId,
        professionalPrefix: data.professionalPrefix,
        specialty: data.specialty,
        workingDays: data.workingDays,
        startHour: data.startHour,
        endHour: data.endHour,
        slotDuration: data.slotDuration,
        dailyExceptionStart: data.dailyExceptionStart || undefined,
        dailyExceptionEnd: data.dailyExceptionEnd || undefined,
      },
    };

    const response = await apiClient.post("/users/create-professional", payload);
    return response.data;
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

  // Common services
  public async findWithProfile(id: string, type: TUserRole): Promise<IApiResponse<IUser>> {
    const response = await apiClient.get(`/users/${id}/${type}/profile`);
    return response.data;
  }

  public async findSoftRemovedWithProfile(id: string, type: TUserRole): Promise<IApiResponse<IUser>> {
    const response = await apiClient.get(`/users/${id}/${type}/profile/soft`);
    return response.data;
  }

  // TODO: maybe remove
  public async findPatientWithHistory(id: string): Promise<IApiResponse<IUser>> {
    const response = await apiClient.get(`/users/patient-history/${id}`);
    return response.data;
  }

  public async findPatientSoftRemovedWithHistory(id: string): Promise<IApiResponse<IUser>> {
    const response = await apiClient.get(`/users/patient-soft-removed-history/${id}`);
    return response.data;
  }

  public async update(
    id: string,
    type: TUserRole,
    data: Partial<ICreateProfessionalForm>,
  ): Promise<IApiResponse<IUser>> {
    const payload = {
      user: {
        ic: data.ic,
        userName: data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      },
      profile: {
        licenseId: data.licenseId,
        professionalPrefix: data.professionalPrefix,
        specialty: data.specialty,
        workingDays: data.workingDays,
        startHour: data.startHour,
        endHour: data.endHour,
        slotDuration: data.slotDuration,
        dailyExceptionStart: data.dailyExceptionStart || undefined,
        dailyExceptionEnd: data.dailyExceptionEnd || undefined,
      },
    };

    const response = await apiClient.patch(`/users/${id}/${type}`, payload);
    return response.data;
  }

  // Common services
  public async remove(id: string, type: TUserRole): Promise<IApiResponse<void>> {
    const response = await apiClient.delete(`/users/${id}/${type}`);
    return response.data;
  }

  public async softRemove(id: string, type: TUserRole): Promise<IApiResponse<void>> {
    const response = await apiClient.delete(`/users/${id}/${type}/soft`);
    return response.data;
  }

  public async restore(id: string, type: TUserRole): Promise<IApiResponse<void>> {
    const response = await apiClient.patch(`/users/${id}/${type}/restore`);
    return response.data;
  }

  // Check services
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
