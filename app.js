const express = require('express');
const port = process.env.port || 4546;
const app = express();
const router = require('./route/route');

app.use(express.json());
app.use('/api', router);

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})