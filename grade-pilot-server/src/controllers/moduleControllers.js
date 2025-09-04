import prisma from "../lib/prisma.js";

export const createModule = async (req, res) => {
  const { name, credits, moduleCode, targetMark, academicYearId } = req.body;
  const newModule = await prisma.module.create({
    data: {
      name: name,
      credits: credits,
      moduleCode: moduleCode,
      targetMark: targetMark,
      academicYearId: academicYearId,
    },
    include: {
      assignments: true,
    },
  });

  res.status(201).json({ module: newModule });
};

export const updateModule = async (req, res) => {
  const { name, credits, moduleCode, targetMark } = req.body;
  const { id: moduleId } = req.params;

  // Technically name and credits are compulsory non-false values anyways so we don't need to check they exist
  const updatingData = {
    name: name,
    credits: credits,
  };

  if (moduleCode !== undefined) {
    updatingData.moduleCode = moduleCode;
  }

  if (targetMark !== undefined) {
    updatingData.targetMark = targetMark === null ? null : Number(targetMark);
  }

  const updatedModule = await prisma.module.update({
    where: {
      id: moduleId,
    },

    data: updatingData,

    include: {
      assignments: true,
    },
  });

  res.status(200).json({ module: updatedModule });
};

export const deleteModule = async (req, res) => {
  const { id: moduleId } = req.params;

  await prisma.$transaction([
    prisma.assignment.deleteMany({
      where: {
        moduleId: moduleId,
      },
    }),
    prisma.module.delete({
      where: {
        id: moduleId,
      },
    }),
  ]);

  res.sendStatus(204);
};
