const PORT = 3001;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const attachNotes = require('./Develop/db/db.json');



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));


app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname,'./Develop/public/index.html')));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname,'./Develop/public/notes.html')));

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, './Develop/public/index.html')));

app.get('/api/notes', (req, res) => {
     res.json(attachNotes.slice(1))
})

    function makeNewNote(body, notesArray) {
        const newNote = body;
        if (!Array.isArray(notesArray))
            notesArray = [];
        
        if (notesArray.length === 0)
            notesArray.push(0);
    
        body.id = notesArray[0];
        notesArray[0]++;
    
        notesArray.push(newNote);
        fs.writeFileSync(
            path.join(__dirname, attachNotes),
            JSON.stringify(notesArray, null, 2)
        );
        return newNote;
    }
    
    app.post('/api/notes', (req, res) => {
        const newNote = makeNewNote(req.body, attachNotes);
        res.json(newNote);
    });
    
    function deleteNote(id, notesArray) {
        for (let i = 0; i < notesArray.length; i++) {
            let note = notesArray[i];
    
            if (note.id == id) {
                notesArray.splice(i, 1);
                fs.writeFileSync(
                    path.join(__dirname, attachNotes),
                    JSON.stringify(notesArray, null, 2)
                );
            }
        }
    }
    
    app.delete('/api/notes/:id', (req, res) => {
        deleteNote(req.params.id, attachNotes);
        res.json(true);
    });
    
    app.listen(PORT, () => {
        console.log(`API server now on port ${PORT}!`);
    });