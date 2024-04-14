import { catchError } from "../lib/helper";
import axios from "axios";
import { AUTH_URL } from "./client";

export const register = async (formData) => {
  try {
    const { data } = await axios.post(`${AUTH_URL}/register`, formData);

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const login = async (formData) => {
  try {
    const { data } = await axios.post(`${AUTH_URL}/login`, formData);

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const logout = async (formData) => {
  try {
    const { data } = await axios.post(`${AUTH_URL}/logout`, formData);

    return data;
  } catch (error) {
    return catchError(error);
  }
};
