# Razer LED Sync Project

The purpose of this project is to synchronize Razer Chroma supported gaming peripherals with LED strip lights connected to an arduino board. It will include an API to control the LED states of the connected devices and a webapp with a user interface that will provide an easy way to connect all LED devices and control their lighting.

## LED Strip Serial Commands
|Command| Arguments | Description
|--|--|--|
| set-leds | [red-volt] [green-volt] [blue-volt] | Stores the voltage level (represented as1 byte 0 -255) for each color LED |
| turn-on | -| Powers on the strip with the currently stored voltage levels |
| turn-off | -| Powers off the strip |
| print-state | - | Prints the voltage and 'on' state of the strip
| clear-memory |  - | Clears state from EEPROM
