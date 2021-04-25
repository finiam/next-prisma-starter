import { NOT_FOUND_ERROR } from "root/lib/errorTypes";
import prisma from "root/lib/prisma";
import { authenticateUser, clearUser } from "root/lib/auth/tokenUtils";
import { encryptPassword, verifyPassword } from "root/lib/auth/passwordUtils";
import { logRpc } from "root/lib/audit";
import { User } from ".prisma/client";

export const config = { rpc: true };

interface UserParams {
  email: string;
  name: string;
  password: string;
}

export async function createUser(params: UserParams): Promise<User> {
  await logRpc("createUser", params);
  const password = await encryptPassword(params.password);
  const user = await prisma.user.create({
    data: { ...params, password },
  });

  user.password = "";
  authenticateUser(user);

  return user;
}

export async function login(params: UserParams): Promise<User> {
  await logRpc("login", params);
  const user = await prisma.user.findUnique({ where: { email: params.email } });

  if (!user) throw new Error(NOT_FOUND_ERROR);

  if (await verifyPassword(user.password, params.password)) {
    user.password = "";
    authenticateUser(user);

    return user;
  }

  throw new Error(NOT_FOUND_ERROR);
}

export async function logout(): Promise<void> {
  await logRpc("logout");
  clearUser();
}
