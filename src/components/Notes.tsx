import React, { useState } from "react";
import { Note } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useErrorHandler } from "react-error-boundary";
import useNetworkResource from "src/hooks/useNetworkResource";
import { createNote, deleteNote } from "src/web/apiRoutes";

interface Props {
  notes: Note[];
}

export default function Notes({ notes: initialNotes }: Props) {
  const [notes, setNotes] = useState(initialNotes);
  const { handleSubmit, register, setValue } = useForm();
  const onError = useErrorHandler();
  const [createNoteApi, { loading }] = useNetworkResource(createNote, {
    onError,
  });
  const [deleteNoteApi] = useNetworkResource(deleteNote, { onError });

  const handleFormSubmit = async ({ content }) => {
    createNoteApi({ content }).then((response) => {
      setValue("content", "");
      setNotes([...notes, response.data]);
    });
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget.dataset;

    deleteNoteApi(id).then(() =>
      setNotes(notes.filter((note) => note.id !== id))
    );
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

        <button className="u-button" type="submit" disabled={loading}>
          Submit
        </button>
      </form>
    </div>
  );
}
