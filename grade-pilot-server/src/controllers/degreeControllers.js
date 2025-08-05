import prisma from "../lib/prisma.js";
import NotFoundError from "../errors/not-found.js";

export const getDegree = async (req, res) => {
  // Overview page

  const degree = await prisma.degree.findUnique({
    where: {
      userId: req.user.userId,
    },

    include: {
      academicYears: {
        include: {
          modules: {
            include: {
              assignments: true,
            },
          },
        },
      },
    },
  });

  if (!degree) {
    throw new NotFoundError(
      "You don't have any degrees! Make sure to create one"
    );
  }

  res.status(200).json({ degree: degree });
};

export const createDegree = async (req, res) => {
  // Adding the degree from the user information
  const {
    title,
    studyLevel,
    degreeType,
    yearData, // Array of year objects
    currentYear,
    targetClassification,
  } = req.body;

  const newDegree = await prisma.degree.create({
    data: {
      title: title,
      studyLevel: studyLevel,
      degreeType: degreeType,
      totalLengthYears: yearData.length,
      currentYear: currentYear,
      targetClassification: targetClassification,

      user: {
        connect: {
          id: req.user.userId,
        },
      },

      academicYears: {
        create: yearData, // Need to add year weightings when compiling the yearData
      },
    },
  });

  res.status(201).json({ degree: newDegree });
};

export const updateDegree = async (req, res) => {
  // Mostly for changing academic year (e.g. moving from 4 year to 3 year - which means an academic year would need to be deleted)
  // More complex
  // const { newDegreeLength} = req.body
  // const degree = await prisma.degree.update({
  //   where: {
  //     userId: req.user.userId,
  //   },
  //   data: {
  //     totalLengthYears: newDegreeLength,
  //     academicYears: {
  //       update:{
  //       }
  //     }
  //   }
  // });
};
