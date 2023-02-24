const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '63f77bc427bfe782aacf628e',
    // _id: '637bc427bfe782aacf628e',
  };
  next();
});
app.use(bodyParser.json());
async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect(URL);
    await app.listen(PORT);
    console.log('Server link:');
    console.log(URL);
  } catch (err) {
    console.log(err);
  }
}

connect();

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));
