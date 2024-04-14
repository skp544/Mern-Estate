import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = (req, res) => {
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
      }
    );

    return res.status(200).json({ success: true, message: "Authenticated" });
  } catch (error) {
    console.error(error);
  }
};
export const shouldBeAdmin = (req, res) => {
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

        if (!payload.isAdmin) {
          return res
            .status(401)
            .json({ success: false, message: "Not Authorized" });
        }
      }
    );

    return res.status(200).json({ success: true, message: "Authenticated" });
  } catch (error) {
    console.error(error);
  }
};
