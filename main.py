def displayState():
    if state == 0:
        Free_Icon.show_image(0)
        Public_LEDs.show_color(Free_Color)
        if Public_LEDs_On:
            Private_LEDs.show_color(Free_Color)
            Private_LEDs2.show_color(Free_Color)
    elif state == 1:
        Busy_Icon.show_image(0)
        Public_LEDs.show_color(Busy_Color)
        if Public_LEDs_On:
            Private_LEDs.show_color(Busy_Color)
            Private_LEDs2.show_color(Busy_Color)
    else:
        Ask_Me_Icon.show_image(0)
        Public_LEDs.show_color(Ask_Me_Color)
        if Public_LEDs_On:
            Private_LEDs.show_color(Ask_Me_Color)
            Private_LEDs2.show_color(Ask_Me_Color)
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
        displayState()
        case_ = 0
input.on_button_pressed(Button.A, on_button_pressed_a)

def Customize():
    global Free_Icon, Free_Color, Busy_Icon, Busy_Color, Ask_Me_Icon, Ask_Me_Color, Public_LEDs_On, Social_Scarf, Timer_length
    Free_Icon = images.create_image("""
        . # # # .
        . # . . .
        . # # . .
        . # . . .
        . # . . .
        """)
    Free_Color = neopixel.colors(NeoPixelColors.GREEN)
    Busy_Icon = images.create_image("""
        . # # . .
        . # . # .
        . # # . .
        . # . # .
        . # # . .
        """)
    Busy_Color = neopixel.colors(NeoPixelColors.RED)
    Ask_Me_Icon = images.create_image("""
        . . # . .
        . # . # .
        # # # # #
        # . . . #
        # . . . #
        """)
    Ask_Me_Color = neopixel.colors(NeoPixelColors.YELLOW)
    # Turns on the ends of the LED strands.
    Public_LEDs_On = True
    # Social Scarf Will automattically check if your friend is free based on your timer length and notify you
    Social_Scarf = True
    # (In Minutes)
    # Timer length is used to handle social scarf's auto ping or sporty scarfs reminder.
    Timer_length = 45
# case 0 is base, case 1 is change personal state, case 2 is communicate

def on_received_string(receivedString):
    global case_
    if receivedString == "You Free?":
        if state == 0:
            radio.send_string("free")
        elif state == 1:
            radio.send_string("busy")
        else:
            strip.show_rainbow(1, 360)
            basic.pause(2000)
            basic.show_string(receivedString)
            case_ = 2
    elif receivedString == "free" or receivedString == "busy":
        basic.show_string(receivedString)
        case_ = 0
    elif receivedString == "\"AutoPing\"":
        if state == 0:
            radio.send_string("Autofree")
        elif state == 1:
            radio.send_string("Autobusy")
        else:
            radio.send_string("Autoask")
    elif receivedString == "\"Autofree\"":
        strip.show_rainbow(1, 360)
        control.wait_micros(2000000)
        basic.show_string("\"Your Friend is Free!\"")
        displayState()
    elif receivedString == "\"Autobusy\"":
        pass
    elif receivedString == "\"Autoask\"":
        strip.show_rainbow(1, 360)
        control.wait_micros(2000000)
        basic.show_string("\"Maybe check on your friend?\"")
        displayState()
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
        displayState()
        case_ = 0
input.on_button_pressed(Button.B, on_button_pressed_b)

"""

On Button A changes the mode as well as answers Yes when asked if free.

On Button B changes your interruption state if in mode 0 or pings the other person if in mode 1 as well as answers No when asked if free.

On radio received handles all potential messages 

DisplayState is called to show the leds depending on the interruption status

On shake clears the current LED status

On start sets up the LED zones as well as handles some timer stuff.

"""

def on_gesture_shake():
    strip.clear()
input.on_gesture(Gesture.SHAKE, on_gesture_shake)

Social_Scarf = False
Ask_Me_Color = 0
Ask_Me_Icon: Image = None
Busy_Color = 0
Busy_Icon: Image = None
Public_LEDs_On = False
Free_Color = 0
Free_Icon: Image = None
Timer_length = 0
Private_LEDs2: neopixel.Strip = None
Private_LEDs: neopixel.Strip = None
Public_LEDs: neopixel.Strip = None
strip: neopixel.Strip = None
state = 0
case_ = 0
Customize()
done = 0
case_ = 0
state = 0
strip = neopixel.create(DigitalPin.P2, 20, NeoPixelMode.RGB)
Public_LEDs = strip.range(8, 12)
Private_LEDs = strip.range(0, 7)
Private_LEDs2 = strip.range(13, 20)
social_count = Timer_length * 60
# Runs social scarf code in the background and sets the timer again (untested)

def on_in_background():
    global social_count
    if Social_Scarf:
        if timeanddate.seconds_since_reset() == social_count:
            radio.send_string("AutoPing")
            social_count = social_count / timeanddate.seconds_since_reset()
control.in_background(on_in_background)
