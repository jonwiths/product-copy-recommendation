const express = require('express');
const app = express();
require('dotenv').config();

// const cors = require('cors');

// app.use(cors());

app.use(express.json());

app.use('/chat-recommendation', require('./routes/chatRecommendation'));
app.use('/file-recommendation', require('./routes/fileRecommendation'));

app.listen(process.env.PORT, () =>
  console.log('Server is listening to port', process.env.PORT)
);
