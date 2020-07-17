def displayState():
    if state == 0:
        basic.show_leds("""
            . # # # .
            . # . . .
            . # # . .
            . # . . .
            . # . . .
            """)
        strip.show_color(neopixel.colors(NeoPixelColors.GREEN))
    elif state == 1:
        basic.show_leds("""
            . # # . .
            . # . # .
            . # # . .
            . # . # .
            . # # . .
            """)
        strip.show_color(neopixel.colors(NeoPixelColors.RED))
    else:
        basic.show_leds("""
            . . # . .
            . # . # .
            # # # # #
            # . . . #
            # . . . #
            """)
        strip.show_color(neopixel.colors(NeoPixelColors.YELLOW))
# Case 0 is Ping, Case 1 is Set State
# Switches Case or Sends Free if in case 2

def on_button_pressed_a():
    global case_
    if case_ == 0:
        case_ = 1
        displayState()
    elif case_ == 1:
        case_ = 0
        basic.show_icon(IconNames.FABULOUS)
    elif case_ == 2:
        radio.send_string("free")
        case_ = 0
input.on_button_pressed(Button.A, on_button_pressed_a)

# case 0 is base, case 1 is change personal state, case 2 is communicate

def on_received_string(receivedString):
    global case_
    if receivedString == "You Free?":
        if state == 0:
            radio.send_string("free")
        elif state == 1:
            radio.send_string("busy")
        else:
            basic.show_string(receivedString)
            case_ = 2
            strip.show_bar_graph(radio.received_packet(RadioPacketProperty.SIGNAL_STRENGTH),
                255)
    elif receivedString == "free" or receivedString == "busy":
        basic.show_string("?")
radio.on_received_string(on_received_string)

# Displays waiting icon until it receives a reply 

def on_button_pressed_b():
    global state, case_
    if case_ == 0:
        basic.show_icon(IconNames.SURPRISED)
        radio.send_string("You Free?")
    elif case_ == 1:
        state = (state + 1) % 3
        displayState()
    elif case_ == 2:
        radio.send_string("busy")
        case_ = 0
input.on_button_pressed(Button.B, on_button_pressed_b)

strip: neopixel.Strip = None
state = 0
case_ = 0
done = 0
case_ = 0
state = 0
strip = neopixel.create(DigitalPin.P2, 20, NeoPixelMode.RGB)