import { Note, User } from "@prisma/client";
import prisma from "lib/prisma";

export async function listNotes(user: User): Promise<Note[]> {
  if (!user) return null;

  return prisma.note.findMany({ where: { userId: user.id } });
}

export async function deleteNote(user: User, id: string): Promise<boolean> {
  return (
    (await prisma.note.deleteMany({ where: { id, userId: user.id } })).count > 1
  );
}

export async function createNote(user: User, noteParams: { content: string }) {
  return prisma.note.create({
    data: { ...noteParams, user: { connect: { id: user.id } } },
  });
}
