import prisma from "../lib/prisma.js";

export const createAssignment = async (req, res) => {
  const { title, markPercent, weightingPercent, moduleId } = req.body;
  const newAssignment = await prisma.assignment.create({
    data: {
      title: title,
      markPercent: markPercent,
      weightingPercent: weightingPercent,
      moduleId: moduleId,
    },
  });

  res.status(201).json({ assignment: newAssignment });
};

export const deleteAssignment = async (req, res) => {
  const { id: assignmentId } = req.params;

  await prisma.assignment.delete({
    where: {
      id: assignmentId,
    },
  });

  res.sendStatus(204);
};

export const updateAssignment = async (req, res) => {
  const { id: assignmentId } = req.params;
  const { title, markPercent, weightingPercent } = req.body;

  const updatingData = {};

  if (title) {
    updatingData.title = title;
  }
  if (markPercent !== undefined) {
    // Allows setting of 0%
    updatingData.markPercent = markPercent;
  }
  if (weightingPercent) {
    updatingData.weightingPercent = weightingPercent;
  }

  const updatedAssigment = await prisma.assignment.update({
    where: {
      id: assignmentId,
    },
    data: updatingData,
  });

  res.status(200).json({ assignment: updatedAssigment });
};
