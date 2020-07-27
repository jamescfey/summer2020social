# shake turns off LED
# board tilt to left makes you busy but ok to be interrupted 
# board tilt to right shows other board's status
# screen down makes you busy
# screen up makes you available 

state = 0
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

def on_tilt_left():
    global state
    state = 1
    strip.show_color(neopixel.colors(NeoPixelColors.YELLOW))
    strip.show()

def on_screen_up():
    global state
    state = 0
    strip.show_color(neopixel.colors(NeoPixelColors.GREEN))
    strip.show()

def on_screen_down():
    global state
    state = 2
    strip.show_color(neopixel.colors(NeoPixelColors.RED))
    strip.show()

def on_tilt_right():
    req_state() # request state of other device
    radio.on_received_number(on_received_number) # show state depending on number (state) received

def on_shake():
    strip.clear()
    strip.show()

def req_state():
    radio.send_string("send state")

def send_state():
    radio.send_number(state)

input.on_gesture(Gesture.TILT_LEFT, on_tilt_left)
input.on_gesture(Gesture.SCREEN_UP, on_screen_up)
input.on_gesture(Gesture.SCREEN_DOWN, on_screen_down)
input.on_gesture(Gesture.TILT_RIGHT, on_tilt_right)
input.on_gesture(Gesture.SHAKE, on_shake)
radio.on_received_string(on_received_string)