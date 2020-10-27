const express = require('express');
const port = 4545;
const app = express();
const router = require('./route/route');

app.use(express.json());
app.use('/api', router);

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})