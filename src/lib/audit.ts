import { getCurrentUser } from "./auth/tokenUtils";
import { UNAUTHENTICATED_ERROR } from "./errorTypes";
import prisma from "./prisma";

export const FILTERED_PARAMS = ["password"];

export async function logRpc(methodName: string, params = {}): Promise<void> {
  let user;

  try {
    await getCurrentUser();
  } catch (error) {
    if (error.message !== UNAUTHENTICATED_ERROR) throw error;
  }

  const auditEvent = await prisma.auditEvent.create({
    data: { methodName, params, user },
  });

  console.log(
    `${
      auditEvent.id
    } - Received request: ${methodName}\nParams: ${JSON.stringify(
      params
    )}\nUser: ${user?.email || "not logged in"}`
  );
}
