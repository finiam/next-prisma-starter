import { NextApiRequest, NextApiResponse } from "next";
import { authenticateOrCreateUser } from "root/lib/users";
import ensureMethod from "root/utils/ensureMethod";
import { authenticateUser, clearUser } from "root/utils/tokenUtils";

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  let user = await authenticateOrCreateUser(req.body);

  if (user) {
    authenticateUser(user, res);
    res.json(user);
  } else {
    res.status(404).send("");
  }
};

const handleDelete = async (_req: NextApiRequest, res: NextApiResponse) => {
  clearUser(res);

  res.status(200).send("");
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ensureMethod(req, res, ["POST", "DELETE"])) return;

  switch (req.method) {
    case "POST":
      await handlePost(req, res);
      break;
    case "DELETE":
      await handleDelete(req, res);
      break;
  }
};
