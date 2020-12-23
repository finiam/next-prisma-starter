import { NextApiRequest, NextApiResponse } from "next";

export default function ensureMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  method: String | String[]
): boolean {
  let valid = false;

  if (Array.isArray(method)) {
    valid = method.map((m) => m.toUpperCase()).includes(req.method);
  } else {
    valid = req.method === method.toUpperCase();
  }

  if (!valid) {
    res.status(404).send("");

    return false;
  }

  return true;
}
