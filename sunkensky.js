// Define a centralized costs object
const costs = {
    bucket: {
        baseWood: 10, // Base wood cost for the first bucket
        additionalCostPerBucket: 5, // Additional wood cost per subsequent bucket
    },
    rainBarrel: {
        wood: 30, // Fixed wood cost for rain barrel
        rope: 10, // Fixed rope cost for rain barrel
    },
    raft: {
        wood: 20, // Fixed wood cost for raft
        rope: 5,  // Fixed rope cost for raft
    },
    debrisNet: {
        baseRope: 15, // Base rope cost for the first debris net
        additionalCostPerNet: 15, // Additional rope cost for subsequent nets
    },
    storageUpgrade: {
        baseWood: 25, // Base wood cost for the first storage upgrade
        additionalCostPerUpgrade: 50, // Additional wood cost for each storage upgrade
    },
    flag: {
        wood: 50,
        rope: 35,
        fabric: 15,
    },
    mast: {
        wood: 150,
        rope: 60,
    },
    sails: {
        wood: 50,
        fabric: 30,
    },

};


// Game state variables
let gameState = {
    location: 'Below Deck',
    standAttempts: 0,
    locations: ['Below Deck', 'Above Deck'],
    discoveredLocations: ['Below Deck'], // Start with only 'Below Deck' discovered
    actionCooldowns: {}, // Store cooldowns for actions
    weather: 'windy', // Current weather
    storage: { wood: 2, rope: 2, food: 4, bucket: 0, fabric: 0 }, // Initial storage amounts, including buckets
    maxStorage: 150, // Maximum storage capacity
    inventory: { wood: 0, rope: 0, food: 0, fabric: 0 }, // Player's carry inventory
    discoveredResources: ['wood', 'rope', 'food'], // Initial resources discovered
    baseMaxInventory: 15, // Base max items player can carry
    maxInventory: 15, // Current max inventory, increases with buckets
    scavengeAttempts: 0, // Number of times scavenged
    maxScavengeAttempts: 25, // Max scavenge attempts
    inventoryVisible: false, // Inventory visibility flag
    storageVisible: false, // Storage visibility flag
    stamina: 100, // Player's starting stamina (out of 50)
    maxStamina: 100, // Current max stamina, increases with water
    staminaVisible: false, // Stamina bar visibility flag
    bucketCrafted: 0, // Number of buckets crafted
    bucketOptionAvailable: false, // Flag to show bucket crafting option
    rainBarrelCrafted: false, // Flag for rain barrel
    netsCrafted: 0,
    maxNetsCrafted: 3,
    netOptionAvailable: false,
    raftCrafted: false,
    raftPrompted: false,
    storageUpgrades: 0,
    storagePrompted: false,
    firstScavengeTime: null, // Time when player first scavenged
    thirstInterval: null, // Interval for decreasing stamina over time
    lightningInterval: null, // Interval for lightning effect
    headacheActive: true,
    letters: [
        '<i>You find a fragment of paper stuck to the side of the net. It appears to be extremely old. Only a few words remain legible.</i><br><br>"…do not listen, don’t you understand? They do not see. For many years we warned, but they closed their eyes. The cloud will consume all. The sky will sink from above…"',
        '<i>You find a fragment of paper stuck to the side of the net. It’s surprisingly intact, and appears almost embroidered with a golden filament.</i><br><br>"…expedition has been set to depart early next weekend. Captain Moresy has assured the Gazette that the mission is sure to be a success. As the path of artificial genetic variation has crumbled, only this option remains open to us. “Tragic, but necessary” declared Mayor Sinai as…"',
        '<i>You find a flat of bright bark stuck to the side of the net. Etched into its surface are letters, barely legible.</i><br><br>"…Flot A. Flot B -> over full. Take wood & rope tie together. Inform Cpt. Mads. Return sun down. "',
        '<i>You find a scrap of parchment stuck to the side of the net. Only one sentence remains legible.</i><br><br>"It\'s a world that God, if he exists, has created in anger."',
        '<i>You find a brittle scrap of paper wedged between the debris. The ink is smudged, but a few lines remain legible.</i><br><br>"...they call it the Great Escape, but its only a matter of time before this city falters. No one below will remember us, but they will see the ruins when we fall. The sky will turn dark, and there will be no escape."',
        '<i>A thin strip of tattered cloth, embroidered with silver thread, is tangled in the nets. Faint writing is woven into the fabric.</i><br><br>"..years we spent believing in the salvation above. Now, as the winds rise and our fleets scatter, the truth is clear. The sky was never meant for us. We should have stayed with the sea, where at least we could drown together."',
        '<i>A soaked page, almost dissolving in your hand, a few words still visible beneath the grime.</i><br><br>"...another storm. Supplies are low. Sails damaged. Moresy won\'t admit it, but we\'re lost. We\'ve passed the point of no return. If only we could return."',
        '<i>A scrap of parchment, unnaturally warm to the touch, flutters into your hands. The ink has faded, but a strange symbol remains at the top, and a few lines are still clear.</i><br><br>"...the cloud is alive. I felt it. A breath, a pulse."',
        '<i>A small, ornate scroll, likely torn from a journal, is caught in the debris. The handwriting is neat and imprecise, as though written in haste.</i><br><br>"We\'re not the first to attempt this. The journals we found on the wreck suggest others sought the city long before us. Their paths end in silence, just like ours will."',
        '<i>A small scroll of parchment, the edges singed, is caught in the net.</i><br><br>"Is the city real? Or nothing but a fanciful illusion, a dream? The answer has been lost to time."',
    
    
    ], 
    flagPrompted: false,
    flagCrafted: false,
    crew: [],
    maxCrew: 5,
    mastPrompted: false,
    mastCrafted: false,
    sailsPrompted: false,
    sailsCrafted: false,
    sailsAndMastCrafted: false,
    uniqueEventsTriggered: [],
};

const resources = ['wood', 'rope', 'food', 'fabric'];
const weatherOptions = ['windy', 'cloudy', 'rainy', 'stormy'];
let currentWeatherIndex = 0;

// Timed events
let headacheInterval = null;
let debrisNetInterval = null;

let bucketHintTimeout;
let rainBarrelHintTimeout;

// Action definitions
const actions = {
    'Stand up': {
        cooldown: 5,
        execute: standUpAction,
    },
    'Climb the stairs': {
        cooldown: 0,
        execute: climbStairsAction,
    },
    'Assess the situation': {
        cooldown: 0,
        execute: assessSituationAction,
    },
    'Scavenge debris': {
        cooldown: 1,
        execute: scavengeDebrisAction,
    },
    'Deposit items into storage': {
        cooldown: 0,
        execute: depositItemsAction,
    },
    'Eat food': {
        cooldown: 0,
        execute: eatFoodAction,
    },
    'Craft bucket': {
        cooldown: 0,
        execute: craftBucketAction,
    },
    'Craft rain barrel': {
        cooldown: 0,
        execute: craftRainBarrelAction,
    },
    'Collect water': {
        cooldown: 60, // Collect water every 60 seconds
        execute: collectWaterAction,
    },
    'Craft debris net': {
        cooldown: 0,
        execute: craftDebrisNetAction,
    },
    'Upgrade storage': {
        cooldown: 0,
        execute: upgradeStorageAction,
    },
    'Scavenge at sea': {
        cooldown: 1, // Add a cooldown if desired
        execute: scavengeAtSeaAction, // Define the action here
    },
    'Craft raft': { 
        cooldown: 0,
        execute: craftRaftAction,
    },
    'Craft flag' : {
        cooldown: 0,
        execute: craftFlagAction,
    },
    'Repair mast' : {
        cooldown: 0,
        execute: repairMastAction,
    },
    'Repair sails' : {
        cooldown: 0,
        execute: repairSailsAction,
    },
};

const eventList = [
    // Regular Events
    {
        name: 'Wandering Trader',
        type: 'regular',
        handler: wanderingTraderEvent,
    },
    {
        name: 'Smoke Signal',
        type: 'regular',
        handler: smokeSignalEvent,
    },
    {
        name: 'Shipwreck Found',
        type: 'regular',
        handler: shipwreckFoundEvent,
    },
    {
        name: 'Rogue Wave',
        type: 'regular',
        handler: rogueWaveEvent,
    },
    
    // Unique Events
    {
        name: 'Flotilla Encounter',
        type: 'unique',
        handler: flotillaEncounterEvent,
    },
];



// Initialize the game
function startGame() {
    // Apply the initial location class based on gameState.location
    applyLocationClass(gameState.location);

    updateLocationDisplay();
    startWeatherCycle();
    updateStylesBasedOnWeather();
    startHeadacheMessage();
    startStaminaRegeneration();
    startMaxStaminaDecay(); // Start the decay for max stamina

    setTimeout(() => addMessage('Your head is pounding.', true), 2000);
    setTimeout(() => addMessage('The ship creaks.'), 6000);

    setTimeout(() => addActionButton('Stand up'), 8000);
}

