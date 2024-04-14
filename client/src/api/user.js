import { catchError, getToken } from "../lib/helper";
import axios from "axios";
import { USERS_URL } from "./client";

export const update = async (id, formData) => {
  try {
    const { data } = await axios.put(`${USERS_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `
            Bearer ${getToken()}`,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};
