import { getCurrentUser } from "root/lib/tokenUtils";
import prisma from "root/lib/prisma";
import { Note } from ".prisma/client";

export const config = { rpc: true };

export async function listNotes(): Promise<Note[]> {
  const user = await getCurrentUser();

  if (!user) return null;

  return prisma.note.findMany({ where: { userId: user.id } });
}

export async function deleteNote(id: number) {
  const user = await getCurrentUser();

  return prisma.note.deleteMany({ where: { id, userId: user.id } });
}

export async function createNote(noteParams: { content: string }) {
  const user = await getCurrentUser();

  return prisma.note.create({
    data: { ...noteParams, user: { connect: { id: user.id } } },
  });
}
