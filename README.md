#Snake AI - Purdue SIGAI
This is Purdue SIGAI's implementation of a Snake AI. This is our Fall 2015 project.

##To get this onto your computer
```
cd sigai
git clone https://github.com/PurdueSIGAI/Snake.git
cd Snake/js
```

##Note on compatibility
On Purdue's Linux machines, it is suggested that you run the Snake AI in chromium with the developer tools open (I have no idea why having the developer tools open makes a difference, but it clearly does).
On OSX, simply using chrome appears to be OK.
We have not tested Windows yet.

Both Firefox and Safari consistantly have issues.

##TODO
###AI
1. Use the snake body information to take into account if the head of the snake will get to a point before or after the tail will move past it
2. Get stacking function working properly
3. Continue work on deciding which of the above to do

###Engine
1. Pass the snake body's linked list into the A.I.
2. Remove key listeners
3. Make snake blocks surrounded by black, not blue
4. Solve issue with calling me.go() multiple times.
