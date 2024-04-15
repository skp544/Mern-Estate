import { POSTS_URL } from "./client";
import axios from "axios";
import { catchError, getToken } from "../lib/helper";

export const createPost = async (post) => {
  try {
    const { data } = await axios.post(`${POSTS_URL}`, post, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    console.log(post);

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

export const getPosts = async (query) => {
  try {
    const { data } = await axios.get(`${POSTS_URL}?${query}`);
    console.log(data);

    return data;
  } catch (error) {
    return catchError(error);
  }
};
