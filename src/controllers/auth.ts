import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { generateToken } from "../utils/jwt";
import getPrismaClient from "../utils/prismaClient";
import { loginSchema, registrationSchema } from "../utils/inputValidation";

const prisma = getPrismaClient();

// Register new user
export const register = async (req: Request, res: Response) => {
  // input validation
  const { data, error } = registrationSchema.safeParse(req.body);

  if(error) {
    res.status(400).json({ success: false, message: error.message });
    return;
  }

  const { name, email, password } = data;

  try {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if(user) {
        res.status(400).json({ success: false, message: "Email already exist" });
        return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ success: true, message: "User registered successfully!", data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
    // input validation
    const { data, error } = loginSchema.safeParse(req.body);

    if(error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
  
    const { email, password } = data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ success: false, error: "User not found!" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ success: false, error: "Invalid credentials!" });
      return;
    }

    const token = generateToken(user.id);

    res.status(200).json({ success: true, message: "Login successful!", data: token });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};