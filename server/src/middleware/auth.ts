import { verifyToken } from "../utils/JWTUtils.ts";

const authMiddleware = async (req, res, next) => {
  console.log("req.cookies", req.cookies);
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { isValid, payload } = await verifyToken(token);
  if (!isValid) {
    return res.status(401).json({ message: "Forbidden, invalid access token" });
  }
  req.user = payload;
  next();
};

export default authMiddleware;
