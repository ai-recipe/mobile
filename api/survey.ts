import { api } from "./axios";

class SurveyService {
  async submitSurveyAPI(data: any) {
    return api.post("/survey/submit", data);
  }
}

export default new SurveyService();
