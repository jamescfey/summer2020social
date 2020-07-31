function displayState() {
    if (state == 0) {
        Free_Icon.showImage(0)
        Public_LEDs.showColor(Free_Color)
        if (Public_LEDs_On) {
            Private_LEDs.showColor(Free_Color)
            Private_LEDs2.showColor(Free_Color)
        }
        
    } else if (state == 1) {
        Busy_Icon.showImage(0)
        Public_LEDs.showColor(Busy_Color)
        if (Public_LEDs_On) {
            Private_LEDs.showColor(Busy_Color)
            Private_LEDs2.showColor(Busy_Color)
        }
        
    } else {
        Ask_Me_Icon.showImage(0)
        Public_LEDs.showColor(Ask_Me_Color)
        if (Public_LEDs_On) {
            Private_LEDs.showColor(Ask_Me_Color)
            Private_LEDs2.showColor(Ask_Me_Color)
        }
        
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
        displayState()
        case_ = 0
    }
    
})
function Customize() {
    
    Free_Icon = images.createImage(`
        . # # # .
        . # . . .
        . # # . .
        . # . . .
        . # . . .
        `)
    Free_Color = neopixel.colors(NeoPixelColors.Green)
    Busy_Icon = images.createImage(`
        . # # . .
        . # . # .
        . # # . .
        . # . # .
        . # # . .
        `)
    Busy_Color = neopixel.colors(NeoPixelColors.Red)
    Ask_Me_Icon = images.createImage(`
        . . # . .
        . # . # .
        # # # # #
        # . . . #
        # . . . #
        `)
    Ask_Me_Color = neopixel.colors(NeoPixelColors.Yellow)
    //  Turns on the ends of the LED strands.
    Public_LEDs_On = true
    //  Social Scarf Will automattically check if your friend is free based on your timer length and notify you
    Social_Scarf = true
    //  (In Minutes)
    //  Timer length is used to handle social scarf's auto ping or sporty scarfs reminder.
    Timer_length = 45
}

//  case 0 is base, case 1 is change personal state, case 2 is communicate
radio.onReceivedString(function on_received_string(receivedString: string) {
    
    if (receivedString == "You Free?") {
        if (state == 0) {
            radio.sendString("free")
        } else if (state == 1) {
            radio.sendString("busy")
        } else {
            strip.showRainbow(1, 360)
            basic.pause(2000)
            basic.showString(receivedString)
            case_ = 2
        }
        
    } else if (receivedString == "free" || receivedString == "busy") {
        basic.showString(receivedString)
        case_ = 0
    } else if (receivedString == "\"AutoPing\"") {
        if (state == 0) {
            radio.sendString("Autofree")
        } else if (state == 1) {
            radio.sendString("Autobusy")
        } else {
            radio.sendString("Autoask")
        }
        
    } else if (receivedString == "\"Autofree\"") {
        strip.showRainbow(1, 360)
        control.waitMicros(2000000)
        basic.showString("\"Your Friend is Free!\"")
        displayState()
    } else if (receivedString == "\"Autobusy\"") {
        
    } else if (receivedString == "\"Autoask\"") {
        strip.showRainbow(1, 360)
        control.waitMicros(2000000)
        basic.showString("\"Maybe check on your friend?\"")
        displayState()
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
        displayState()
        case_ = 0
    }
    
})
/** 

On Button A changes the mode as well as answers Yes when asked if free.

On Button B changes your interruption state if in mode 0 or pings the other person if in mode 1 as well as answers No when asked if free.

On radio received handles all potential messages 

DisplayState is called to show the leds depending on the interruption status

On shake clears the current LED status

On start sets up the LED zones as well as handles some timer stuff.


 */
input.onGesture(Gesture.Shake, function on_gesture_shake() {
    strip.clear()
})
let Social_Scarf = false
let Ask_Me_Color = 0
let Busy_Color = 0
let Public_LEDs_On = false
let Free_Color = 0
let Timer_length = 0
let Private_LEDs2 : neopixel.Strip = null
let Private_LEDs : neopixel.Strip = null
let Public_LEDs : neopixel.Strip = null
let strip : neopixel.Strip = null
let state = 0
let case_ = 0
let Ask_Me_Icon : Image = null
let Busy_Icon : Image = null
let Free_Icon : Image = null
Free_Icon = images.createImage(`
    . # # # .
    . # . . .
    . # # . .
    . # . . .
    . # . . .
    `)
Busy_Icon = images.createImage(`
    . # # . .
    . # . # .
    . # # . .
    . # . # .
    . # # . .
    `)
Ask_Me_Icon = images.createImage(`
    . . # . .
    . # . # .
    # # # # #
    # . . . #
    # . . . #
    `)
Customize()
let done = 0
case_ = 0
state = 0
strip = neopixel.create(DigitalPin.P2, 20, NeoPixelMode.RGB)
Public_LEDs = strip.range(8, 12)
Private_LEDs = strip.range(0, 7)
Private_LEDs2 = strip.range(13, 20)
let social_count = Timer_length * 60
//  Runs social scarf code in the background and sets the timer again (untested)
control.inBackground(function on_in_background() {
    
    if (Social_Scarf) {
        if (timeanddate.secondsSinceReset() == social_count) {
            radio.sendString("AutoPing")
            social_count = social_count / timeanddate.secondsSinceReset()
        }
        
    }
    
})
