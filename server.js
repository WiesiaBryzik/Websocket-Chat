const express = require('express');
const app = express();
const path = require('path');


app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'));
  });
  
app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
})

app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
  });
