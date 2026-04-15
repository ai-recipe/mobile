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

  public loginWithGoogleAPI(data: { idToken: string }) {
    return api.post("/auth/google", data);
  }

  public loginWithAppleAPI(data: {
    identityToken: string;
    fullName?: { givenName?: string; familyName?: string };
    email?: string;
  }) {
    return api.post("/auth/apple", data);
  }

  public fetchQuotaAPI() {
    return api.get("/auth/me/quota");
  }

  public getUserAPI() {
    return api.get("/auth/me");
  }
}

export default new AuthService();
