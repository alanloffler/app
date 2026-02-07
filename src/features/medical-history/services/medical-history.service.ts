import type { IApiResponse } from "@core/interfaces/api-response.interface";
import type { IMedicalHistoryCreate } from "@medical-history/interfaces/medical-history.interface";
import { apiClient } from "@core/client/client";

class MedicalHistoryModuleService {
  private static instance: MedicalHistoryModuleService;

  public static getInstance(): MedicalHistoryModuleService {
    if (!MedicalHistoryModuleService.instance) {
      MedicalHistoryModuleService.instance = new MedicalHistoryModuleService();
    }

    return MedicalHistoryModuleService.instance;
  }

  public async create(data: IMedicalHistoryCreate): Promise<IApiResponse> {
    const response = await apiClient.post("/medical-history", data);
    return response.data;
  }
}

export const MedicalHistoryService = MedicalHistoryModuleService.getInstance();
