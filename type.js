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

activate application "Terminal"
type("mnp ${process.argv[2] || 'test-package'}")
delay 1
set the_string to "A test package to show the capabilities."
type(the_string)
`

spawn('osascript', ['-e', s])
