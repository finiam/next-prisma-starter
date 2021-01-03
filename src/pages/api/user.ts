import { NextApiRequest, NextApiResponse } from "next";
import { deleteUser, updateUser } from "root/lib/users";
import ensureMethod from "root/utils/ensureMethod";
import { authenticateUser, ensureAuthenticated } from "root/utils/tokenUtils";

const handleUpdate = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await ensureAuthenticated(req, res);

  if (!user) return;

  const updatedUser = await updateUser(user.id, req.body);

  authenticateUser(updatedUser, res);

  if (updatedUser) res.status(200).send("");
  else res.status(404).send("");
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await ensureAuthenticated(req, res);

  if (!user) return;

  const deletedUser = await deleteUser(user.id);

  if (deletedUser) res.status(200).send("");
  else res.status(404).send("");
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!ensureMethod(req, res, ["PUT", "DELETE"])) return;

  switch (req.method) {
    case "PUT":
      await handleUpdate(req, res);
      break;
    case "DELETE":
      await handleDelete(req, res);
      break;
    default:
      break;
  }
};
