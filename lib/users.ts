import { User } from "@prisma/client";
import prisma from "lib/prisma";
import { encryptPassword } from "lib/auth/passwordUtils";

export interface UserParams {
  email: string;
  name: string;
  password: string;
}

export async function createUser({
  email,
  name,
  password,
}: UserParams): Promise<User> {
  const encryptedPassword = await encryptPassword(password);
  const user = await prisma.user.create({
    data: { email, name, password: encryptedPassword },
  });

  user.password = "";

  return user;
}

export async function updateUser(
  user: User,
  { email, name, password }: UserParams
) {
  const encryptedPassword = password
    ? await encryptPassword(password)
    : undefined;
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { email, name, password: encryptedPassword },
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
