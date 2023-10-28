const express = require("express");
require("express-async-errors");
const app = express();
const morgan = require("morgan");
const middleware = require("./utils/middleware");
const baseRouter = require("./controllers/base");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require('./controllers/login')

app.use(express.json());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);

app.use(middleware.requestLogger);

app.use("/", baseRouter);
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
