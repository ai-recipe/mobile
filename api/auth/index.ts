import { api } from "@/api/axios";

class AuthService {
  public loginWithEmailAPI(data: any) {
    return api.post("/auth/login", data);
  }

  public registerWithEmailAPI(data: any) {
    return api.post("/auth/register", data);
  }

  public logoutAPI() {
    return api.post("/auth/logout");
  }

  public initDeviceAPI({
    deviceId,
    platform,
    appVersion,
  }: {
    deviceId: string;
    platform: string;
    appVersion: string;
  }) {
    return api.post("/auth/anonymous/init", {
      deviceId,
      platform,
      appVersion,
    });
  }
}

export default new AuthService();