// Helper function to apply location class to body
function applyLocationClass(location) {
    const body = document.body;
    body.classList.remove('above-deck', 'below-deck'); // Remove existing classes

    if (location === 'Above Deck') {
        body.classList.add('above-deck');
    } else if (location === 'Below Deck') {
        body.classList.add('below-deck');
    }
}


// Function to update the location display
function updateLocationDisplay() {
    const locationElement = document.getElementById('location');
    locationElement.innerHTML = ''; // Clear previous content

    gameState.discoveredLocations.forEach((loc) => {
        const locElement = document.createElement('span');
        locElement.textContent = loc;
        locElement.className = 'location-name';
        if (loc === gameState.location) {
            locElement.classList.add('current-location');
        }
        locElement.onclick = () => switchLocation(loc);
        locationElement.appendChild(locElement);
    });

    // Trigger fade-in effect after appending the content
    requestAnimationFrame(() => {
        locationElement.classList.add('visible'); // Apply visible class for fade-in
    });
}

// Function to update styles based on weather
function updateStylesBasedOnWeather() {
    const body = document.body;

    // Set the data attribute on the body based on the weather
    body.setAttribute('data-weather', gameState.weather);

    if (gameState.location === 'Above Deck') {
        switch (gameState.weather) {
            case 'windy':
            case 'cloudy':
            case 'rainy':
                stopLightningEffect(); // Stop lightning if it's no longer stormy
                break;
            case 'stormy':
                startLightningEffect(); // Enable lightning effect for stormy weather
                break;
        }
    }
}


// Function to start the weather cycle
function startWeatherCycle() {
    setInterval(() => {
        currentWeatherIndex = (currentWeatherIndex + 1) % weatherOptions.length;
        gameState.weather = weatherOptions[currentWeatherIndex];

        if (gameState.location === 'Above Deck') {
            updateStylesBasedOnWeather();
            displayWeatherMessage();
        }
    }, 180000); // Change every 3 minutes
}

// Function to display weather messages
function displayWeatherMessage() {
    if (gameState.weather === 'windy') {
        addMessage('Thin clouds line the sky. The wind blows relentlessly.');
    } else if (gameState.weather === 'cloudy') {
        addMessage('Gray clouds cover the sky.');
    } else if (gameState.weather === 'rainy') {
        addMessage('Rain pours down relentlessly.');
    } else if (gameState.weather === 'stormy') {
        addMessage('A fierce storm rages around you.');
    }
}

// Function to start lightning effect during stormy weather
function startLightningEffect() {
    const body = document.body;

    // Clear any existing intervals to prevent multiple intervals running
    if (gameState.lightningInterval) {
        clearInterval(gameState.lightningInterval);
    }

    gameState.lightningInterval = setInterval(() => {
        // Add a temporary class to trigger the flash
        body.classList.add('lightning-flash');

        // Remove the class after the flash duration
        setTimeout(() => {
            body.classList.remove('lightning-flash');
        }, 100); // Flash duration of 100ms
    }, Math.random() * 5000 + 2000); // Random interval between 2-7 seconds
}

// Function to stop lightning effect
function stopLightningEffect() {
    if (gameState.lightningInterval) {
        clearInterval(gameState.lightningInterval);
        gameState.lightningInterval = null;
    }

    // Ensure the lightning-flash class is removed
    document.body.classList.remove('lightning-flash');
}


// Function to add a message to the message list
function addMessage(text, isBold = false) {
    const messagesContainer = document.getElementById('messages');

    // Create the new message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = text;
    messageElement.style.opacity = 0; // Start with opacity 0

    // Apply bold style if isBold is true
    if (isBold) {
        messageElement.style.fontWeight = 'bold';
    }

    // Insert the new message at the top
    messagesContainer.insertBefore(messageElement, messagesContainer.firstChild);

    // Force reflow to register the initial opacity
    getComputedStyle(messageElement).opacity;

    // Trigger the fade-in effect
    messageElement.style.opacity = 1;

    // Wait for the message to render to get its height
    requestAnimationFrame(() => {
        const newMessageHeight = messageElement.offsetHeight + 10; // Include margin-bottom

        // Move existing messages down
        const messages = Array.from(messagesContainer.children);
        messages.forEach((msg) => {
            if (msg !== messageElement) {
                const currentTop = parseFloat(msg.style.top) || 0;
                msg.style.top = currentTop + newMessageHeight + 'px';
            }
        });

        // Remove messages that have moved beyond the bottom
        const containerHeight = document.getElementById('game-area').clientHeight;
        messages.forEach((msg) => {
            const msgTop = parseFloat(msg.style.top) || 0;
            if (msgTop >= containerHeight) {
                messagesContainer.removeChild(msg);
            }
        });

        // Ensure the new message is at the top
        messageElement.style.top = '0px';
    });
}


function addActionButton(actionName) {
    const action = actions[actionName];
    if (!action) return;

    // Update the list of above-deck-only actions to include new crafting options
    const aboveDeckOnlyActions = ['Craft flag', 'Repair Mast', 'Repair Sails'];
    if (aboveDeckOnlyActions.includes(actionName) && gameState.location !== 'Above Deck') {
        return; // Do not add the button if not above deck
    }

    const actionsContainer = document.getElementById('actions');
    const existingButton = Array.from(actionsContainer.children).find(
        (btnContainer) => btnContainer.getAttribute('data-action') === actionName
    );
    if (existingButton) return;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'action-button-container';
    buttonContainer.setAttribute('data-action', actionName);

    const button = document.createElement('button');
    button.textContent = actionName;

    const cooldownOverlay = document.createElement('div');
    cooldownOverlay.className = 'cooldown-overlay';
    cooldownOverlay.style.width = '0%';
    button.appendChild(cooldownOverlay);

    // Handle cost display if needed
    const costElement = document.createElement('div');
    costElement.className = 'cost';

    // Define costs for each action
    if (actionName === 'Craft bucket') {
        const currentBucketCost = costs.bucket.baseWood + (gameState.bucketCrafted * costs.bucket.additionalCostPerBucket);
        costElement.textContent = `Cost: ${currentBucketCost} wood`;
    } else if (actionName === 'Craft rain barrel') {
        costElement.textContent = `Cost: ${costs.rainBarrel.wood} wood, ${costs.rainBarrel.rope} rope`;
    } else if (actionName === 'Craft raft') {
        costElement.textContent = `Cost: ${costs.raft.wood} wood, ${costs.raft.rope} rope`;
    } else if (actionName === 'Craft debris net') {
        const currentNetCost = costs.debrisNet.baseRope + (gameState.netsCrafted * costs.debrisNet.additionalCostPerNet);
        costElement.textContent = `Cost: ${currentNetCost} rope`;
    } else if (actionName === 'Upgrade storage') {
        const currentUpgradeCost = costs.storageUpgrade.baseWood + (gameState.storageUpgrades * costs.storageUpgrade.additionalCostPerUpgrade);
        costElement.textContent = `Cost: ${currentUpgradeCost} wood`;
    } else if (actionName === 'Craft flag') { // Handle flag costs
        costElement.textContent = `Cost: ${costs.flag.wood} wood, ${costs.flag.rope} rope, ${costs.flag.fabric} fabric`;
    } else if (actionName === 'Repair mast') { // Handle Repair Mast costs
        costElement.textContent = `Cost: ${costs.mast.wood} wood, ${costs.mast.rope} rope`;
    } else if (actionName === 'Repair sails') { // Handle Repair Sails costs
        costElement.textContent = `Cost: ${costs.sails.fabric} fabric, ${costs.sails.wood} wood`;
    }

    buttonContainer.appendChild(button);
    if (costElement.textContent) {
        buttonContainer.appendChild(costElement);
    }

    actionsContainer.appendChild(buttonContainer);

    setTimeout(() => {
        buttonContainer.classList.add('visible');
    }, 50);

    button.onclick = () => {
        const lastUsed = gameState.actionCooldowns[actionName];
        const now = Date.now();
        if (lastUsed && now - lastUsed < action.cooldown * 1000) {
            return;
        }

        if (action.cooldown > 0) {
            gameState.actionCooldowns[actionName] = now;
            startCooldown(button, action.cooldown);
        }

        action.execute();
        if (actionName === 'Assess the situation') {
            buttonContainer.remove();
        }
    };

    // Re-apply cooldown if it exists
    const lastUsed = gameState.actionCooldowns[actionName];
    if (lastUsed) {
        const now = Date.now();
        if (now - lastUsed < action.cooldown * 1000) {
            startCooldown(button, action.cooldown);
        }
    }

    // Update costs dynamically if necessary
    updateActionButtonCosts();
}






