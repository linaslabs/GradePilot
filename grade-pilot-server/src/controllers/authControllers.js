import prisma from "../lib/prisma.js";
import {
  ConflictError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} from "../errors/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please fill out both the email and password");
  }

  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    throw new NotFoundError("User not found, make sure to register!");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthenticatedError("Incorrect email or password entered");
  }

  const payload = {
    userId: user.id,
    name: user.name,
  };

  const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  const degree = await prisma.degree.findUnique({ where: { userId: user.id } });

  res.status(200).json({
    user: {
      name: user.name,
      onboardingCompleted: user.onboardingCompleted,
      degreeType: degree.degreeType,
    },
    token: jwtToken,
  });
};

export const registration = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please fill out all the fields");
  }

  // Check if user is present in database already
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (user) {
    throw new ConflictError("This email already exists, login!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });

  const payload = {
    userId: newUser.id,
    name: name,
  };

  const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  res.status(201).json({
    user: {
      name: newUser.name,
      onboardingCompleted: newUser.onboardingCompleted,
    },
    token: jwtToken,
  });
};
