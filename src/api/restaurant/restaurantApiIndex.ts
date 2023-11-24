import { AxiosApiClientBuilder } from "../axiosIndex";
import {
  Restaurant,
  CreateRestaurantType,
  SearchRestaurantQuery,
} from "./RestaurantType";

const apiClient = new AxiosApiClientBuilder()
  .withResourceName("/restaurant")
  .build();

export const getRestaurants = async (
  input: SearchRestaurantQuery
): Promise<Restaurant[]> => {
  return apiClient.get("", { params: input });
};

export const getRestaurantDetail = async (
  restaurantId: string
): Promise<Restaurant> => {
  return apiClient.get(`id/${restaurantId}`);
};

export const createRestaurant = async (
  restaurant: CreateRestaurantType,
  fileExtension?: string
): Promise<Restaurant> => {
  return apiClient.post("", { restaurant, fileExtension });
};
