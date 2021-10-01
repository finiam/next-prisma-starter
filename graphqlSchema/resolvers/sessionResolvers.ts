import { login } from "lib/auth";
import { authenticateUser, clearUser } from "src/web/tokens";

const sessionResolvers = {
  Mutation: {
    login: async (_parent, args, context) => {
      const user = await login(args);

      if (user) authenticateUser(context.res, user);

      return user;
    },
    logout: (_parent, _args, context) => {
      clearUser(context.res);

      return true;
    },
  },
};

export default sessionResolvers;
