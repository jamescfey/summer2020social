//  current problem: the board doesn't revert to it's own
//  state after requesting the state of the other board
let stateCounter = 0
let state = stateCounter % 3
let strip = neopixel.create(DigitalPin.P2, 20, NeoPixelMode.RGB)
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
        strip.showColor(neopixel.colors(NeoPixelColors.Green))
        strip.show()
    } else if (state == 1) {
        strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
        strip.show()
    } else {
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        strip.show()
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    req_state()
    //  request state of other device
    radio.onReceivedNumber(function on_received_number(receivedNumber: number) {
        if (receivedNumber == 0) {
            strip.showColor(neopixel.colors(NeoPixelColors.Green))
            strip.show()
        } else if (receivedNumber == 1) {
            strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
            strip.show()
        } else {
            strip.showColor(neopixel.colors(NeoPixelColors.Red))
            strip.show()
        }
        
    })
})
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    strip.clear()
    strip.show()
})
radio.onReceivedString(function on_received_string(receivedString: string) {
    if (receivedString == "send state") {
        send_state()
    }
    
})
