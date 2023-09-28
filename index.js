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
  const query = querystring.parse(request.query)
  response.send('<h1>Hello World!</h1><pre>' + request.query.mediaType + '</pre>');
});

app.get("/tokenized", (request, response) => {
  response.send('<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>TOKENIZED</title></head><body><h1>TOKENIZED</h1><pre style="font-size:18px;">' + JSON.stringify(request.query, null, 4) + '</pre></body></html>')
});

app.get("/success", (request, response) => {
  if (request.query.isTokenized == 'TRUE')
    response.send('<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>APPROVED TOKENIZED</title></head><body><h1>APPROVED & TOKENIZED</h1><pre style="font-size:18px;">' + JSON.stringify(request.query, null, 4) + '</pre></body></html>')
  else
    response.send('<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>APPROVED</title></head><body><h1>APPROVED</h1><pre style="font-size:18px;">' + JSON.stringify(request.query, null, 4) + '</pre></body></html>')
});

app.get("/failure", (request, response) => {
  response.send('<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>DECLINED</title></head><body><h1>DECLINED</h1><pre style="font-size:18px;">' + JSON.stringify(request.query, null, 4) + '</pre></body></html>')
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if (!note){
      response.status(404).end();
    }
    else{
      response.json(note);
    }
  }).catch(error => next(error))
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
  .catch(error => next(error))
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id).then(note => {
    if (!note){
      response.status(404).end();
    }
    else{
      response.status(204).end();
    }
  }).catch(error => next(error))
});

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, 
    { content, important },
    { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedNote => {
      if (!updatedNote){
        response.status(404).end();
      }
      else{
        response.json(updatedNote)
      }
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
