import { Request, Response, NextFunction } from "express";

import { verifyToken } from "../utils/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if(!authHeader || !authHeader.startsWith('Bearer')) {
    res.status(401).json({ success: false, error: "Invalid authHeader." });
    return;
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = verifyToken(token) as { userId: string };
    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token!" });
  }
};