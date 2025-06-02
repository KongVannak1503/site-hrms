import axios from "axios";
import { API_URL, TOKEN } from "./mainApi";

export const getRolesApi = async () => {
    const response = await axios.get(`${API_URL}roles`, {
        headers: {
            Authorization: TOKEN,
        },
    });
    return response.data;
};