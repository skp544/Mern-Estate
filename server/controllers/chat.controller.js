import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  try {
    const userId = req.userId;

    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [userId],
        },
      },
    });

    for (const chat of chats) {
      const reciverId = chat.userIDs.filter((id) => id !== userId);

      const reciever = await prisma.user.findUnique({
        where: {
          id: reciverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });

      chat.reciever = reciever;
    }

    return res
      .status(200)
      .json({ success: true, message: "Chats fetched", chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getChat = async (req, res) => {
  try {
    const userId = req.userId;

    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [userId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [userId],
        },
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Chat fetched", chat });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addChat = async (req, res) => {
  try {
    const userId = req.userId;

    const newChat = await prisma.chat.create({
      data: {
        userIDs: [userId, req.body.receiverId],
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Chat created", chat: newChat });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const readChat = async (req, res) => {
  try {
    const userId = req.userId;

    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [userId],
        },
      },
      data: {
        seenBy: {
          set: [userId],
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Chat read",
      chat,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
