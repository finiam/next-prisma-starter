import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "./prisma";

interface UserParams {
  email: string;
  password: string;
}

export async function createUser(params: UserParams): Promise<User> {
  const password = await bcrypt.hash(params.password, 10);
  const user = await prisma.user.create({
    data: { ...params, password },
  });
  user.password = "";

  return user;
}

export async function findUserByEmail(email: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) user.password = "";

  return user;
}

export async function authenticateOrCreateUser(params: UserParams) {
  let user = await prisma.user.findUnique({ where: { email: params.email } });

  if (!user) return createUser(params);
  else if (await bcrypt.compare(params.password, user.password)) {
    user.password = "";

    return user;
  }
}

export async function updateUser(id: number, params: UserParams) {
  const password = params.password
    ? await bcrypt.hash(params.password, 10)
    : undefined;
  const user = await prisma.user.update({
    where: { id },
    data: { ...params, password },
  });
  if (user) user.password = "";

  return user;
}

export async function deleteUser(id: number) {
  const response = await prisma.$transaction([
    prisma.note.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);

  return response[1];
}
