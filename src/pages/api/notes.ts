import { NextApiResponse } from "next";
import requireLogin, {
  NextApiRequestWithUser,
} from "root/middlewares/requireLogin";
import { createNote, deleteNote, listNotes } from "lib/notes";
import defaultHandler from "./_defaultHandler";

const handler = defaultHandler<NextApiRequestWithUser, NextApiResponse>()
  .use(requireLogin)
  .get(async (req, res) => {
    const notes = await listNotes(req.currentUser);

    res.json(notes);
  })
  .post(async (req, res) => {
    const note = await createNote(req.currentUser, req.body);

    res.json(note);
  })
  .delete(async (req, res) => {
    await deleteNote(req.currentUser, req.query.id as string);

    res.send("");
  });

export default handler;
