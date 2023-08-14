require('dotenv').config()
const express = require('express')
const app = express();
const Note = require('./models/note')
const morgan = require('morgan');
const note = require('./models/note');


app.use(express.json());
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));


app.head("/", (request, response) => {
  response.status(200).end();
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then(note => {
    if (!note){
      response.status(400).end();
    }
    else{
      response.json(note);
    }
  }).catch(err => {
    response.status(404).end();
  })
});

app.post("/api/notes", (request, response) => {
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

  note.save().then(savedNote =>{
    response.json(savedNote);
  })
});

app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id).then(note => {
    if (!note){
      response.status(400).end();
    }
    else{
      response.status(204).end();
    }
  }).catch(err => {
    response.status(404).end();
  })
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
