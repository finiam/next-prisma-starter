import { createNote, deleteNote, listNotes } from "lib/notes";

const notesResolvers = {
  Query: {
    notes: (_parent, _args, context) => listNotes(context.currentUser),
  },

  Mutation: {
    createNote: (_parent, args, context) =>
      createNote(context.currentUser, args),
    deleteNote: (_parent, args, context) =>
      deleteNote(context.currentUser, args.id),
  },
};

export default notesResolvers;
