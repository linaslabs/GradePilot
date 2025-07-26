import { PrismaClient } from "@prisma/client";

// Following is to enable working with intellisense and JS
/** @type {import('@prisma/client').PrismaClient} */
const prisma = new PrismaClient();

export default prisma;
