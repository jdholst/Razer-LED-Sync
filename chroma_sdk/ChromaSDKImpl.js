// JavaScript source code
// modified to use axios

const axios = require('axios').default;

function ChromaSDK(previousSessionId) {
    var timerId;

    if (previousSessionId != null) {
        this.sessionId = previousSessionId;
        this.uri = `http://localhost:${previousSessionId}/chromasdk`;
    }
}

ChromaSDK.prototype = {
    init: function () { 
        return this.heartbeat()
            .catch(() => {
                console.log('Creating new chroma session');
                var data = {
                    "title": "Razer Chroma SDK Sample Application",
                    "description": "Razer Chroma SDK Sample Application",
                    "author": {
                        "name": "Chroma Developer",
                        "contact": "www.razerzone.com"
                    },
                    "device_supported": [
                        "keyboard",
                        "mouse",
                        "headset",
                        "mousepad",
                        "keypad",
                        "chromalink"],
                    "category": "application"
                };

                return axios.post("http://localhost:54235/razer/chromasdk", data, { responseType: 'json' })
                    .then(resp => {
                        this.uri = resp.data["uri"];
                        this.sessionId = resp.data['sessionid'];
                        return this.sessionId;
                    });
            }).then(() => {
                timerId = setInterval(() => {
                    // keep the session alive
                    this.heartbeat().catch(err => {
                        console.error(err.toString());
                        clearInterval(timerId);
                    });
                }, 10000);

                console.log('Listening to ChromaSDK Instance at ' + this.uri);
                return this.sessionId;
            });
    },
    uninit: function () {
        axios.delete(this.uri).then(resp => {
            console.log(resp.data);
        });

        clearInterval(timerId);
    },
    heartbeat: function() {
        return axios.put(this.uri + "/heartbeat").then(resp => {
            if (resp.status === 200) {
                console.log(resp.data);
            }
        });
    },
    createKeyboardEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj = { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM") {
            jsonObj = { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj = { "effect": effect, "param": color };
        } else if (effect == "CHROMA_CUSTOM_KEY") {
            jsonObj = { "effect": effect, "param": data };
        }

        console.log(jsonObj);

        axios.put(this.uri + "/keyboard", jsonObj, { responseType: 'json' }).then(resp => {
            console.log('createKeyboardEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
        });
    },
    preCreateKeyboardEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj =  { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM") {
            jsonObj =  { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj =  { "effect": effect, "param": color };
        } else if (effect == "CHROMA_CUSTOM_KEY") {
            jsonObj =  { "effect": effect, "param": data };
        }

        console.log(jsonObj);

        return axios.post(this.uri + "/keyboard", jsonObj, { responseType: 'json' }).then(resp => {
            console.log('preCreateKeyboardEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
            return resp.data['id'];
        });
    },
    createMousematEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj =  { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM") {
            jsonObj =  { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj =  { "effect": effect, "param": color };
        }

        console.log(jsonObj);

        axios.put(this.uri + "/mousepad", jsonObj, { responseType: 'json' }).then(resp => {
            console.log('createMousematEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
        });
    },
    preCreateMousematEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj =  { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM") {
            jsonObj =  { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj =  { "effect": effect, "param": color };
        }

        console.log(jsonObj);

        return axios.post(this.uri + "/mousepad", jsonObj, { responseType: 'json' }).then(resp => {
            console.log('preCreateMousematEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
            return resp.data['id'];
        });
    },
    createMouseEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj = { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM2") {
            jsonObj = { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj = { "effect": effect, "param": color };
        }

        console.log(jsonObj);

        axios.put(this.uri + "/mouse", jsonObj, { responseType: 'json' }) .then(resp => {
            console.log('createMouseEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
        }); 
    },
    preCreateMouseEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj =  { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM2") {
            jsonObj =  { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj =  { "effect": effect, "param": color };
        }

        console.log(jsonObj);

        return axios.post(this.uri + "/mouse", jsonObj, { responseType: 'json' }).then(resp => {
            console.log('preCreateMouseEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
            return resp.data['id'];
        }); 
    },
    createHeadsetEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj =  { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM") {
            jsonObj =  { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj =  { "effect": effect, "param": color };
        }

        console.log(jsonObj);

        axios.put(this.uri + "/headset", jsonObj, { responseType: 'json' }) .then(resp => {
            console.log('createHeadsetEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
        });
    },
    preCreateHeadsetEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj =  { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM") {
            jsonObj =  { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj =  { "effect": effect, "param": color };
        }

        console.log(jsonObj);

        return axios.post(this.uri + "/headset", jsonObj, { responseType: 'json' }).then(resp => {
            console.log('preCreateHeadsetEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
            return resp.data['id'];
        }); 
    },
    createKeypadEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj =  { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM") {
            jsonObj =  { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj =  { "effect": effect, "param": color };
        }

        console.log(jsonObj);

        axios.put(this.uri + "/keypad", jsonObj, { responseType: 'json' }) .then(resp => {
            console.log('createKeypadEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
        });
    },
    preCreateKeypadEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj =  { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM") {
            jsonObj =  { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj =  { "effect": effect, "param": color };
        }

        console.log(jsonObj);

        return axios.post(this.uri + "/keypad", jsonObj, { responseType: 'json' }).then(resp => {
            console.log('preCreateKeypadEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
            return resp.data['id'];
        });
    },
    createChromaLinkEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj =  { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM") {
            jsonObj =  { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj =  { "effect": effect, "param": color };
        }

        console.log(jsonObj);
        axios.put(this.uri + "/chromalink", jsonObj, { responseType: 'json' }) .then(resp => {
            console.log('createChromaLinkEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
        });
    },
    preCreateChromaLinkEffect: function (effect, data) {
        var jsonObj;

        if (effect == "CHROMA_NONE") {
            jsonObj =  { "effect": effect };
        } else if (effect == "CHROMA_CUSTOM") {
            jsonObj =  { "effect": effect, "param": data };
        } else if (effect == "CHROMA_STATIC") {
            var color = { "color": data };
            jsonObj =  { "effect": effect, "param": color };
        }

        console.log(jsonObj);

        return axios.post(this.uri + "/chromalink", jsonObj, { responseType: 'json' }).then(resp => {
            console.log('preCreateChromaLinkEffect(' + effect + ', ' + data + ') returns ' + resp.data['result']);
            return resp.data['id'];
        });
    },
    setEffect: function (id) {
        var jsonObj = { "id": id };

        console.log(jsonObj);

        return axios.put(this.uri + "/effect", jsonObj, { responseType: 'json' }).then(resp => {
            console.log('setEffect(' + id + ') returns ' + resp.data['result']);
            return resp.data['result'];
        });
    },
    deleteEffect: function (id) {
        var jsonObj =  { "id": id };

        console.log(jsonObj);

        axios.delete(this.uri + "/effect", { responseType: 'json', data: jsonObj }).then(resp => {
            console.log('deleteEffect(' + id + ') returns ' + resp.data['result']);
        });
    },
    deleteEffectGroup: function (ids) {
        var jsonObj = ids;

        console.log(jsonObj);
        axios.delete(this.uri + "/effect", { responseType: 'json', data: jsonObj }).then(resp => {
            console.log('deleteEffect(' + ids + ') returns ' + resp.data['result']);
        });
    }
}

module.exports = ChromaSDK;
