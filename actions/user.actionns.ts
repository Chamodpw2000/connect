import { USERS_ENDPOINTS } from "@/constants/api-endpoints.constants";
import createServerApi from "@/lib/interceptors";

export const getCurrentUser = async (email: string) => {
  const axiosInstance = await createServerApi();
  const response = await axiosInstance.get(`${USERS_ENDPOINTS.GET_BY_EMAIL.replace(':email', email)}`);
  return response.data;
};



