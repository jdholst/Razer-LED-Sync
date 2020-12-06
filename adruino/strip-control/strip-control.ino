
#include <string.h>
#include <EEPROM.h>

#define EEPROM_BUFFER_SIZE 16

// EEPROM storage addresses
#define IS_ON 0
#define GREEN_INTENSITY 1
#define RED_INTENSITY 2
#define BLUE_INTENSITY 3
#define DEBUG_MODE 15

// pins that connect the led strip
#define RED_LED 6
#define BLUE_LED 5
#define GREEN_LED 9

// default initial state
int gBright = 0;
int rBright = 0;
int bBright = 0;
bool isOn = false;

void setup() {
  Serial.begin(9600);
  // put your setup code here, to run once:
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  
  initStoredState();
  
  Serial.println("ready");
}

void initStoredState() {
  gBright = EEPROM.read(GREEN_INTENSITY);
  rBright = EEPROM.read(RED_INTENSITY);
  bBright = EEPROM.read(BLUE_INTENSITY);
  isOn = EEPROM.read(IS_ON);

  if (isOn) {
    isOn = false;
    turnOn();
  }

  // debug-print the state
  Serial.print("Initalized with stored LED voltage state ");
  printState();
}

void printState() {
  Serial.print("G:");
  Serial.print(gBright, DEC);
  Serial.print(" R:");
  Serial.print(rBright, DEC);
  Serial.print(" B:");
  Serial.print(bBright, DEC);
  Serial.print(" IS_ON:");
  Serial.println(isOn, BIN);
}

void turnOn() {
  if (!isOn) {
    analogWrite(GREEN_LED, gBright);
    analogWrite(RED_LED, rBright);
    analogWrite(BLUE_LED, bBright);
    
    isOn = true;
    storeIsOnState();
  }
}

void turnOff() {
  if (isOn) {
    analogWrite(GREEN_LED, 0);
    analogWrite(RED_LED, 0);
    analogWrite(BLUE_LED, 0);

    isOn = false;
    storeIsOnState();
  }
}

void setLeds(int redIntensity, int greenIntensity, int blueIntensity) {
    rBright = redIntensity;
    gBright = greenIntensity;
    bBright = blueIntensity;
    
    if (isOn) {
      isOn = false;
      turnOn();
    }
    
    storeLedIntensities();
}

void storeLedIntensities() {
  store(GREEN_INTENSITY, (unsigned char)gBright);
  store(RED_INTENSITY, (unsigned char)rBright);
  store(BLUE_INTENSITY, (unsigned char)bBright);
}

void storeIsOnState() {
  store(IS_ON, isOn);
}

void store(int addr, unsigned char value) {
  if (addr >= EEPROM_BUFFER_SIZE) {
    Serial.print("Store error. Address 0x");
    Serial.print(addr, HEX);
    Serial.print(" exceeds eeprom buffer size");
    return;
  }
  EEPROM.update(addr, value);
}

void clearStore() {
  for (int address = 0; address < EEPROM_BUFFER_SIZE; address++) {
    store(address, 0);
  }
}

void loop() {

}

void serialEvent() {
  String readString;
  String cmd;

  // read any incoming commands
  while (Serial.available()) {
    char c = Serial.read();
    if (isControl(c)) break;
    readString += c;
    delay(1);
  }
  
  if (readString != "") {
    cmd = readString;
    processCommand(cmd);
  }
}

void processCommand(String cmd) {
  String tokens[16];
  tokenizeCommand(cmd, tokens);

  if (tokens[0] == "turn-on") {
    turnOn();
  } else if (tokens[0] == "turn-off") {
    turnOff();
  } else if (tokens[0] == "set-leds") {
    setLeds(tokens[1].toInt(), tokens[2].toInt(), tokens[3].toInt());
  } else if (tokens[0] == "clear-memory") {
    clearStore();
  } else if (tokens[0] == "print-state") {
    printState();
  } else {
    Serial.println("'" + tokens[0] + "' is an unrecognized command");
  }
  
}

void tokenizeCommand(String cmd, String* tokens) {
  char cmdStr[100];
  cmd.toCharArray(cmdStr, cmd.length() + 1);
  char* token = strtok(cmdStr, " ");

  int i = 0;
  while (token != NULL) {
    String tokenString = String(token);
    tokens[i] = tokenString;
    
    token = strtok(NULL, " ");
    i++;
  }
}
