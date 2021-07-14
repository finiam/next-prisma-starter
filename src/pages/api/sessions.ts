import { NextApiRequest, NextApiResponse } from "next";
import { login } from "lib/auth";
import { authenticateUser, clearUser } from "src/web/tokens";
import defaultHandler from "./_defaultHandler";

const handler = defaultHandler<NextApiRequest, NextApiResponse>()
  .post(async (req, res) => {
    const user = await login(req.body);

    if (user) {
      authenticateUser(res, user);
      res.json(user);
    } else {
      res.status(404).send("");
    }
  })
  .delete((_req, res) => {
    clearUser(res);

    res.send("");
  });

export default handler;
