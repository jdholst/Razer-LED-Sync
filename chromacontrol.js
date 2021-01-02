const options = require('./utils/cmdparser').getOptionArgs();
const ChromaSDK = require('./chroma_sdk/ChromaSDKImpl');
const redis = require('redis');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);

function ChromaController() {
  this.maxIntensity = 255;
  this.isOn = false;

  if (!options.noCache) {
    this.cache = redis.createClient();
    this.sessionStateKey = 'chroma-session';
  }
}

ChromaController.prototype = {
  async setLeds(redIntensity, greenIntensity, blueIntensity) {
    if (redIntensity > this.maxIntensity || greenIntensity > this.maxIntensity || blueIntensity > this.maxIntensity) {
      throw new Error(`Error setting leds: led intensity cannot exceed ${this.maxIntensity}`);
    }
    
    const chromaColor = redIntensity | greenIntensity << 8 | blueIntensity << 16;
    const effect = await this.chroma.preCreateMouseEffect('CHROMA_STATIC', chromaColor);

    this.currentEffect = effect; // cache effectId

    if (this.isOn) {
      await this.turnOn();
    }

    if (this.cache) {
      this.cache.hset(this.sessionStateKey, 'gInt', greenIntensity, 'rInt', redIntensity, 'bInt', blueIntensity);
    }

    return effect;
  },
  async turnOn(effectId) {
    if (effectId != null) {
      return await this.chroma.setEffect(effectId);
    }

    this.isOn = true;
    if (this.cache) {
      this.cache.hset(this.sessionStateKey, 'isOn', this.isOn);
    }

    if (this.currentEffect != null) {
      return await this.chroma.setEffect(this.currentEffect);
    }
  },
  async turnOff() {
    if (!this.noneEffect) {
      this.noneEffect = await this.chroma.preCreateMouseEffect('CHROMA_NONE');
    }

    this.isOn = false;
    if (this.cache) {
      this.cache.hset(this.sessionStateKey, 'isOn', this.isOn);
    }
    
    return await this.chroma.setEffect(this.noneEffect);
  },
  async init() {
    try {
      let previousState;
      let previousId;
      if (this.cache) {
        previousState = await this.cache.hgetallAsync(this.sessionStateKey);
        if (previousState) {
          previousId = previousState.id;
          this.isOn = previousState.isOn;
        }
      }

      this.chroma = new ChromaSDK(previousId);
      const newSessionId = await this.chroma.init();
      this.noneEffect = await this.chroma.preCreateMouseEffect('CHROMA_NONE');

      if (this.cache) {
        if (newSessionId !== previousId) {
          // if last chroma session is dead then set LEDs to cached LED state
          this.cache.hset(this.sessionStateKey, 'id', newSessionId);
          if (previousState) {
            // need to wait a second for chroma server to start up completely, otherwise device won't return to on state
            await new Promise(r => setTimeout(r, 1000));

            await this.setLeds(previousState.rInt || 0, previousState.gInt || 0, previousState.bInt || 0);
          }
        } else {
          console.log(`Last session ${previousId} is still alive!`);
        }
      }
    } catch(err) {
      return Promise.reject(err);
    }
  },
  destroy() {
    this.chroma.uninit();
  }
};

module.exports = ChromaController;
