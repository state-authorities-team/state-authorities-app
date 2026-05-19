import type { Prisma } from "@prisma/client";
import prisma from "../configs/db-config.js";

export const getAll = async () => {
  const agencies = await prisma.agency.findMany();
  return agencies;
};

export const create = async (data: Prisma.AgencyUncheckedCreateInput) => {
  return prisma.agency.create({ data, include: { agencyType: true } });
};

export const update = async (id: number, data: Prisma.AgencyUncheckedUpdateInput) => {
  return prisma.agency.update({ where: { id }, data, include: { agencyType: true } });
};

export const remove = async (id: number) => {
  return prisma.agency.delete({ where: { id } });
};
