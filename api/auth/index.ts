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
    locale,
  }: {
    deviceId: string;
    platform: string;
    appVersion: string;
    locale: string;
  }) {
    return api.post("/auth/anonymous/init", {
      deviceId,
      platform,
      appVersion,
      locale,
    });
  }
}

export default new AuthService();