function updateActionButtonCosts() {
    // Craft Bucket
    const bucketButton = document.querySelector('[data-action="Craft bucket"] .cost');
    if (bucketButton) {
        if (gameState.bucketCrafted >= 5) {
            bucketButton.textContent = 'You cannot carry any more buckets.';
            bucketButton.style.color = 'red';
        } else {
            const currentBucketCost = costs.bucket.baseWood + (gameState.bucketCrafted * costs.bucket.additionalCostPerBucket);
            bucketButton.textContent = `Cost: ${currentBucketCost} wood`;
        }
    }

    // Craft Rain Barrel
    const rainBarrelButton = document.querySelector('[data-action="Craft rain barrel"] .cost');
    if (rainBarrelButton) {
        rainBarrelButton.textContent = `Cost: ${costs.rainBarrel.wood} wood, ${costs.rainBarrel.rope} rope`;
    }

    // Craft Debris Net
    const debrisNetButton = document.querySelector('[data-action="Craft debris net"] .cost');
    if (debrisNetButton) {
        if (gameState.netsCrafted >= gameState.maxNetsCrafted) {
            debrisNetButton.textContent = 'You cannot carry any more nets.';
            debrisNetButton.style.color = 'red';
        } else {
            const currentNetCost = costs.debrisNet.baseRope + (gameState.netsCrafted * costs.debrisNet.additionalCostPerNet);
            debrisNetButton.textContent = `Cost: ${currentNetCost} rope`;
        }
    }

    // Upgrade Storage
    const storageUpgradeButton = document.querySelector('[data-action="Upgrade storage"] .cost');
    if (storageUpgradeButton) {
        const currentUpgradeCost = costs.storageUpgrade.baseWood + (gameState.storageUpgrades * costs.storageUpgrade.additionalCostPerUpgrade);
        storageUpgradeButton.textContent = `Cost: ${currentUpgradeCost} wood`;
    }

    // Craft Raft
    const raftButton = document.querySelector('[data-action="Craft raft"] .cost');
    if (raftButton) {
        raftButton.textContent = `Cost: ${costs.raft.wood} wood, ${costs.raft.rope} rope`;
    }

    // Craft Flag
    const flagButton = document.querySelector('[data-action="Craft flag"] .cost');
    if (flagButton) {
        flagButton.textContent = `Cost: ${costs.flag.wood} wood, ${costs.flag.rope} rope, ${costs.flag.fabric} fabric`;
    }

    // Repair Mast
    const repairMastButton = document.querySelector('[data-action="Repair mast"] .cost');
    if (repairMastButton) {
        repairMastButton.textContent = `Cost: ${costs.mast.wood} wood, ${costs.mast.rope} rope`;
    }

    // Repair Sails
    const repairSailsButton = document.querySelector('[data-action="Repair sails"] .cost');
    if (repairSailsButton) {
        repairSailsButton.textContent = `Cost: ${costs.sails.fabric} fabric, ${costs.sails.wood} wood`;
    }
}




function getRandomLetter() {
    if (gameState.letters.length === 0) {
        return null; // No letters left to find
    }

    // Generate a random index based on the current letters array length
    const randomIndex = Math.floor(Math.random() * gameState.letters.length);
    const selectedLetter = gameState.letters[randomIndex];

    // Remove the selected letter from the array to prevent reuse
    gameState.letters.splice(randomIndex, 1);

    return selectedLetter;
}



// Function to handle button cooldown visualization
function startCooldown(button, cooldownSeconds) {
    button.disabled = true;

    const cooldownOverlay = button.querySelector('.cooldown-overlay');
    const now = Date.now();
    const timeRemaining = Math.max(0, cooldownSeconds - Math.floor((now - gameState.actionCooldowns[button.textContent]) / 1000));

    if (cooldownOverlay) {
        cooldownOverlay.style.transition = 'none';
        cooldownOverlay.style.width = '100%';
        cooldownOverlay.style.opacity = 1;

        cooldownOverlay.offsetWidth;

        cooldownOverlay.style.transition = `width ${timeRemaining}s linear`;
        cooldownOverlay.style.width = '0%';

        cooldownOverlay.addEventListener('transitionend', function handler() {
            button.disabled = false;
            cooldownOverlay.style.opacity = 0;
            cooldownOverlay.style.width = '0%';
            cooldownOverlay.style.transition = '';
            cooldownOverlay.removeEventListener('transitionend', handler);
        });
    }

    setTimeout(() => {
        button.disabled = false;
    }, timeRemaining * 1000);
}


// Function to clear all action buttons
function clearActionButtons() {
    const actionsContainer = document.getElementById('actions');
    actionsContainer.innerHTML = '';
}


function startHeadacheMessage() {
    // Prevent multiple intervals
    if (headacheInterval) return;
    
    // Only schedule if headacheActive is true
    if (gameState.headacheActive) {
        headacheInterval = setInterval(() => {
            addMessage('Your head is pounding.');
        }, 180000); // Every 3 minutes
    }
}

function stopHeadacheMessage() {
    if (headacheInterval) {
        clearInterval(headacheInterval);
        headacheInterval = null;
    }
    gameState.headacheActive = false;
}

// Function to show an alert
function showAlert(message, buttons = []) {
    const alertModal = document.getElementById('alert-modal');
    const alertMessage = document.getElementById('alert-message');
    const alertButtonsContainer = document.getElementById('alert-buttons');

    // Set the alert message using innerHTML to allow HTML formatting
    alertMessage.innerHTML = message;

    // Clear existing buttons
    alertButtonsContainer.innerHTML = '';

    // Create buttons
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.textContent = button.text;
        btn.onclick = () => {
            // Execute the callback
            if (button.callback && typeof button.callback === 'function') {
                button.callback();
            }
            // Hide the alert after clicking a button
            hideAlert();
        };
        alertButtonsContainer.appendChild(btn);
    });

    // Show the alert modal
    alertModal.classList.remove('hidden');
    alertModal.classList.add('visible');

    // Prevent background scroll
    document.body.classList.add('no-scroll');
}

function hideAlert() {
    const alertModal = document.getElementById('alert-modal');
    alertModal.classList.remove('visible');
    alertModal.classList.add('hidden');

    // Allow background scroll
    document.body.classList.remove('no-scroll');
}


// Function to start stamina regeneration
function startStaminaRegeneration() {
    setInterval(() => {
        if (gameState.stamina < gameState.maxStamina) {
            changeStamina(1);
        }
    }, 10000);  
}

// Action implementations
function standUpAction() {
    gameState.standAttempts += 1;

    if (gameState.standAttempts === 1) {
        addMessage('You try to stand, but collapse back onto the floor.');
    } else if (gameState.standAttempts === 2) {
        addMessage("You struggle to your knees. The world spins.");
    } else if (gameState.standAttempts >= 3) {
        addMessage('You stand, wobble, and steady yourself.');
        setTimeout(() => addMessage('You see a staircase leading up into the light.'), 2000);
        clearActionButtons();
        setTimeout(() => addActionButton('Climb the stairs'), 2000);
    }
}

function climbStairsAction() {
    addMessage('You slowly make your way up the stairs.');
    
    // Use switchLocation to handle the location change
    switchLocation('Above Deck');
    
    // Add "Assess the situation" action after 2 seconds
    setTimeout(() => addActionButton('Assess the situation'), 2000);
}

function assessSituationAction() {
    setTimeout(() => addMessage('Debris covers the deck in every direction.'), 1000);
    setTimeout(() => addMessage('The mast is in pieces. The sails are torn.'), 3000);
    setTimeout(() => addMessage('The world is shrouded in cloud. The sea stretches forever in all directions.'), 5000);
    setTimeout(() => addMessage('You are alone.'), 7000);

    // After assessing, set inventory and storage to visible
    setTimeout(() => {
        gameState.inventoryVisible = true;
        gameState.storageVisible = true;
        gameState.staminaVisible = true;
        updateInventoryDisplay();
        updateStorageDisplay();
        updateStaminaBar();

        // After assessing, add "Scavenge debris" action
        addActionButton('Scavenge debris');
        addActionButton('Eat food');
    }, 9000);
}

