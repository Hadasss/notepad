const fs = require("fs");
const path = require("path");
const express = require("express");
const notes = require("./db/db.json");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
const PORT = process.env.PORT || 3002;

// function to get user input for new note
function addNewNote(body, notesArr) {
  const note = body;
  note.id = Math.floor(Math.random() * 1000000000);
  notesArr.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesArr)
  );
  return note;
}

// function readNotesDb() {
//   fs.readFileSync(
//     path.join(__dirname, "./db/db.json"),
//     "utf-8",
//     function (error, data) {
//       console.log(data);
//       return data;
//     }
//   );
// }

// function to delete note and render notes in db
function deleteNote(noteObj) {
  // const noteId = id;
  // TODO get array index for id
  // console.log(noteObj);
  // const index = notes.indexOf(noteObj);
  // console.log(index);
  // notes.splice(index, 1);

  const notesArr = function () {
    fs.readFileSync(
      path.join(__dirname, "./db/db.json"),
      "utf-8",
      function (error, data) {
        console.log(data);
        return data;
      }
    );
  };
  const newArr = notesArr.filter((item) => {
    return item.id != noteObj;
  });
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(newArr)
  );
}

// set up GET API to return db JASON
app.get("/api/notes", (req, res) => {
  let response = notes;
  fs.readFileSync(
    path.join(__dirname, "./db/db.json"),
    "utf-8",
    function (error, data) {
      console.log(data);
      res.json({ data: data });
    }
  );
  res.json(response);
});

app.get("/api/note/:id", (req, res) => {
  const note = req.body;
  if (!res) {
    res.status(500).json({ error: err.message });
    return;
  }
  res.json(note); // BUG displaying empty object
});
// create a route for new notes with id parameter - assign a specific id to each note
app.post("/api/notes", (req, res) => {
  const note = addNewNote(req.body, notes);
  res.json(note);
});

// BUG
app.delete("/api/notes/:id", (req, res) => {
  // get the clicked note id
  const id = req.params.id;
  const note = req.body;
  // call deleteNote() to remove note from DB
  const updatedNotes = deleteNote(id);
  // render notes
  res.json(updatedNotes);
});

// ALL FRONT ROUTES HERE
// set up GET routes (including default GET route)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// always goes last
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log("Server active and listening");
});
