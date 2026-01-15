import type { IAdmin } from "@admin/interfaces/admin.interface";
import type { IApiResponse } from "@core/interfaces/api-response.interface";
import { apiClient } from "@core/client/client";

class AccountModuleService {
  private static instance: AccountModuleService;

  public static getInstance(): AccountModuleService {
    if (!AccountModuleService.instance) {
      AccountModuleService.instance = new AccountModuleService();
    }

    return AccountModuleService.instance;
  }

  public async get(userRole?: string): Promise<IApiResponse<IAdmin>> {
    let path: string = "/users/profile";

    if (userRole === "superadmin") {
      path = "/admin/profile";
    }

    const response = await apiClient.get(path);
    return response.data;
  }

  public async update(data: Partial<IAdmin>): Promise<IApiResponse<IAdmin>> {
    console.log(data);

    // const response = await apiClient.patch("/admin/profile", data);
    // return response.data;
  }
}

export const AccountService = AccountModuleService.getInstance();