function scavengeDebrisAction() {
    if (gameState.scavengeAttempts >= gameState.maxScavengeAttempts) {
        addMessage('The deck is now clean. There is no more debris to scavenge.', true);
        setTimeout(() => addMessage('There is more debris floating in the sea surrounding the ship. You will need to craft a raft to reach it.', true), 2000);
        addActionButton('Craft raft');
        gameState.raftPrompted = true;

        // **Remove "Scavenge debris" button**
        const actionsContainer = document.getElementById('actions');
        const scavengeButton = actionsContainer.querySelector('[data-action="Scavenge debris"]');
        if (scavengeButton) {
            scavengeButton.remove();
        }

        return;
    }

    // Check if the player has enough stamina
    if (gameState.stamina < 10) {
        addMessage('You are too exhausted to scavenge. You need to eat food or rest.');
        return;
    }

    // Check if the inventory is full
    const totalInventory = getTotalItems(gameState.inventory);
    const spaceLeft = gameState.maxInventory - totalInventory;

    if (spaceLeft <= 0) {
        addMessage('Your inventory is full. You need to deposit items below deck.');
        return;
    }

    // Decrease stamina
    changeStamina(-10); // Directly subtract 10 stamina here

    // Record first scavenge time, and set up bucket hint if not already set
    if (!gameState.firstScavengeTime) {
        gameState.firstScavengeTime = Date.now();

        // Schedule bucket hint after 1 minute of scavenging
        bucketHintTimeout = setTimeout(() => {
            addMessage('A bucket could be useful. It would help you carry more items.', true);
            gameState.bucketOptionAvailable = true;
            if (gameState.location === 'Below Deck') {
                addActionButton('Craft bucket');
            }
        }, 30000); // After 30 secs
    }

    gameState.scavengeAttempts += 1;

    // Random amounts between 1 and 3
    const woodFound = Math.floor(Math.random() * 3) + 3;
    const ropeFound = Math.floor(Math.random() * 3) + 1;
    const foodFound = Math.floor(Math.random() * 3) + 0;

    // Adjust items to fit inventory space
    const proportions = distributeItems([woodFound, ropeFound, foodFound], spaceLeft);
    const collectedWood = proportions[0];
    const collectedRope = proportions[1];
    const collectedFood = proportions[2];

    gameState.inventory.wood += collectedWood;
    gameState.inventory.rope += collectedRope;
    gameState.inventory.food += collectedFood;

    // Display the collected message only if the player finds something
    if (collectedWood > 0 || collectedRope > 0 || collectedFood > 0) {
        addMessage(`You scavenge some debris and find ${collectedWood} wood, ${collectedRope} rope, and ${collectedFood} food.`);
    } else {
        addMessage('You found debris but cannot carry more items. Deposit items below deck.');
    }

    const findNoteChance = 0.05; // 5% probability
    if (Math.random() < findNoteChance) {
        const letter = getRandomLetter();
        if (letter) {
            showAlert(`${letter}`, [
                {
                    text: 'Close',
                    callback: () => {
                        addMessage('You decide to leave the note undisturbed.');
                    }
                }
            ]);
        } 
    }

    updateInventoryDisplay();

    if (gameState.scavengeAttempts >= gameState.maxScavengeAttempts) {
        addMessage('The deck is now clean.', true);
        addMessage('There is more debris floating in the sea surrounding the ship. You will need to craft a raft to reach it.', true);
        addActionButton('Craft raft');
        gameState.raftPrompted = true;
    }
}


function scavengeAtSeaAction() {
    if (gameState.stamina < 15) {
        addMessage('You are too exhausted to scavenge at sea. You need to eat food or rest.');
        return;
    }

    // Check if the inventory is full
    const totalInventory = getTotalItems(gameState.inventory);
    const spaceLeft = gameState.maxInventory - totalInventory;

    if (spaceLeft <= 0) {
        addMessage('Your inventory is full. You need to deposit items below deck.');
        return;
    }

    // Decrease stamina
    changeStamina(-15); // Subtract 15 stamina for scavenging at sea

    // Random amounts
    const woodFound = Math.floor(Math.random() * 4) + 8;  
    const ropeFound = Math.floor(Math.random() * 3) + 4;  
    const foodFound = Math.floor(Math.random() * 3) + 0;  
    const fabricFound = Math.floor(Math.random() * 2) + 1; 

    if(fabricFound > 0 && !gameState.flagPrompted && !gameState.flagCrafted) {
        gameState.flagPrompted = true;
        setTimeout(() => {
            addMessage('Crafting a flag could help you communicate and find other sailors.', true);
            // Only add the "Craft flag" button if the player is Above Deck
            if (gameState.location === 'Above Deck') {
                addActionButton('Craft flag');
            }
        }, 2000); // 2 seconds delay before prompting
    }

    // Adjust items to fit inventory space
    const proportions = distributeItems([woodFound, ropeFound, foodFound, fabricFound], spaceLeft);
    const collectedWood = proportions[0];
    const collectedRope = proportions[1];
    const collectedFood = proportions[2];
    const collectedFabric = proportions[3];

    // Add collected items to inventory
    gameState.inventory.wood += collectedWood;
    gameState.inventory.rope += collectedRope;
    gameState.inventory.food += collectedFood;
    gameState.inventory.fabric += collectedFabric;

    // If fabric is collected for the first time, add it to discoveredResources
    if (collectedFabric > 0 && !gameState.discoveredResources.includes('fabric')) {
        gameState.discoveredResources.push('fabric');
        addMessage('High-quality fabric could be useful for crafting.', true);
        updateInventoryDisplay();
        updateStorageDisplay();
    }

    // Display the collected message or notify if inventory is full
    if (collectedWood > 0 || collectedRope > 0 || collectedFood > 0 || collectedFabric > 0) {
        let message = `You scavenge the sea and find ${collectedWood} wood, ${collectedRope} rope, ${collectedFood} food`;
        if (collectedFabric > 0) message += `, and ${collectedFabric} fabric`;
        message += '.';
        addMessage(message);
    } else {
        addMessage('You found debris in the sea, but your inventory is full. Deposit items below deck.');
    }

    const findNoteChance = 0.1; // 10% probability
    if (Math.random() < findNoteChance) {
        const letter = getRandomLetter();
        if (letter) {
            showAlert(`${letter}`, [
                {
                    text: 'Close',
                    callback: () => {
                        addMessage('You decide to leave the note undisturbed.');
                    }
                }
            ]);
        } 
    }

    updateInventoryDisplay();
}







function depositItemsAction() {
    // Check if inventory is empty
    const totalInventory = getTotalItems(gameState.inventory);
    if (totalInventory === 0) {
        addMessage('You have nothing to deposit.');
        return;
    }

    // Calculate total items in storage
    const totalStorage = getTotalItems(gameState.storage);
    const storageSpaceLeft = gameState.maxStorage - totalStorage;

    if (storageSpaceLeft <= 0) {
        addMessage('Your storage is full. You cannot deposit more items.');
        promptUpgradeStorage(); // **Add a function to prompt storage upgrade**
        return;
    }

    // Determine which resources can be deposited (including fabric if discovered)
    const resourcesToDeposit = ['wood', 'rope', 'food'];
    if (gameState.discoveredResources.includes('fabric')) {
        resourcesToDeposit.push('fabric');
    }

    // Extract current inventory amounts for the resources to deposit
    const currentInventoryAmounts = resourcesToDeposit.map(resource => gameState.inventory[resource]);

    // Adjust amounts if storage limit is exceeded
    if (totalInventory > storageSpaceLeft) {
        const distributed = distributeItems(currentInventoryAmounts, storageSpaceLeft);

        // Assign deposited amounts based on distribution
        const depositedWood = distributed[0];
        const depositedRope = distributed[1];
        const depositedFood = distributed[2];
        let depositedFabric = 0;
        if (resourcesToDeposit.includes('fabric')) {
            depositedFabric = distributed[3] || 0;
        }

        // Update storage with deposited items
        gameState.storage.wood += depositedWood;
        gameState.storage.rope += depositedRope;
        gameState.storage.food += depositedFood;
        if (depositedFabric > 0) {
            gameState.storage.fabric += depositedFabric;
        }

        // Reduce inventory accordingly
        gameState.inventory.wood -= depositedWood;
        gameState.inventory.rope -= depositedRope;
        gameState.inventory.food -= depositedFood;
        if (depositedFabric > 0) {
            gameState.inventory.fabric -= depositedFabric;
        }

        // Construct deposit message
        let depositMessage = 'You could only deposit some items: ';
        const depositedItems = [];
        if (depositedWood > 0) depositedItems.push(`${depositedWood} wood`);
        if (depositedRope > 0) depositedItems.push(`${depositedRope} rope`);
        if (depositedFood > 0) depositedItems.push(`${depositedFood} food`);
        if (depositedFabric > 0) depositedItems.push(`${depositedFabric} fabric`);
        depositMessage += depositedItems.join(', ') + '.';
        addMessage(depositMessage);

        promptUpgradeStorage(); // **Prompt to upgrade after partial deposit**
    } else {
        // Move all items from inventory to storage
        resourcesToDeposit.forEach(resource => {
            gameState.storage[resource] += gameState.inventory[resource];
            gameState.inventory[resource] = 0;
        });
        addMessage('You deposit your items into storage.');
    }

    updateInventoryDisplay();
    updateStorageDisplay();

    // After depositing, check if storage is nearly full and suggest upgrade
    if (gameState.maxStorage - getTotalItems(gameState.storage) < 5) { // Threshold can be adjusted
        addMessage('Your storage is almost full. Consider upgrading your storage to hold more items.', true);
        addActionButton('Upgrade storage'); // **Automatically add the upgrade option**
    }
}


