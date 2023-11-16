import { AxiosApiClientBuilder } from "../axiosIndex";
import { User } from "./UserType";

const apiClient = new AxiosApiClientBuilder().withResourceName("/user").build();

export const getUserList = async (): Promise<User[]> => {
  return apiClient.get("");
};
