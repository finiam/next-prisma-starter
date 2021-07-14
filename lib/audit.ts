import { AuditEvent } from "@prisma/client";
import { NextApiRequest } from "next";
import omit from "lodash/omit";
import { userFromRequest } from "src/web/tokens";
import prisma from "./prisma";

export const FILTERED_PARAMS = ["password"];

export async function logRequest(req: NextApiRequest): Promise<AuditEvent> {
  const user = await userFromRequest(req);

  return prisma.auditEvent.create({
    data: {
      url: req.url,
      method: req.method,
      params: omit(FILTERED_PARAMS, req.body),
      query: omit(FILTERED_PARAMS, req.query as any),
      userId: user?.id,
    },
  });
}
