import { ApolloServer } from "apollo-server-micro";
import { userFromRequest } from "src/web/tokens";
import notesResolvers from "./resolvers/notesResolvers";
import sessionResolvers from "./resolvers/sessionResolvers";
import userResolvers from "./resolvers/usersResolvers";

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Note {
    id: ID!
    content: String!
  }

  type Query {
    notes: [Note!]
  }

  type Mutation {
    createUser(email: String!, name: String!, password: String!): User!
    updateUser(email: String!, name: String!, password: String!): User!
    deleteUser: User!

    login(email: String!, password: String!): User
    logout: Boolean!

    createNote(content: String!): Note!
    deleteNote(id: ID!): Boolean!
  }
`;

const resolvers = {
  ...userResolvers,
  ...sessionResolvers,
  ...notesResolvers,
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    const currentUser = await userFromRequest(req);

    return { currentUser, req, res };
  },
});

export default apolloServer;
