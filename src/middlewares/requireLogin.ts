import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { userFromRequest } from "root/web/tokens";

export interface NextApiRequestWithUser extends NextApiRequest {
  currentUser: User;
}

export default async function requireLogin(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const currentUser = await userFromRequest(req);

  if (currentUser) {
    // eslint-disable-next-line no-param-reassign
    (req as any).currentUser = currentUser;

    next();
  } else {
    res.status(401).json({ error: "unauthenticated" });
  }
}
