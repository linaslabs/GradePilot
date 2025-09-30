import React from "react";
import prisma from "../lib/prisma.js";

export const deleteUser = async (req, res) => {
  const { userId } = req.user;

  await prisma.user.delete({ where: { id: userId } });

  res.sendStatus(204);
};
