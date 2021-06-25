import { NextApiRequest, NextApiResponse } from "next";
import { createUser, deleteUser, updateUser } from "lib/users";
import { authenticateUser, userFromRequest } from "src/web/tokens";
import defaultHandler from "./_defaultHandler";

const handler = defaultHandler<NextApiRequest, NextApiResponse>()
  .post(async (req, res) => {
    const user = await createUser(req.body);

    authenticateUser(res, user);
    res.json(user);
  })
  .put(async (req, res) => {
    const currentUser = await userFromRequest(req);

    if (currentUser) {
      const updatedUser = await updateUser(currentUser, req.body);

      authenticateUser(res, updatedUser);
      res.json(updatedUser);
    } else res.status(401).json({ error: "unauthenticated" });
  })
  .delete(async (req, res) => {
    const currentUser = await userFromRequest(req);

    if (currentUser) {
      await deleteUser(currentUser);

      res.send("");
    } else res.status(401).json({ error: "unauthenticated" });
  });

export default handler;
