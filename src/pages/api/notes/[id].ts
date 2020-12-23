import { NextApiRequest, NextApiResponse } from "next";
import { deleteNote } from "root/lib/notes";
import ensureMethod from "root/utils/ensureMethod";
import { ensureAuthenticated } from "root/utils/tokenUtils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ensureMethod(req, res, "DELETE")) return;

  const user = await ensureAuthenticated(req, res);

  if (!user) return;

  const notes = await deleteNote(user, Number(req.query.id));

  if (notes.count < 1) {
    res.status(404).send("");
    return;
  }

  res.status(200).send("");
};
