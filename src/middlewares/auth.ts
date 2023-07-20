import { NextFunction, Request, Response } from "express";
import User from "../models/User";

// chequea que el user esté logeado
export const Auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res
        .status(401)
        .json({ msg: "No authentication token, authorization denied." });
    }

    const user = await User.findByToken(token);
    if (!user)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });

    req.user = user;

    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
