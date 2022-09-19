const express = require('express');
const path = require('path');
const fs = require('fs');
const {v4 : uuidv4} = require('uuid');


const PORT = process.env.PORT || 3001;

const app = express();


//parsing JSON 
app.use(express.json());

app.use(express.static('public'));

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//Get the notes from db when loading notes page 
app.get('/api/notes', (req, res) => {
    var data = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8');
    res.json(JSON.parse(data));    
});


//Save Note to database
app.post('/api/notes',(req,res) => {
    const newdata = req.body;
    const data = fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8');    
    const currentdb = JSON.parse(data);
    //add unique id to the notes
    newdata.id = uuidv4();
    //console.log(newdata);
    currentdb.push(newdata);
    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'), JSON.stringify(currentdb), 
        (err) => err ? console.error(err) : console.log('data is written to file.')
    );
    res.status(200).json('success');
});

// GET Route for homepage
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
