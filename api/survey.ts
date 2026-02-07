import { api } from "./axios";

class SurveyService {
  async submitSurveyAPI(data: any) {
    return api.post("/survey/submit", data);
  }

  async getUserPreferencesAPI() {
    return api.get("/survey/preferences");
  }
}

export default new SurveyService();
