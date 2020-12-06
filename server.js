const express = require('express');
const app = express();
const port = 3000;

const bodyparser = require('body-parser');
app.use(bodyparser.json());

const LEDStripController = require('./ledcontrol');
const ledControl = new LEDStripController('COM6');

const ChromaController = require('./chromacontrol');
const chromaControl = new ChromaController();

app.put('/lighting', (req, res) => {
  ledControl.setLeds(req.body.red, req.body.green, req.body.blue);
  chromaControl.setLeds(req.body.red, req.body.green, req.body.blue)
    .then(() => {
      ledControl.turnOn();
      res.sendStatus(204);
    }).catch(err => res.sendStatus(400).send(err));
});

app.put('/power-on', (req, res) => {
  ledControl.turnOn();
  chromaControl.turnOn();
  res.sendStatus(204);
});

app.put('/power-off', (_, res) => {
  chromaControl.turnOff().then(() => {
    ledControl.turnOff();
    res.sendStatus(204);
  }).catch(err => res.sendStatus(400).send(err));
});

app.listen(port, () => {
  console.log(`Razer LED Sync listening at http://localhost:${port}`)
});

process.on('SIGTERM', () => {
  ledControl.destroy();
  chromaControl.destroy();
});
