import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    const { password, avatar, ...inputs } = req.body;

    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized!",
      });
    }

    let updatedPassword = null;

    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "User updated",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized!",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const savePost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.userId;

    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Post unsaved",
      });
    } else {
      await prisma.savedPost.create({
        data: {
          postId,
          userId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Post saved",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const profilePosts = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }

  try {
    const userPosts = await prisma.post.findMany({
      where: { userId },
    });

    const saved = await prisma.savedPost.findMany({
      where: { userId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);

    return res
      .status(200)
      .json({ success: true, message: "Posts fetched", userPosts, savedPosts });
  } catch (err) {
    console.error("Error fetching profile posts:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
