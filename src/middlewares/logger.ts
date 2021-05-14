import { logRequest } from "lib/audit";
import { NextApiRequest, NextApiResponse } from "next";

export default async function logger(
  req: NextApiRequest,
  _res: NextApiResponse,
  next: () => void
) {
  const auditEvent = await logRequest(req);

  console.log(auditEvent.createdAt, auditEvent.method, auditEvent.url);

  next();
}
