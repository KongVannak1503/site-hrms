import axios from "axios";
import { API_URL, TOKEN } from "./mainApi";

export const getPermissionsApi = async () => {
    const response = await axios.get(`${API_URL}permissions`, {
        headers: {
            Authorization: TOKEN,
        },
    });
    return response.data;
};
