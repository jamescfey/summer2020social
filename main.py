# current problem: the board doesn't revert to it's own
# state after requesting the state of the other board
stateCounter = 0
state = stateCounter % 3
strip = neopixel.create(DigitalPin.P2, 20, NeoPixelMode.RGB)

def on_received_number(receivedNumber):
    if (receivedNumber == 0):
        strip.show_color(neopixel.colors(NeoPixelColors.GREEN))
        strip.show()
    elif (receivedNumber == 1):
        strip.show_color(neopixel.colors(NeoPixelColors.YELLOW))
        strip.show()
    else:
        strip.show_color(neopixel.colors(NeoPixelColors.RED))
        strip.show()

def on_received_string(receivedString):
    if (receivedString == "send state"):
        send_state()

def on_button_pressed_a():
    global state, stateCounter
    state = stateCounter % 3
    stateCounter += 1 
    if (state == 0):
        strip.show_color(neopixel.colors(NeoPixelColors.GREEN))
        strip.show()
    elif (state == 1):
        strip.show_color(neopixel.colors(NeoPixelColors.YELLOW))
        strip.show()
    else:
        strip.show_color(neopixel.colors(NeoPixelColors.RED))
        strip.show()

def on_button_pressed_b():
    req_state() # request state of other device
    radio.on_received_number(on_received_number) # show state depending on number (state) received

def on_button_pressed_ab():
    strip.clear()
    strip.show()

def req_state():
    radio.send_string("send state")

def send_state():
    radio.send_number(state)

input.on_button_pressed(Button.A, on_button_pressed_a) 
input.on_button_pressed(Button.B, on_button_pressed_b)
input.on_button_pressed(Button.AB, on_button_pressed_ab)
radio.on_received_string(on_received_string) 