// **Add this helper function to prompt storage upgrade**
function promptUpgradeStorage() {
    const storageSpaceLeft = gameState.maxStorage - getTotalItems(gameState.storage);
    if (storageSpaceLeft < 5 && !document.querySelector('[data-action="Upgrade storage"]')) { // Prevent multiple prompts
        addMessage('Your storage is almost full. Consider upgrading your storage to hold more items.', true);
        addActionButton('Upgrade storage');
    }
}


function eatFoodAction() {
    // Check if stamina is at maximum
    if (gameState.stamina >= gameState.maxStamina) {
        addMessage("You're already at full stamina.");
        return;
    }

    // Check for food availability
    let foodSource = '';

    if (gameState.inventory.food > 0) {
        foodSource = 'inventory';
        gameState.inventory.food -= 1;
    } else if (gameState.storage.food > 0) {
        foodSource = 'storage';
        gameState.storage.food -= 1;
    } else {
        addMessage('You have no food to eat.');
        return;
    }

    // Restore stamina, but not exceeding maxStamina
    const staminaGain = Math.min(
        Math.floor(gameState.maxStamina / 3),
        gameState.maxStamina - gameState.stamina
    );
    changeStamina(staminaGain);

    addMessage(`You eat some food from your ${foodSource}.`);
    updateInventoryDisplay();
    updateStorageDisplay();
}

// Crafting actions implementations
function craftBucketAction() {
    const currentBucketCost = costs.bucket.baseWood + (gameState.bucketCrafted * costs.bucket.additionalCostPerBucket);

    if (gameState.bucketCrafted >= 5) {
        addMessage('You cannot carry any more buckets.');
        return;
    }

    if (gameState.storage.wood >= currentBucketCost) {
        gameState.storage.wood -= currentBucketCost;
        gameState.storage.bucket += 1;
        gameState.bucketCrafted += 1;
        gameState.maxInventory += 5; // Increase inventory size
        addMessage(
            `You craft a bucket using ${currentBucketCost} wood. You can now carry more items (${gameState.bucketCrafted}/5 buckets crafted).`
        );
        updateInventoryDisplay();
        updateStorageDisplay();
        updateActionButtonCosts(); // Update cost after crafting

        // Check if the player can now craft a rain barrel
        if (gameState.bucketCrafted >= 1 && !gameState.rainBarrelCrafted) {
            setTimeout(() => addMessage('With enough wood and rope, you could craft a rain barrel to gather water.', true), 2000);
            addActionButton('Craft rain barrel');
        }

        if (gameState.bucketCrafted >= 5) {
            const actionsContainer = document.getElementById('actions');
            const craftButtonContainer = actionsContainer.querySelector('[data-action="Craft bucket"]');
            if (craftButtonContainer) {
                craftButtonContainer.remove();
            }
        }
    } else {
        addMessage(`You don't have enough wood to craft a bucket. You need ${currentBucketCost} wood.`);
    }
    updateStorageDisplay();
}


function craftRainBarrelAction() {
    const requiredWood = costs.rainBarrel.wood;
    const requiredRope = costs.rainBarrel.rope;

    if (gameState.storage.wood >= requiredWood && gameState.storage.rope >= requiredRope) {
        gameState.storage.wood -= requiredWood;
        gameState.storage.rope -= requiredRope;
        gameState.rainBarrelCrafted = true;
        addMessage(`You craft a rain barrel using ${requiredWood} wood and ${requiredRope} rope.`);
        updateStorageDisplay();

        // Remove the craft rain barrel action
        const actionsContainer = document.getElementById('actions');
        const craftButtonContainer = actionsContainer.querySelector('[data-action="Craft rain barrel"]');
        if (craftButtonContainer) {
            craftButtonContainer.remove();
        }

        // Add "Collect water" action when above deck
        if (gameState.location === 'Above Deck') {
            addActionButton('Collect water');
        }

        // After a few seconds, prompt for crafting debris net
        setTimeout(() => {
            addMessage('A net could collect debris on its own.', true);
            gameState.netOptionAvailable = true;
            addActionButton('Craft debris net');
        }, 5000); // 5 seconds delay
    } else {
        addMessage("You don't have enough materials to craft a rain barrel.");
    }
    updateStorageDisplay();
}


function craftRaftAction() {
    const requiredWood = costs.raft.wood;
    const requiredRope = costs.raft.rope;

    if (gameState.storage.wood >= requiredWood && gameState.storage.rope >= requiredRope) {
        gameState.storage.wood -= requiredWood;
        gameState.storage.rope -= requiredRope;
        gameState.raftCrafted = true; // Mark the raft as crafted
        addMessage(`You craft a sturdy raft using ${requiredWood} wood and ${requiredRope} rope. You can now scavenge the sea for more debris.`, true);
        updateStorageDisplay();

        // After crafting the raft, add the "Scavenge at sea" action only if the player is Above Deck
        if (gameState.location === 'Above Deck') {
            addActionButton('Scavenge at sea');
        }

        // **Reset the raftPrompted flag**
        gameState.raftPrompted = false;

        // Remove the "Craft raft" button after crafting
        const actionsContainer = document.getElementById('actions');
        const raftButton = actionsContainer.querySelector('[data-action="Craft raft"]');
        if (raftButton) {
            raftButton.remove();
        }
    } else {
        addMessage("You don't have enough materials to craft a raft.");
    }
}






function craftDebrisNetAction() {
    const currentNetCost = costs.debrisNet.baseRope + (gameState.netsCrafted * costs.debrisNet.additionalCostPerNet);
    
    if (gameState.netsCrafted >= gameState.maxNetsCrafted) {
        addMessage('You have reached the maximum number of debris nets.', true);
        return;
    }
    
    if (gameState.storage.rope >= currentNetCost) {
        gameState.storage.rope -= currentNetCost;
        gameState.netsCrafted += 1; // Increment nets crafted
        addMessage(`You craft a debris net using ${currentNetCost} rope. It will now collect resources automatically.`, true);
        updateStorageDisplay();
        updateNetsAndCrewDisplay(); 
        updateActionButtonCosts();

        // If this is the first debris net, start the collection interval
        if (gameState.netsCrafted === 1) {
            startDebrisNetCollection();
        }

        // If there are nets left to craft, add the button again
        if (gameState.netsCrafted < gameState.maxNetsCrafted) {
            addActionButton('Craft debris net');
        } else {
            addMessage('You cannot craft any more debris nets at this time.', true);
        }
    } else {
        addMessage(`You don't have enough rope to craft a debris net. You need ${currentNetCost} rope.`);
    }
}







function upgradeStorageAction() {
    const currentUpgradeCost = costs.storageUpgrade.baseWood + (gameState.storageUpgrades * 50); // Each upgrade costs 50 wood more

    if (gameState.storage.wood >= currentUpgradeCost) {
        gameState.storage.wood -= currentUpgradeCost;
        gameState.storageUpgrades += 1; // Increment storage upgrades
        gameState.maxStorage += 100; // Increase storage capacity
        addMessage(`You upgrade your storage capacity by 100 units.`, true);
        updateStorageDisplay();

        // If the storage upgrade cost becomes too high or unnecessary, remove the button
        if (gameState.maxStorage < 1000) { // Example limit for upgrades
            addActionButton('Upgrade storage');
        }
    } else {
        addMessage(`You don't have enough wood to upgrade storage. You need ${currentUpgradeCost} wood.`);
    }
    updateActionButtonCosts();
}


function startDebrisNetCollection() {
    // Clear any existing debris net collection interval to prevent duplication
    if (gameState.debrisNetInterval) {
        clearInterval(gameState.debrisNetInterval);
    }

    gameState.debrisNetInterval = setInterval(() => {
        if (gameState.netsCrafted > 0) {
            let spaceLeft = gameState.maxStorage - getTotalItems(gameState.storage);
            if (spaceLeft <= 0) {
                // Storage is full, do not collect
                return;
            }

            const nets = gameState.netsCrafted;
            const woodToAdd = Math.min(nets, spaceLeft);
            gameState.storage.wood += woodToAdd;
            spaceLeft -= woodToAdd;

            const ropeToAdd = Math.min(nets, spaceLeft);
            gameState.storage.rope += ropeToAdd;
            spaceLeft -= ropeToAdd;

            const foodToAdd = Math.min(nets, spaceLeft);
            gameState.storage.food += foodToAdd;
            spaceLeft -= foodToAdd;

            let message = `Your ${nets} debris net(s) collected ${woodToAdd} wood, ${ropeToAdd} rope, and ${foodToAdd} food.`;
            addMessage(message);

            updateStorageDisplay();
            updateNetsAndCrewDisplay(); // Update combined display
        }
    }, 20000); // Collect resources every 20 seconds
}





