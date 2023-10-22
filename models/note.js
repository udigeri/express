const mongoose = require("mongoose");
const config = require('../utils/config')

mongoose.set("strictQuery", false);
// const password = process.argv[2]

// const url =
//   `mongodb+srv://udigeri:${password}@cluster0.z5dwrt9.mongodb.net/noteApp?retryWrites=true&w=majority`

const uri = config.MONGODB_URI;
//console.log("connecting to", uri);

var url = process.env.MONGODB_SCHEME;
if (url) {
  url += process.env.MONGODB_USER;
  url += ":";
  url += process.env.MONGODB_PASSWORD;
  url += "@";
  url += uri;
} else url = uri;

mongoose
  .connect(url)

  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
