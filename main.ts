//  current problem: the board doesn't revert to it's own
//  state after requesting the state of the other board
let stateCounter = 0
let state = stateCounter % 3
//  show state depending on number (state) received
function req_state() {
    radio.sendString("send state")
}

function send_state() {
    radio.sendNumber(state)
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    state = stateCounter % 3
    stateCounter += 1
    if (state == 0) {
        basic.showIcon(IconNames.Yes)
    } else if (state == 1) {
        basic.showIcon(IconNames.Meh)
    } else {
        basic.showIcon(IconNames.No)
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    req_state()
    //  request state of other device
    radio.onReceivedNumber(function on_received_number(receivedNumber: number) {
        if (receivedNumber == 0) {
            basic.showIcon(IconNames.Yes)
        } else if (receivedNumber == 1) {
            basic.showIcon(IconNames.Meh)
        } else {
            basic.showIcon(IconNames.No)
        }
        
    })
})
radio.onReceivedString(function on_received_string(receivedString: string) {
    if (receivedString == "send state") {
        send_state()
    }
    
})