function collectWaterAction() {
    if (gameState.maxStamina >= 150) {
        addMessage("Your stamina is at its maximum capacity. You don't need more water right now.");
        return;
    }

    addMessage('You collect fresh water from the rain barrel. Your maximum stamina recovers.');
    gameState.maxStamina += 10; // Increase max stamina by 10 each time
    if (gameState.maxStamina > 150) gameState.maxStamina = 150; // Cap the max stamina at 150
    updateStaminaBar();
}

function craftFlagAction() {
    const requiredWood = costs.flag.wood;
    const requiredRope = costs.flag.rope;
    const requiredFabric = costs.flag.fabric;

    // Check if player has enough resources
    if (
        gameState.storage.wood >= requiredWood &&
        gameState.storage.rope >= requiredRope &&
        gameState.storage.fabric >= requiredFabric
    ) {
        // Deduct resources
        gameState.storage.wood -= requiredWood;
        gameState.storage.rope -= requiredRope;
        gameState.storage.fabric -= requiredFabric;

        // Update game state
        gameState.flagCrafted = true;

        addMessage(`You craft a flag using ${requiredWood} wood, ${requiredRope} rope, and ${requiredFabric} fabric.`);
        setTimeout(() => addMessage('Hopefully passing sailors will be curious.', true), 2000);

        updateStorageDisplay();

        // Remove the "Craft flag" button
        const actionsContainer = document.getElementById('actions');
        const flagButton = actionsContainer.querySelector('[data-action="Craft flag"]');
        if (flagButton) {
            flagButton.remove();
        }

        // Trigger sailor encounter after 10 seconds
        setTimeout(() => {
            spawnSailor();
        }, 10000); // 10,000 milliseconds = 10 seconds

    } else {
        addMessage(`You don't have enough resources to craft a flag. You need ${requiredWood} wood, ${requiredRope} rope, and ${requiredFabric} fabric.`);
    }
}


// Function to spawn a stranded sailor
function spawnSailor() {
    // Check if max crew size is reached
    if (gameState.crew.length >= 5) {
        addMessage('You have reached the maximum number of crew members.');
        return;
    }

    // List of potential sailor names (ensure this list is stored outside of the function to persist across calls)
    if (!gameState.availableSailorNames || gameState.availableSailorNames.length === 0) {
        gameState.availableSailorNames = ['Elias', 'Mira', 'Rafe', 'Suri', 'Cassian', 'Elara', 'Kris', 'Viktor', 'Lyra', 'Selene', 'Cleo', 'Jaxon', 'Ray'];
    }

    // Randomly choose a name from the list
    const randomIndex = Math.floor(Math.random() * gameState.availableSailorNames.length);
    const randomName = gameState.availableSailorNames[randomIndex];

    // Remove the chosen name from the list
    gameState.availableSailorNames.splice(randomIndex, 1);

    // Define sailor options with the chosen name
    const message = `A stranded sailor named ${randomName} pulls up next to your ship. They will join you, but ask for 20 food up front.`;
    showAlert(message, [
        {
            text: 'Accept',
            callback: () => {
                if (gameState.storage.food >= 20) {
                    gameState.storage.food -= 20;
                    const newSailor = { id: Date.now(), name: randomName }; // Use the chosen name for the new sailor
                    gameState.crew.push(newSailor);
                    addMessage(`You have accepted ${randomName} as a new crewmate.`);
                    updateNetsAndCrewDisplay(); // Use the combined display

                    // Start fabric collection if this is the first crew member
                    if (gameState.crew.length === 1 && !crewInterval) {
                        startcrewCollection();
                    }

                    // Prompt to repair mast and sails after adding the first crewmate
                    if (gameState.crew.length === 1) {
                        promptMastAndSails();
                    }
                } else {
                    addMessage(`You do not have enough food to accept ${randomName}.`);
                }
            }
        },
        {
            text: 'Turn Away',
            callback: () => {
                addMessage(`You have turned away ${randomName}.`);
            }
        }
    ]);

    // Schedule the next sailor encounter
    scheduleNextSailorEncounter();
}



// Function to prompt player to repair mast and sails
function promptMastAndSails() {
    if (!gameState.mastPrompted) {
        gameState.mastPrompted = true;
        addMessage('Repairing the mast could stabilize your ship.', true);
        addActionButton('Repair mast');
    }

    if (!gameState.sailsPrompted) {
        gameState.sailsPrompted = true;
        addMessage('Repairing the sails could improve your navigation.', true);
        addActionButton('Repair sails');
    }
}

// Function to repair the mast
function repairMastAction() {
    const requiredWood = costs.mast.wood;
    const requiredRope = costs.mast.rope;

    if (gameState.storage.wood >= requiredWood && gameState.storage.rope >= requiredRope) {
        // Deduct resources
        gameState.storage.wood -= requiredWood;
        gameState.storage.rope -= requiredRope;

        // Update game state
        gameState.mastCrafted = true;

        addMessage(`You repair the mast using ${requiredWood} wood and ${requiredRope} rope. The ship feels sturdier now.`);

        updateStorageDisplay();

        // Remove the "Repair mast" button
        const actionsContainer = document.getElementById('actions');
        const mastButtonContainer = actionsContainer.querySelector('[data-action="Repair mast"]');
        if (mastButtonContainer) {
            mastButtonContainer.remove();
        }

        // Check if both mast and sails are crafted
        checkBothCrafted();
    } else {
        addMessage(`You don't have enough resources to repair the mast. Required: ${requiredWood} wood and ${requiredRope} rope.`);
    }
}


// Function to repair the sails
function repairSailsAction() {
    const requiredFabric = costs.sails.fabric;
    const requiredWood = costs.sails.wood;

    if (gameState.storage.fabric >= requiredFabric && gameState.storage.wood >= requiredWood) {
        // Deduct resources
        gameState.storage.fabric -= requiredFabric;
        gameState.storage.wood -= requiredWood;

        // Update game state
        gameState.sailsCrafted = true;

        addMessage(`You repair the sails using ${requiredFabric} fabric and ${requiredWood} wood. The sails are now in excellent condition.`);

        updateStorageDisplay();

        // Remove the "Repair sails" button
        const actionsContainer = document.getElementById('actions');
        const sailsButtonContainer = actionsContainer.querySelector('[data-action="Repair sails"]');
        if (sailsButtonContainer) {
            sailsButtonContainer.remove();
        }

        // Check if both mast and sails are crafted
        checkBothCrafted();
    } else {
        addMessage(`You don't have enough resources to repair the sails. Required: ${requiredFabric} fabric and ${requiredWood} wood.`);
    }
}


// Function to check if both mast and sails have been crafted
function checkBothCrafted() {
    if (gameState.mastCrafted && gameState.sailsCrafted && !gameState.sailsAndMastCrafted) {
        gameState.sailsAndMastCrafted = true;
        addMessage('With both the mast and sails repaired, your ship is now fully functional. New opportunities await.', true);
        
        startEventLoop(); // Start the event loop after both are crafted
    }
}



// Function to schedule the next sailor encounter
function scheduleNextSailorEncounter() {
    // Schedule the next sailor encounter after a random time between 3 and 5 minutes
    const minMinutes = 3;
    const maxMinutes = 5;
    const delay = (Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes) * 60000; // in milliseconds

    setTimeout(() => {
        spawnSailor();
    }, delay);
}


// Variable to hold the interval for crew fabric collection
let crewInterval = null;

// Function to start automatic fabric collection by crew members
function startcrewCollection() {
    if (crewInterval) return; // Prevent multiple intervals

    crewInterval = setInterval(() => {
        if (gameState.crew.length > 0) {
            let spaceLeft = gameState.maxStorage - getTotalItems(gameState.storage);
            if (spaceLeft <= 0) {
                // Storage is full, do not collect
                return;
            }

            const totalFabricCollected = gameState.crew.length; // 1 fabric per crew member

            const fabricToCollect = Math.min(totalFabricCollected, spaceLeft);

            if (fabricToCollect > 0) {
                gameState.storage.fabric += fabricToCollect;
                addMessage(`Your crew has collected ${fabricToCollect} fabric.`);
                updateStorageDisplay();
                updateNetsAndCrewDisplay(); // Update combined display
            }
        }
    }, 20000); // Every 20 seconds
}


