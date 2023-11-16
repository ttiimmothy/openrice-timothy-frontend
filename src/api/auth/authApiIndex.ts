import { AxiosApiClientBuilder } from "../axiosIndex";
import { User, AuthenticateResponse } from "./authType";

const apiClient = new AxiosApiClientBuilder()
  .withResourceName("/auth/user")
  .withCredentials(true)
  .build();

export const postUserRegister = async (
  user: User
): Promise<AuthenticateResponse> => {
  return apiClient.post("/register", user);
};

export const postUserAuth = async (
  user: User
): Promise<AuthenticateResponse> => {
  return apiClient.post("/login", user);
};

export const getCurrentUser = async (): Promise<AuthenticateResponse> => {
  return apiClient.get("/current-user");
};
