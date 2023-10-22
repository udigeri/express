const express = require("express");
const app = express();
const morgan = require("morgan");
const notesRouter = require("./controllers/notes");

app.use(express.json());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);

app.use("/api/notes", notesRouter);

app.head("/", (request, response) => {
  response.status(200).end();x
});

app.get("/", (request, response) => {
  const query = querystring.parse(request.query);
  response.send(
    "<h1>Hello World!</h1><pre>" + request.query.mediaType + "</pre>"
  );
});

app.get("/tokenized", (request, response) => {
  response.send(
    '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>TOKENIZED</title></head><body><h1>TOKENIZED</h1><pre style="font-size:18px;">' +
      JSON.stringify(request.query, null, 4) +
      "</pre></body></html>"
  );
});

app.get("/success", (request, response) => {
  if (request.query.isTokenized == "TRUE")
    response.send(
      '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>APPROVED TOKENIZED</title></head><body><h1>APPROVED & TOKENIZED</h1><pre style="font-size:18px;">' +
        JSON.stringify(request.query, null, 4) +
        "</pre></body></html>"
    );
  else
    response.send(
      '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>APPROVED</title></head><body><h1>APPROVED</h1><pre style="font-size:18px;">' +
        JSON.stringify(request.query, null, 4) +
        "</pre></body></html>"
    );
});

app.get("/failure", (request, response) => {
  response.send(
    '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>DECLINED</title></head><body><h1>DECLINED</h1><pre style="font-size:18px;">' +
      JSON.stringify(request.query, null, 4) +
      "</pre></body></html>"
  );
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

module.exports = app;
