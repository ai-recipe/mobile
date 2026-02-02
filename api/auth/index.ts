import { api } from "@/api/axios";

class AuthService {
  public loginWithEmailAPI(data: any) {
    return api.post("/auth/login", data);
  }

  public registerWithEmailAPI(data: any) {
    return api.post("/auth/register", data);
  }
}

export default new AuthService();
