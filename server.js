const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// const Cat = mongoose.model('cat', catSchema);
app.listen(3000);
/*
mongoose.connect(`mongodb://$process.env.DB_USER}:${process.env.DB_PASS}@$process.env.DB_HOST}:${process.env.DB_PORT}/cat`).then(() => {
  console.log('Connected successfully.');
  app.listen(3000);
});*/
