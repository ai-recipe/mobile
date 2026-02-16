import { api } from "./axios";

export interface PersonalDetails {
  goalWeight: number;
  currentWeight: number;
  height: number;
  dateOfBirth: string;
  gender: string;
  stepGoal: number;
  dailyCalorieGoal?: number;
  dailyProteinGoal?: number;
  dailyCarbGoal?: number;
  dailyFatGoal?: number;
}

class UserService {
  async getPersonalDetailsAPI() {
    return api.get<{ data: PersonalDetails }>("/user/personal-details");
  }

  async updatePersonalDetailsAPI(data: Partial<PersonalDetails>) {
    return api.patch<{ data: PersonalDetails }>("/user/personal-details", data);
  }
}

export default new UserService();
