import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
  try {
    const query = req.query;

    console.log(query);

    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,

        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 999999999,
        },
      },
    });

    res.status(200).json({
      sucess: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getPost = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        postDetail: true,
        user: {
          select: {
            // id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addPost = async (req, res) => {
  try {
    const body = req.body;
    const userId = req.userId;

    const post = await prisma.post.create({
      data: {
        ...body.postData,
        userId: userId,
        postDetail: {
          create: {
            ...body.postDetail,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
