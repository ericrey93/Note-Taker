const PORT = process.env.port || 3001;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const attachNotes = require('./Develop/db/db.json');
const api = require('./Develop/public/js/index');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', api);
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(attachNotes.slice(1))
})

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname,'./public/index.html')));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname,'./public/notes.html')));

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, './public/index.html')));


    function createNewNote(body, notesArray) {
        const newNote = body;
        if (!Array.isArray(notesArray))
            notesArray = [];
        
        if (notesArray.length === 0)
            notesArray.push(0);
    
        body.id = notesArray[0];
        notesArray[0]++;
    
        notesArray.push(newNote);
        fs.writeFileSync(
            path.join(__dirname, './Develop/db/db.json'),
            JSON.stringify(notesArray, null, 2)
        );
        return newNote;
    }
    
    app.post('/api/notes', (req, res) => {
        const newNote = createNewNote(req.body, attachNotes);
        res.json(newNote);
    });
    
    function deleteNote(id, notesArray) {
        for (let i = 0; i < notesArray.length; i++) {
            let note = notesArray[i];
    
            if (note.id == id) {
                notesArray.splice(i, 1);
                fs.writeFileSync(
                    path.join(__dirname, './Develop/db/db.json'),
                    JSON.stringify(notesArray, null, 2)
                );
    
                break;
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