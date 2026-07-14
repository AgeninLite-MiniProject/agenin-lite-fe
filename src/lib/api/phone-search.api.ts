import apiClient from "../axios";

export interface PhoneSearchUser {
  user_id: string;
  name: string;
  phone: string;
  status: string;
}

export const phoneSearchApi = {
  searchByPhonePrefix: async (phone: string): Promise<PhoneSearchUser[]> => {
    const response = await apiClient.get<PhoneSearchUser[]>(
        "/api/users/search",
        {params : {phone}}
    );
    return response.data;
  },
};
