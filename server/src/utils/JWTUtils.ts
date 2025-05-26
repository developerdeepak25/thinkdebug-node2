import jwt from "jsonwebtoken";
export const verifyToken = async (Token) => {
  try {
    const payload = await jwt.verify(Token, process.env.TOKEN_SECRET!);
    console.log(payload);
    return { payload, isValid: true };
  } catch (error) {
    return { payload: null, isValid: false };
  }
};

// export default { verifyToken };
