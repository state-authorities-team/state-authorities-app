import prisma from "../configs/db-config.js";

export const getAll = async () => {
  const agencies = await prisma.agency.findMany();
  return agencies;
};
