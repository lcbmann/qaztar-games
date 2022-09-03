# lcbmann.github.io
# Aeneas
#### Video Demo:  https://youtu.be/hBIoqNyPg6M
#### Description:
Aeneas is a text-based game based on the story of The Aeneid by Virgil. You play as Aeneas, the captain of the remnant Trojan fleet, and you must make difficult decisions about what to do during difficult scenarios. Eventually, you must decide the land on which the final colony will be built. The better the land and the better you've managed your fleet's resources, the better your civilization will turn out.

The game begins by putting the player through an intro sequence, detailing Aeneas' escape from the burning city of Troy. As you move through the game, it sometimes will show the player direct quotes from The Aeneid that relates to their current situation. It also often shows Ascii-Art, a type of text-based art, to aid the imagination. After the intro, the player inspects their fleets, seeing its current level of resources. After this, the game generates the first land for the player to inspect - at each land, the player must decide based on their current resources and the state of the land whether they should found their colony and end the game. Land quality is random, but is weighted to be worse by default. After passing up on a land, the game will generate a "scenario" for the player. There are dozens of potential scenarios, some repeatable and some not. Each scenario requires the player to make a difficult choice. Some of the scnearios will grant the player a religious "boon", allowing them to find increasingly better lands as the game progresses.

The game has three main files: index.html, game.html, and game.js. index.html of course is the home-page, whereas the rest of the game takes place on one html page and with one page of JavaScript. 

game.js is extensive, with over 2000 lines of code. It contains functions such as startGame, inspectFleet, updateBoons, generateLand, and generateScenario. 

There were many challenges encountered while coding Aeneas. Scenarios were, without question, the most difficult thing to program correctly. Generating the "found a colony" screen was also difficult to implement properly. Looking back, there are a few things I would potentially do differently:
1. Split the code into different files
2. Find a better way to display the Ascii-Art
3. Find a better way to generate randomness, avoiding the usage of nested if-statements. 

The greatest challenge for me was tweaking the CSS and HTML to make the game playable on different resolutions. While I was ultimately successful, it still is not optimal, especially on phones. Most of the feedback I've gained from sharing the project online revolves around this issue. 

Aeneas is heavily inspired by Seedship by John Ayliff. 
