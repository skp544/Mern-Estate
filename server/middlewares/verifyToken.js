import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authenticated" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err, payload) => {
        if (err) {
          return res
            .status(401)
            .json({ success: false, message: "Not Authenticated" });
        }

        req.userId = payload.id;

        next();
      }
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
