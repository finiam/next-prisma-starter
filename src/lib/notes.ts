import { User, Note } from "@prisma/client";
import prisma from "./prisma";

export function listNotes(user: User): Promise<Note[]> {
  return prisma.note.findMany({ where: { userId: user.id } });
}

export function createNote(user: User, params: Note): Promise<Note> {
  return prisma.note.create({
    data: { ...params, user: { connect: { id: user.id } } },
  });
}

export function deleteNote(user: User, id: number) {
  return prisma.note.deleteMany({ where: { id, userId: user.id } });
}
