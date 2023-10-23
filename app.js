const express = require("express");
const app = express();
const morgan = require("morgan");
const logger = require("./utils/logger");
const baseRouter = require("./controllers/base");
const notesRouter = require("./controllers/notes");

app.use(express.json());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);

app.use("/api/notes", notesRouter);
app.use("/", baseRouter);


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.info(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
