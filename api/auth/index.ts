import { api } from "@/api/axios";

class AuthService {
  public login() {
    return api.post("/auth/login");
  }
}

export default new AuthService();
