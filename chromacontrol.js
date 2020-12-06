const ChromaSDK = require('./chroma_sdk/ChromaSDKImpl');
const redis = require('redis');

function ChromaController() {
  this.maxIntensity = 255;
  this.chroma  = new ChromaSDK();
  this.chroma.init();
  this.cache = redis.createClient();
}

ChromaController.prototype = {
  async setLeds(redIntensity, greenIntensity, blueIntensity) {
    if (redIntensity > this.maxIntensity || greenIntensity > this.maxIntensity || blueIntensity > this.maxIntensity) {
      throw new Error(`Error setting leds: led intensity cannot exceed ${this.maxIntensity}`);
    }
    
    const chromaColor = redIntensity | greenIntensity << 8 | blueIntensity << 16;
    const effect = await this.chroma.preCreateMouseEffect('CHROMA_STATIC', chromaColor);
    this.chroma.setEffect(effect);
    this.currentEffect = effect; // cache effectId
  },
  turnOn() {
    if (this.currentEffect != null) {
      this.chroma.setEffect(this.currentEffect);
    }
  },
  turnOff() {
    return this.chroma.preCreateMouseEffect('CHROMA_NONE').then(this.chroma.setEffect);
  },
  destroy() {
    this.chroma.uninit();
  }
};

module.exports = ChromaController;