function updateNetsAndCrewDisplay() {
    const displayElement = document.getElementById('nets-and-crew-display');
    if (!displayElement) return; // Ensure the element exists

    // Display when there are debris nets or crew, regardless of location
    if (gameState.netsCrafted > 0 || gameState.crew.length > 0) {
        let displayContent = '';

        // Debris Nets Section
        if (gameState.netsCrafted > 0) {
            displayContent += `
                <div class="section nets-info">
                    <p><strong>Debris Nets (${gameState.netsCrafted}/${gameState.maxNetsCrafted}):</strong></p>
                    <p>You have ${gameState.netsCrafted} debris net(s) collecting resources.</p>
                    <p>Your nets are collecting: ${gameState.netsCrafted} wood, ${gameState.netsCrafted} rope, ${gameState.netsCrafted} food every 20 seconds.</p>
                </div>
            `;
        }

        // Crew Section
        if (gameState.crew.length > 0) {
            displayContent += `
                <div class="section crew-info">
                    <p><strong>Crew (${gameState.crew.length}/${gameState.maxCrew}):</strong></p>
                    <p>Your crew is collecting ${gameState.crew.length} fabric every 20 seconds.</p>
                </div>
            `;
        }

        displayElement.innerHTML = displayContent;
        displayElement.classList.add('visible');
    } else {
        displayElement.classList.remove('visible');
        displayElement.innerHTML = '';
    }
}



function startEventLoop() {
    scheduleNextEvent();
}

function scheduleNextEvent() {
    // Random delay between 2 to 5 minutes (120,000 to 300,000 milliseconds)
    const delay = Math.floor(Math.random() * (300000 - 120000 + 1)) + 120000;
    setTimeout(triggerRandomEvent, delay);
}


function triggerRandomEvent() {
    const availableEvents = eventList.filter(event => {
        if (event.type === 'unique') {
            return !gameState.uniqueEventsTriggered.includes(event.name);
        }
        return true; // Regular events are always available
    });

    if (availableEvents.length === 0) {
        // No more unique events to trigger
        return;
    }

    // Select a random event from available events
    const randomIndex = Math.floor(Math.random() * availableEvents.length);
    const selectedEvent = availableEvents[randomIndex];

    // Execute the event's handler
    selectedEvent.handler();

    // If it's a unique event, mark it as triggered
    if (selectedEvent.type === 'unique') {
        gameState.uniqueEventsTriggered.push(selectedEvent.name);
    }

    // Schedule the next event
    scheduleNextEvent();
}


function wanderingTraderEvent() {
    addMessage('A small trading vessel approaches your ship with a friendly trader.');
    setTimeout(() => showAlert('The trader offers you two trades:', [
        {
            text: 'Trade Wood for Rope (80 Wood → 20 Rope)',
            callback: () => {
                if (gameState.storage.wood >= 80) {
                    gameState.storage.wood -= 80;
                    gameState.storage.rope += 20;
                    addMessage('You traded 80 wood for 20 rope.');
                    updateStorageDisplay();
                } else {
                    addMessage('You do not have enough wood to trade.');
                }
            }
        },
        {
            text: 'Trade Food for Fabric (20 Food → 5 Fabric)',
            callback: () => {
                if (gameState.storage.food >= 20) {
                    gameState.storage.food -= 20;
                    gameState.storage.fabric += 5;
                    addMessage('You traded 20 food for 5 fabric.');
                    updateStorageDisplay();
                } else {
                    addMessage('You do not have enough food to trade.');
                }
            }
        },
        {
            text: 'Decline',
            callback: () => {
                addMessage('You politely decline the trader\'s offers.');
            }
        }
    ]), 2000); // 2 seconds delay before showing the alert
}

function smokeSignalEvent() {
    setTimeout(() => showAlert('A smoke signal is spotted on the horizon.', [
        {
            text: 'Yes',
            callback: () => {
                const outcome = Math.random();
                if (outcome < 0.25) {
                    // Sinking ship with crewmates who join
                    if (gameState.crew.length < gameState.maxCrew) {
                        gameState.crew.push({ id: Date.now(), name: `Sailor ${gameState.crew.length + 1}` });
                        addMessage('You find a sinking ship with stranded sailors. They join your crew.');
                        updateNetsAndCrewDisplay();
                    } else {
                        addMessage('You find a sinking ship with sailors, but your crew is already at maximum capacity.');
                    }
                } else if (outcome < 0.5) {
                    // Ambush that kills a crewmate
                    if (gameState.crew.length > 0) {
                        const lostCrew = gameState.crew.pop();
                        addMessage(`An ambush attacks your ship. You lose a crewmate: ${lostCrew.name}.`);
                        updateNetsAndCrewDisplay();
                    } else {
                        addMessage('An ambush attacks your ship, but you have no crew to lose.');
                    }
                } else if (outcome < 0.75) {
                    // Ambush that steals some wood and food
                    const stolenWood = Math.min(5, gameState.storage.wood);
                    const stolenFood = Math.min(5, gameState.storage.food);
                    gameState.storage.wood -= stolenWood;
                    gameState.storage.food -= stolenFood;
                    addMessage(`An ambush attacks your ship and steals ${stolenWood} wood and ${stolenFood} food.`);
                    updateStorageDisplay();
                } else {
                    // Sinking ship with dead crew but some debris
                    const debrisWood = Math.floor(Math.random() * 5) + 1;
                    const debrisRope = Math.floor(Math.random() * 5) + 1;
                    gameState.storage.wood += debrisWood;
                    gameState.storage.rope += debrisRope;
                    addMessage('You find a sinking ship with dead sailors but salvage some debris:');
                    addMessage(`+${debrisWood} wood, +${debrisRope} rope.`);
                    updateStorageDisplay();
                }
            }
        },
        {
            text: 'No',
            callback: () => {
                addMessage('You decide not to investigate the smoke signal.');
            }
        }
    ]), 2000);
}

function shipwreckFoundEvent() {
    setTimeout(() => showAlert('You come across a shipwreck floating in the sea. No survivors can be seen.', [
        {
            text: 'Yes',
            callback: () => {
                const foundWood = Math.floor(Math.random() * 10) + 5;
                const foundRope = Math.floor(Math.random() * 5) + 2;
                const foundFood = Math.floor(Math.random() * 5) + 1;
                const foundFabric = Math.floor(Math.random() * 3); // Fabric might not always be found
                
                gameState.storage.wood += foundWood;
                gameState.storage.rope += foundRope;
                gameState.storage.food += foundFood;
                if (foundFabric > 0) {
                    gameState.storage.fabric += foundFabric;
                    if (!gameState.discoveredResources.includes('fabric')) {
                        gameState.discoveredResources.push('fabric');
                        addMessage('You discovered fabric at the shipwreck!');
                    }
                }
                
                addMessage(`You scavenge the shipwreck and collect ${foundWood} wood, ${foundRope} rope, ${foundFood} food${foundFabric > 0 ? `, and ${foundFabric} fabric` : ''}.`);
                updateStorageDisplay();
            }
        },
        {
            text: 'No',
            callback: () => {
                addMessage('You decide to leave the shipwreck untouched.');
            }
        }
    ]), 2000);
}

function rogueWaveEvent() {
    setTimeout(() => showAlert('A rogue wave suddenly surges over the bow, causing damage to your ship.', [
        {
            text: 'Secure the Ship',
            callback: () => {
                const lostWood = Math.floor(Math.random() * 10) + 5;
                const lostRope = Math.floor(Math.random() * 5) + 2;
                gameState.storage.wood = Math.max(0, gameState.storage.wood - lostWood);
                gameState.storage.rope = Math.max(0, gameState.storage.rope - lostRope);
                addMessage(`You manage to secure the ship but lose ${lostWood} wood and ${lostRope} rope in the process.`);
                updateStorageDisplay();
            }
        },
        {
            text: 'Take Cover',
            callback: () => {
                const chance = Math.random();
                if (chance < 0.5 && gameState.crew.length > 0) {
                    const lostCrew = gameState.crew.pop();
                    addMessage(`In the chaos, ${lostCrew.name} is lost at sea.`);
                    updateNetsAndCrewDisplay();
                } else if (chance >= 0.5) {
                    const lostWood = Math.floor(Math.random() * 5) + 1;
                    gameState.storage.wood = Math.max(0, gameState.storage.wood - lostWood);
                    addMessage(`You take cover but still lose ${lostWood} wood due to the impact.`);
                    updateStorageDisplay();
                } else {
                    addMessage('You survive the rogue wave without any losses.');
                }
            }
        },
        {
            text: 'Ignore',
            callback: () => {
                addMessage('You choose to ignore the rogue wave, risking greater damage.');
                // Potentially add more severe consequences here
            }
        }
    ]), 2000);
}

