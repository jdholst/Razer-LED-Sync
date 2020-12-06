const SerialPort = require('serialport');
SerialPort.parsers = {
  Readline: require('@serialport/parser-readline'),
}

function LEDStripController(comPath) {
  this.maxIntensity = 255;
  this.arduinoPort = new SerialPort(comPath, { baudRate: 9600 }, console.error);
  this.parser = new SerialPort.parsers.Readline();

  this.arduinoPort.pipe(this.parser);
}

LEDStripController.prototype = {
  sendCommand(command) {
    this.arduinoPort.write(`${command}\n`, err => {
      if (err) {
        console.error(err);
      } else {
        console.log(`command ${command} was sent`);
      }
    });
  },
  turnOn() {
    this.sendCommand('turn-on');
  },
  turnOff() {
    this.sendCommand('turn-off');
  },
  setLeds(redIntensity, greenIntensity, blueIntensity) {
    if (redIntensity > this.maxIntensity || greenIntensity > this.maxIntensity || blueIntensity > this.maxIntensity) {
      throw new Error(`Error setting leds: led intensity cannot exceed ${this.maxIntensity}`);
    }
    this.sendCommand(`set-leds ${redIntensity} ${greenIntensity} ${blueIntensity}`);
  },
  setDataListener(listener) {
    this.parser.on('data', listener);
  },
  destroy() {
    this.arduinoPort.destroy();
  }
};

module.exports = LEDStripController;

