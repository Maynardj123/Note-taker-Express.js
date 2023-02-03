const express = require('express');
const path = require('path');
const db = require('./db/db.json')
const fs = require('fs');
const { restart } = require('nodemon');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'))

app.get('/api/notes', (req, res) => {
    console.log(db)
    // res.json(db)
    fs.readFile('./db/db.json', (err, data)=>{
        console.log(JSON.parse(data))
        res.json(JSON.parse(data))
    })
})



app.post('/api/notes', (req, res) => {

    const {title ,text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: randomUUID(),
        }

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            }else{
                const parsedNotes = JSON.parse(data)

                parsedNotes.push(newNote)

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 2),
                    (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        :console.info('Succcessfully updated reviews!')
                )
            }
        })

        const response = {
            status: 'success',
            body: newNote,
        }
      res.status(201).json(response)
    } else {
        res.status(500).json('Error in saving note')
    }

        // readfile then writefile
})

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
  