function flotillaEncounterEvent() {
    setTimeout(() => showAlert('You come across a flotilla of linked ships. They appear suspicious of your strange vessel but offer assistance.', [
        {
            text: 'Accept',
            callback: () => {
                // Increase crew and debris nets capacity
                gameState.maxCrew += 3;
                gameState.maxNetsCrafted += 3;
                addMessage('You accept their offer. Your crew size and debris nets capacity have increased by 3.');
                updateNetsAndCrewDisplay();
            }
        },
        {
            text: 'Decline',
            callback: () => {
                addMessage('You decline their offer and continue on your journey.');
            }
        }
    ]), 2000);
}



// Function to update the inventory display
function updateInventoryDisplay() {
    const inventoryElement = document.getElementById('inventory');
    const totalInventory = getTotalItems(gameState.inventory);

    if (gameState.inventoryVisible) {
        let inventoryContent = `
            <div class="box">
                <p><strong>Inventory (${totalInventory}/${gameState.maxInventory}):</strong></p>
        `;

        // Iterate over discovered resources to display them
        resources.forEach(resource => {
            if (gameState.discoveredResources.includes(resource)) {
                inventoryContent += `<p>${capitalize(resource)}: ${gameState.inventory[resource]}</p>`;
            }
        });

        inventoryContent += '</div>';
        inventoryElement.innerHTML = inventoryContent;

        // Add 'visible' class to trigger fade-in
        requestAnimationFrame(() => {
            inventoryElement.classList.add('visible');
        });
    } else {
        inventoryElement.classList.remove('visible');
    }
}


// Function to update the storage display
function updateStorageDisplay() {
    const storageElement = document.getElementById('storage');
    const totalStorage = getTotalItems(gameState.storage);

    if (gameState.storageVisible && gameState.location === 'Below Deck') {
        let storageContent = `
            <div class="box">
                <p><strong>Storage (${totalStorage}/${gameState.maxStorage}):</strong></p>
        `;

        // Iterate over discovered resources to display them
        resources.forEach(resource => {
            if (gameState.discoveredResources.includes(resource)) {
                storageContent += `<p>${capitalize(resource)}: ${gameState.storage[resource]}</p>`;
            }
        });

        if (gameState.storage.bucket > 0) {
            storageContent += `<p>Buckets: ${gameState.storage.bucket}</p>`;
        }

        storageContent += '</div>';
        storageElement.innerHTML = storageContent;

        // Add 'visible' class to trigger fade-in
        requestAnimationFrame(() => {
            storageElement.classList.add('visible');
        });
    } else {
        storageElement.classList.remove('visible');
    }
}


// Function to update the stamina bar
function updateStaminaBar() {
    const staminaElement = document.getElementById('stamina-bar');
    if (gameState.staminaVisible) {
        const staminaPercent = Math.max(
            0,
            Math.min(100, (gameState.stamina / gameState.maxStamina) * 100)
        );
        staminaElement.innerHTML = `
            <div class="stamina-container">
                <div class="stamina-fill" style="width: ${staminaPercent}%"></div>
            </div>
            <p>Stamina: ${Math.floor(gameState.stamina)}/${gameState.maxStamina}</p>
        `;

        // Add 'visible' class to trigger fade-in
        requestAnimationFrame(() => {
            staminaElement.classList.add('visible');
        });
    } else {
        staminaElement.classList.remove('visible');
    }
}

// Function to change stamina and check for depletion
function changeStamina(amount) {
    gameState.stamina += amount;
    if (gameState.stamina > gameState.maxStamina) {
        gameState.stamina = gameState.maxStamina;
    }
    if (gameState.stamina < 0) {
        gameState.stamina = 0; // Stamina can go down to 0
    }
    updateStaminaBar();
}


function startMaxStaminaDecay() {
    setInterval(() => {
        if (gameState.maxStamina > 50) {
            gameState.maxStamina -= 5; // Decrease max stamina by 5 every interval
            setTimeout(() => addMessage('The thirst weakens you. Not as much energy now.'), 1000);
            if (gameState.maxStamina < 50) gameState.maxStamina = 50; // Ensure it doesn’t go below 50
            updateStaminaBar();
        }
    }, 60000); // Decrease every 1 minutes
}


// Utility function to get total items
function getTotalItems(obj) {
    return Object.keys(obj).reduce((total, key) => {
        if (key !== 'bucket') { // Assuming 'bucket' is treated separately
            return total + (gameState.discoveredResources.includes(key) ? obj[key] : 0);
        }
        return total;
    }, 0);
}


// Utility function to distribute items proportionally
function distributeItems(items, spaceLeft) {
    let distributed = new Array(items.length).fill(0);

    if (spaceLeft <= 0) {
        return distributed;
    }

    // First, assign at least one item to each type if possible
    for (let i = 0; i < items.length && spaceLeft > 0; i++) {
        if (items[i] > 0) {
            distributed[i] = 1;
            spaceLeft--;
        }
    }

    // If there's remaining space, distribute proportionally
    const total = items.reduce((a, b) => a + b, 0);
    if (total > 0 && spaceLeft > 0) {
        for (let i = 0; i < items.length && spaceLeft > 0; i++) {
            let amount = Math.min(
                items[i] - distributed[i],
                Math.floor((items[i] / total) * spaceLeft)
            );
            distributed[i] += amount;
            spaceLeft -= amount;
        }
    }

    // Distribute any leftover space
    for (let i = 0; i < items.length && spaceLeft > 0; i++) {
        if (items[i] > distributed[i]) {
            distributed[i]++;
            spaceLeft--;
        }
    }

    return distributed;
}


function switchLocation(targetLocation) {
    if (gameState.location !== targetLocation) {
        // Update the current location
        gameState.location = targetLocation;

        // Add the target location to discoveredLocations if not already present
        if (!gameState.discoveredLocations.includes(targetLocation)) {
            gameState.discoveredLocations.push(targetLocation);
        }

        // Update the location display to reflect all discovered locations
        updateLocationDisplay();

        // Update styles based on the new weather and location
        updateStylesBasedOnWeather();

        // Apply the corresponding CSS class for the location
        applyLocationClass(gameState.location);

        // Update messages for switching locations
        if (gameState.location === 'Above Deck') {
            addMessage('You ascend to the deck.');
            setTimeout(() => displayWeatherMessage(), 2000);
        } else {
            addMessage('You descend to the lower deck.');
        }

        // Clear existing action buttons
        clearActionButtons();

        // Update inventory and storage displays
        updateInventoryDisplay();
        updateStorageDisplay();

        // Update the combined Debris Nets and Crew display
        updateNetsAndCrewDisplay(); // Ensure the nets and crew display always updates

        // Add actions based on the new location
        if (gameState.location === 'Above Deck') {
            // Add actions for Above Deck
            if (gameState.inventoryVisible) {
                if (gameState.scavengeAttempts < gameState.maxScavengeAttempts) {
                    addActionButton('Scavenge debris');
                }
                addActionButton('Eat food');
            }

            if (gameState.rainBarrelCrafted) {
                addActionButton('Collect water');
            }

            // Show "Scavenge at Sea" button only if the raft has been crafted
            if (gameState.raftCrafted) {
                addActionButton('Scavenge at sea');
            }

            // Show debris net button if it's unlocked
            if (gameState.netOptionAvailable) {
                addActionButton('Craft debris net');
            }

            // Add "Craft raft" button if prompted and raft not yet crafted
            if (gameState.raftPrompted && !gameState.raftCrafted) {
                addActionButton('Craft raft');
            }

            // Add "Craft flag" button if prompted and flag not yet crafted
            if (gameState.flagPrompted && !gameState.flagCrafted) {
                addActionButton('Craft flag');
            }

            // Add "Repair mast" and "Repair sails" if prompted and not yet crafted
            if (gameState.mastPrompted && !gameState.mastCrafted) {
                addActionButton('Repair mast');
            }
            if (gameState.sailsPrompted && !gameState.sailsCrafted) {
                addActionButton('Repair sails');
            }

        } else if (gameState.location === 'Below Deck') {
            // Add actions for Below Deck
            if (gameState.storageVisible) {
                if (getTotalItems(gameState.inventory) > 0) {
                    addActionButton('Deposit items into storage');
                }
                if (gameState.bucketOptionAvailable && gameState.bucketCrafted < 5) {
                    addActionButton('Craft bucket');
                }
                if (!gameState.rainBarrelCrafted && gameState.bucketCrafted > 0) {
                    addActionButton('Craft rain barrel');
                }
                addActionButton('Eat food');

                // Show storage upgrade button if necessary
                if (getTotalItems(gameState.storage) >= gameState.maxStorage || gameState.storagePrompted === true) {
                    addActionButton('Upgrade storage');
                    gameState.storagePrompted = true;
                }
            }

            if (gameState.standAttempts >= 3 && !gameState.inventoryVisible) {
                // Player can still climb back up if inventory is not yet visible
                addActionButton('Climb the stairs');
            }
        }
    }
}




function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}



// Start the game when the page loads
window.onload = startGame;