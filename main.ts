//  shake turns off LED
//  board tilt to left makes you busy but ok to be interrupted 
//  board tilt to right shows other board's status
//  screen down makes you busy
//  screen up makes you available 
let state = 0
let strip = neopixel.create(DigitalPin.P2, 20, NeoPixelMode.RGB)
//  show state depending on number (state) received
function req_state() {
    radio.sendString("send state")
}

function send_state() {
    radio.sendNumber(state)
}

input.onGesture(Gesture.TiltLeft, function on_tilt_left() {
    
    state = 1
    strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
    strip.show()
})
input.onGesture(Gesture.ScreenUp, function on_screen_up() {
    
    state = 0
    strip.showColor(neopixel.colors(NeoPixelColors.Green))
    strip.show()
})
input.onGesture(Gesture.ScreenDown, function on_screen_down() {
    
    state = 2
    strip.showColor(neopixel.colors(NeoPixelColors.Red))
    strip.show()
})
input.onGesture(Gesture.TiltRight, function on_tilt_right() {
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
input.onGesture(Gesture.Shake, function on_shake() {
    strip.clear()
    strip.show()
})
radio.onReceivedString(function on_received_string(receivedString: string) {
    if (receivedString == "send state") {
        send_state()
    }
    
})
