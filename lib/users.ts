import { User } from "@prisma/client";
import prisma from "lib/prisma";
import { encryptPassword } from "lib/auth/passwordUtils";

interface UserParams {
  email: string;
  password: string;
}

export async function updateUser(user: User, params: UserParams) {
  const password = params.password
    ? await encryptPassword(params.password)
    : undefined;
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { ...params, password },
  });

  if (updatedUser) {
    updatedUser.password = "";
  }

  return updatedUser;
}

export async function deleteUser(user: User) {
  const [_, newUser] = await prisma.$transaction([
    prisma.note.deleteMany({ where: { userId: user.id } }),
    prisma.user.delete({ where: { id: user.id } }),
  ]);

  if (newUser) newUser.password = "";

  return newUser;
}
