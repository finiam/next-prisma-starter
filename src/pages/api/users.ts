import bcrypt from "bcrypt";
import prisma from "root/lib/prisma";
import { authenticateUser, getCurrentUser } from "root/lib/tokenUtils";

export const config = { rpc: true };

interface UserParams {
  email: string;
  password: string;
}

export async function updateUser(params: UserParams) {
  const currentUser = await getCurrentUser();
  const password = params.password
    ? await bcrypt.hash(params.password, 10)
    : undefined;
  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { ...params, password },
  });

  if (user) {
    authenticateUser(user);
    user.password = "";
  }

  return user;
}

export async function deleteUser() {
  const currentUser = await getCurrentUser();
  const [_, user] = await prisma.$transaction([
    prisma.note.deleteMany({ where: { userId: currentUser.id } }),
    prisma.user.delete({ where: { id: currentUser.id } }),
  ]);

  if (user) user.password = "";

  return user;
}
