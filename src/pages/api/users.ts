import prisma from "root/lib/prisma";
import { authenticateUser, getCurrentUser } from "root/lib/auth/tokenUtils";
import { encryptPassword } from "root/lib/auth/passwordUtils";
import { logRpc } from "root/lib/audit";

export const config = { rpc: true };

interface UserParams {
  email: string;
  password: string;
}

export async function updateUser(params: UserParams) {
  await logRpc("createNote", params);
  const currentUser = await getCurrentUser();
  const password = params.password
    ? await encryptPassword(params.password)
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
  await logRpc("createNote");
  const currentUser = await getCurrentUser();
  const [_, user] = await prisma.$transaction([
    prisma.note.deleteMany({ where: { userId: currentUser.id } }),
    prisma.user.delete({ where: { id: currentUser.id } }),
  ]);

  if (user) user.password = "";

  return user;
}
