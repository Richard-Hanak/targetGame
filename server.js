const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8080;
const path = require('path')

app.use(express.static(path.join(__dirname, 'build')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const writeFile = newData => {
  const stringifiedData = JSON.stringify(newData);

  fs.writeFile("src/highScore.json", stringifiedData, error => {
    if (error) {
      console.log("Write: NOT successful!");
      console.log(error);
    } else {
      console.log("Write: successful!");
    }
  });
};

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get("/express_backend", (req, res) => {
  let rawdata = fs.readFileSync("src/highScore.json");
  let highScore = JSON.parse(rawdata);
  console.log(highScore);
  res.send(highScore);
});

app.post("/express_backend", (req, res) => {
  res.status(200).send({ status: "OK" });
  writeFile(req.body);
  res.end();
});
