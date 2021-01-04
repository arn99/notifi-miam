const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
var cors = require('cors');
const port = process.env.port || 4546;
const app = express();
const router = require('./route/route');
const frontend = 'https://miam-bf.netlify.app'
app.use(express.json());
app.use(cors({origin: frontend}));
app.use('/api', router);

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})