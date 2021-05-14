import nextConnect from "next-connect";
import logger from "root/middlewares/logger";

export default function defaultHandler<ReqType, ResType>() {
  return nextConnect<ReqType, ResType>({
    attachParams: true,
    onError: (err, req, res) => {
      console.error(err);

      res.status(500).json({ error: "Internal Server Error" });
    },
  }).use(logger);
}
