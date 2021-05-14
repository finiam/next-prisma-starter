import redaxios from "redaxios";

type Params = Record<string, any>;

export const createUser = (params: Params) =>
  redaxios.post("/api/users", params);
export const updateUser = (params: Params) =>
  redaxios.put("/api/users", params);
export const deleteUser = () => redaxios.delete("/api/users");
export const login = (params: Params) => redaxios.post("/api/sessions", params);
export const logout = () => redaxios.delete("/api/sessions");
export const listNotes = (params: Params) =>
  redaxios.post("/api/notes", params);
export const createNote = (params: Params) =>
  redaxios.post("/api/notes", params);
export const deleteNote = (id: number | string) =>
  redaxios.delete("/api/notes", { params: { id } });
