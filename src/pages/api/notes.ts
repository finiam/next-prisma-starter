import { getCurrentUser } from "root/lib/auth/tokenUtils";
import prisma from "root/lib/prisma";
import { logRpc } from "root/lib/audit";
import { Note } from ".prisma/client";

export const config = { rpc: true };

export async function listNotes(): Promise<Note[]> {
  await logRpc("listNotes");
  const user = await getCurrentUser();

  if (!user) return null;

  return prisma.note.findMany({ where: { userId: user.id } });
}

export async function deleteNote(id: string) {
  await logRpc("deleteNotes", { id });
  const user = await getCurrentUser();

  return prisma.note.deleteMany({ where: { id, userId: user.id } });
}

export async function createNote(noteParams: { content: string }) {
  await logRpc("createNote", noteParams);
  const user = await getCurrentUser();

  return prisma.note.create({
    data: { ...noteParams, user: { connect: { id: user.id } } },
  });
}
