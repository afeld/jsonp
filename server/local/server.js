const express = require('express');
const app = express();

app.use(express.static('../../dist/'));
app.use(
  express.static('./', {
    setHeaders: res => res.set('Service-Worker-Allowed', '/')
  })
);

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
