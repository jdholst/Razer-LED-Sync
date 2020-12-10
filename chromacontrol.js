const ChromaSDK = require('./chroma_sdk/ChromaSDKImpl');
const redis = require('redis');

function ChromaController() {
  this.maxIntensity = 255;
  this.cache = redis.createClient();
  this.cache.get('last-session-id', (err, id) => {
    this.chroma = new ChromaSDK(id);

    this.chroma.init().then(newSessionId => {
      if (newSessionId) {
        this.cache.set('last-session-id', newSessionId);
      } else {
        console.log(`Last session ${id} is still alive!`);
        this.cache.get('current-effect', (err, effect) => this.currentEffect = effect);
      }
    });
  });
}

ChromaController.prototype = {
  async setLeds(redIntensity, greenIntensity, blueIntensity) {
    if (redIntensity > this.maxIntensity || greenIntensity > this.maxIntensity || blueIntensity > this.maxIntensity) {
      throw new Error(`Error setting leds: led intensity cannot exceed ${this.maxIntensity}`);
    }
    
    const chromaColor = redIntensity | greenIntensity << 8 | blueIntensity << 16;
    const effect = await this.chroma.preCreateMouseEffect('CHROMA_STATIC', chromaColor);
    this.cache.set('current-effect', effect, (err, reply) => { 
      if (err) console.error(err);
      console.log(reply);
    })
    this.currentEffect = effect; // cache effectId
  },
  turnOn() {
    if (this.currentEffect != null) {
      this.chroma.setEffect(this.currentEffect);
    }
  },
  async turnOff() {
    const effect = await this.chroma.preCreateMouseEffect('CHROMA_NONE');
    this.chroma.setEffect(effect);
  },
  destroy() {
    this.chroma.uninit();
  }
};

module.exports = ChromaController;
