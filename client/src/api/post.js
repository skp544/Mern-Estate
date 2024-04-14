import { POSTS_URL } from "./client";
import axios from "axios";
import { catchError, getToken } from "../lib/helper";

export const createPost = async (post) => {
  try {
    const { data } = await axios.post(`${POSTS_URL}`, post, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getPost = async (id) => {
  try {
    const { data } = await axios.get(`${POSTS_URL}/${id}`);

    return data;
  } catch (error) {
    return catchError(error);
  }
};
