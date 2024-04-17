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

export const profilePosts = async () => {
  try {
    console.log(getToken());

    const { data } = await axios.get(`${USERS_URL}/profile-posts`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const savePost = async (postId) => {
  try {
    const { data } = await axios.post(
      `${USERS_URL}/save`,
      { postId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getNotificationNumber = async () => {
  try {
    const { data } = await axios.get(`${USERS_URL}/notification`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};
