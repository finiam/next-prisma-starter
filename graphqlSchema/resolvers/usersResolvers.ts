import { createUser, deleteUser, updateUser } from "lib/users";
import { authenticateUser, clearUser } from "src/web/tokens";

const userResolvers = {
  Mutation: {
    createUser: async (_parent, args, context) => {
      const user = await createUser(args);

      authenticateUser(context.res, user);

      return user;
    },
    updateUser: async (_parent, args, context) => {
      const updatedUser = await updateUser(context.currentUser, args);

      authenticateUser(context.res, updatedUser);

      return updatedUser;
    },
    deleteUser: async (_parent, args, context) => {
      const user = await deleteUser(context.user);

      clearUser(context.res);

      return user;
    },
  },
};

export default userResolvers;
