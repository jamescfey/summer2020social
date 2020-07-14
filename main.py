# current problem: the board doesn't revert to it's own
# state after requesting the state of the other board
stateCounter = 0
state = stateCounter % 3

def on_received_number(receivedNumber):
    if (receivedNumber == 0):
        basic.show_icon(IconNames.YES)
    elif (receivedNumber == 1):
        basic.show_icon(IconNames.MEH)
    else:
        basic.show_icon(IconNames.NO)

def on_received_string(receivedString):
    if (receivedString == "send state"):
        send_state()

def on_button_pressed_a():
    global state, stateCounter
    state = stateCounter % 3
    stateCounter += 1 
    if (state == 0):
        basic.show_icon(IconNames.YES)
    elif (state == 1):
        basic.show_icon(IconNames.MEH)
    else:
        basic.show_icon(IconNames.NO)

def on_button_pressed_b():
    req_state() # request state of other device
    radio.on_received_number(on_received_number) # show state depending on number (state) received

def req_state():
    radio.send_string("send state")

def send_state():
    radio.send_number(state)

input.on_button_pressed(Button.A, on_button_pressed_a) 
input.on_button_pressed(Button.B, on_button_pressed_b)
radio.on_received_string(on_received_string)