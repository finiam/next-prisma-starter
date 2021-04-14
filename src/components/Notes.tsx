import React, { useState } from "react";
import { Note } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useErrorHandler } from "react-error-boundary";
import { createNote, deleteNote } from "root/pages/api/notes";

interface Props {
  notes: Note[];
}

export default function Notes({ notes: initialNotes }: Props) {
  const [notes, setNotes] = useState(initialNotes);
  const { handleSubmit, register, setValue } = useForm();
  const [submited, setSubmited] = useState(false);
  const handleError = useErrorHandler();

  const handleFormSubmit = async ({ content }) => {
    setSubmited(true);

    createNote({ content })
      .then((note) => {
        setValue("content", "");
        setSubmited(false);
        setNotes([...notes, note]);
      })
      .catch((error) => handleError(error));
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = Number(event.currentTarget.dataset.id);

    deleteNote(id)
      .then(() => setNotes(notes.filter((note) => note.id !== id)))
      .catch((error) => handleError(error));
  };

  return (
    <div>
      <div>
        <h1 className="text-3xl">My notes</h1>

        <ul className="my-14 space-y-4">
          {notes.map((note) => (
            <li key={note.id} className="space-x-8">
              <button
                className="w-8 h-8 rounded-full bg-gray-300"
                type="button"
                onClick={handleDelete}
                data-id={note.id}
              >
                X
              </button>

              <span>{note.content}</span>
            </li>
          ))}
        </ul>
      </div>

      <form
        className="flex items-center"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <input
          {...register("content", { required: true })}
          className="mr-4"
          type="text"
        />

        <button className="button" type="submit" disabled={submited}>
          Submit
        </button>
      </form>
    </div>
  );
}
