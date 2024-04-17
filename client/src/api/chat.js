import axios from "axios";
import { CHAT_URL, MESSAGE_URL } from "./client";
import { catchError, getToken } from "../lib/helper";

export const getChats = async () => {
  try {
    const { data } = await axios.get(`${CHAT_URL}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getChat = async (id) => {
  try {
    const { data } = await axios.get(`${CHAT_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const createMessage = async (id, text) => {
  try {
    const { data } = await axios.post(`${MESSAGE_URL}/${id}`, { text });

    return data;
  } catch (error) {
    return catchError(error);
  }
};
