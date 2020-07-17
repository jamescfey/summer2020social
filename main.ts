function displayState() {
    if (state == 0) {
        basic.showLeds(`
            . # # # .
            . # . . .
            . # # . .
            . # . . .
            . # . . .
            `)
        strip.showColor(neopixel.colors(NeoPixelColors.Green))
    } else if (state == 1) {
        basic.showLeds(`
            . # # . .
            . # . # .
            . # # . .
            . # . # .
            . # # . .
            `)
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
    } else {
        basic.showLeds(`
            . . # . .
            . # . # .
            # # # # #
            # . . . #
            # . . . #
            `)
        strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
    }
    
}

//  Case 0 is Ping, Case 1 is Set State
//  Switches Case or Sends Free if in case 2
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (case_ == 0) {
        case_ = 1
        displayState()
    } else if (case_ == 1) {
        case_ = 0
        basic.showIcon(IconNames.Fabulous)
    } else if (case_ == 2) {
        radio.sendString("free")
        case_ = 0
    }
    
})
//  case 0 is base, case 1 is change personal state, case 2 is communicate
radio.onReceivedString(function on_received_string(receivedString: string) {
    
    if (receivedString == "You Free?") {
        if (state == 0) {
            radio.sendString("free")
        } else if (state == 1) {
            radio.sendString("busy")
        } else {
            basic.showString(receivedString)
            case_ = 2
            strip.showBarGraph(radio.receivedPacket(RadioPacketProperty.SignalStrength), 255)
        }
        
    } else if (receivedString == "free" || receivedString == "busy") {
        basic.showString("?")
    }
    
})
//  Displays waiting icon until it receives a reply
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (case_ == 0) {
        basic.showIcon(IconNames.Surprised)
        radio.sendString("You Free?")
    } else if (case_ == 1) {
        state = (state + 1) % 3
        displayState()
    } else if (case_ == 2) {
        radio.sendString("busy")
        case_ = 0
    }
    
})
let strip : neopixel.Strip = null
let state = 0
let case_ = 0
let done = 0
case_ = 0
state = 0
strip = neopixel.create(DigitalPin.P2, 20, NeoPixelMode.RGB)
