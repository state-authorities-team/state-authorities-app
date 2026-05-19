import prisma from "../configs/db-config.js";

export const getAll = async () => {
  const agencyTypes = await prisma.agencyType.findMany();
  return agencyTypes;
};
