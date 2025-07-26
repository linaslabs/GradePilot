import prisma from "../lib/prisma.js";

export const createModule = async (req, res) => {
  const { name, credits, academicYearId } = req.body;
  const newModule = await prisma.module.create({
    data: {
      name: name,
      credits: credits,
      academicYearId: academicYearId,
    },
  });

  res.status(201).json({ module: newModule });
};

export const updateModule = async (req, res) => {
  const { name, credits } = req.body;
  const { id: moduleId } = req.params;

  const updatingData = {};

  if (name) {
    updatingData.name = name;
  }

  if (credits) {
    updatingData.credits = credits;
  }

  const updatedModule = await prisma.module.update({
    where: {
      id: moduleId,
    },

    data: updatingData,
  });

  res.status(200).json({ module: updatedModule });
};

export const deleteModule = async (req, res) => {
  const { id: moduleId } = req.params;

  await prisma.module.delete({
    where: {
      id: moduleId,
    },
  });

  res.sendStatus(204);
};
