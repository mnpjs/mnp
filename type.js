const { spawn } = require('child_process')

const s = `
on type(the_string)
  tell application "System Events"
    repeat with the_character in the_string
      keystroke the_character
      delay (random number from 0.05 to 0.10)
    end repeat
    key code 36
  end tell
end type

on typeInstant(the_string)
  tell application "System Events"
    keystroke the_string
    key code 36
  end tell
end type

activate application "Terminal"
type("mnp -I")
delay 0.5
typeInstant("1c3fa196701b45d66eea507082b1787f52d3d108")
delay 0.5
type("artdecocode")
delay 0.5
typeInstant("")
delay 0.5
typeInstant("")
delay 0.5
type("https://artdeco.bz")
delay 0.5
type("Art Deco Code Limited")
`
// type("mnp")
// set the_string to "A test package to show the capabilities."
// type(the_string)
spawn('osascript', ['-e', s])
