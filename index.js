const express = require('express');
const { crawlWebsite } = require('./crawler');

const app = express();
const PORT = 3000;

app.get('/login', async (req, res) => {
  const { username, password } = req.query;
  if (!username || !password) {
    return res.status(400).send({ error: 'Username and password are required.' });
  }

  try {
    const data = await crawlWebsite(username, password);
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch data' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
