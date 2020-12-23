import { NextApiRequest, NextApiResponse } from "next";
import { createNote } from "root/lib/notes";
import { ensureAuthenticated } from "root/utils/tokenUtils";
import ensureMethod from "root/utils/ensureMethod";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ensureMethod(req, res, "POST")) return;

  const user = await ensureAuthenticated(req, res);

  if (!user) return;

  const note = await createNote(user, req.body);

  res.json(note);
};
