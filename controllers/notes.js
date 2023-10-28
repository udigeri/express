const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes);
});

notesRouter.get("/:id", async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (!note) {
    response.status(404).end();
  } else {
    response.json(note);
  }
});

notesRouter.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findById(body.userId);

  if (body.content === undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();
  response.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (request, response) => {
  const note = await Note.findByIdAndDelete(request.params.id);
  if (!note) {
    response.status(404).end();
  } else {
    response.status(204).end();
  }
});

notesRouter.put("/:id", async (request, response) => {
  const { content, important } = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  );
  if (!updatedNote) {
    response.status(404).end();
  } else {
    response.json(updatedNote);
  }
});

module.exports = notesRouter;
