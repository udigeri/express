const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

notesRouter.get("/:id", async (request, response, next) => {
  const note = await Note.findById(request.params.id);
  try {
    if (!note) {
      response.status(404).end();
    } else {
      response.json(note);
    }
  } catch (error) {
    next(error);
  }
});

notesRouter.post("/", async (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  const savedNote = await note.save();
  try {
    response.json(savedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete("/:id", async (request, response, next) => {
  const note = await Note.findByIdAndDelete(request.params.id);
  try {
    if (!note) {
      response.status(404).end();
    } else {
      response.status(204).end();
    }
  } catch (error) {
    next(error);
  }
});

notesRouter.put("/:id", async (request, response, next) => {
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
  try {
    if (!updatedNote) {
      response.status(404).end();
    } else {
      response.json(updatedNote);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;
