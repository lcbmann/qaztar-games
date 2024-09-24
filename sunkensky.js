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
        additionalCostPerNet: 10, // Additional rope cost for subsequent nets
    },
    storageUpgrade: {
        baseWood: 25, // Base wood cost for the first storage upgrade
        additionalCostPerUpgrade: 50, // Additional wood cost for each storage upgrade
    }
};


// Game state variables
let gameState = {
    location: 'Below Deck',
    standAttempts: 0,
    locations: ['Below Deck', 'Above Deck'],
    discoveredLocations: ['Below Deck'], // Start with only 'Below Deck' discovered
    actionCooldowns: {}, // Store cooldowns for actions
    weather: 'windy', // Current weather
    storage: { wood: 0, rope: 0, food: 0, bucket: 0 }, // Initial storage amounts, including buckets
    maxStorage: 150, // Maximum storage capacity
    inventory: { wood: 0, rope: 0, food: 0 }, // Player's carry inventory
    baseMaxInventory: 10, // Base max items player can carry
    maxInventory: 10, // Current max inventory, increases with buckets
    scavengeAttempts: 0, // Number of times scavenged
    maxScavengeAttempts: 25, // Max scavenge attempts
    inventoryVisible: false, // Inventory visibility flag
    storageVisible: false, // Storage visibility flag
    stamina: 30, // Player's starting stamina (out of 50)
    maxStamina: 100, // Current max stamina, increases with water
    staminaVisible: false, // Stamina bar visibility flag
    bucketCrafted: 0, // Number of buckets crafted
    bucketOptionAvailable: false, // Flag to show bucket crafting option
    rainBarrelCrafted: false, // Flag for rain barrel
    netsCrafted: 0,
    netOptionAvailable: false,
    raftCrafted: false,
    raftPrompted: false,
    storageUpgrades: 0,
    storagePrompted: false,
    firstScavengeTime: null, // Time when player first scavenged
    thirstInterval: null, // Interval for decreasing stamina over time
    lightningInterval: null, // Interval for lightning effect
    headacheActive: true,
};

const weatherOptions = ['windy', 'cloudy', 'rainy', 'stormy'];
let currentWeatherIndex = 0;

// Timed events
let headacheInterval = null;
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
        cooldown: 5,
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
        cooldown: 10, // Add a cooldown if desired
        execute: scavengeAtSeaAction, // Define the action here
    },
    'Craft raft': { // Ensure this is included
        cooldown: 0,
        execute: craftRaftAction,
    },
};


// Initialize the game
function startGame() {
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
    const root = document.documentElement;

    if (gameState.location === 'Above Deck') {
        // Apply styles based on the current weather
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

        // Set styles based on weather
        if (gameState.weather === 'windy') {
            root.style.setProperty('--background-color', '#f5f5f5'); // Very light gray
            root.style.setProperty('--text-color', '#000000'); // Black text
            root.style.setProperty('--button-text-color', '#000000');
            root.style.setProperty('--button-border-color', '#000000');
            root.style.setProperty('--box-border-color', '#000000');
        } else if (gameState.weather === 'cloudy') {
            root.style.setProperty('--background-color', '#dcdcdc'); // Gainsboro
            root.style.setProperty('--text-color', '#000000'); // Black text
            root.style.setProperty('--button-text-color', '#000000');
            root.style.setProperty('--button-border-color', '#000000');
            root.style.setProperty('--box-border-color', '#000000');
        } else if (gameState.weather === 'rainy') {
            root.style.setProperty('--background-color', '#a9a9a9'); // Dark gray
            root.style.setProperty('--text-color', '#ffffff'); // White text
            root.style.setProperty('--button-text-color', '#ffffff');
            root.style.setProperty('--button-border-color', '#ffffff');
            root.style.setProperty('--box-border-color', '#ffffff');
        } else if (gameState.weather === 'stormy') {
            root.style.setProperty('--background-color', '#1a1a1a'); // Darker gray
            root.style.setProperty('--text-color', '#ffffff'); // White text
            root.style.setProperty('--button-text-color', '#ffffff');
            root.style.setProperty('--button-border-color', '#ffffff');
            root.style.setProperty('--box-border-color', '#ffffff');
        }
    } else {
        // Styles for Below Deck
        root.style.setProperty('--background-color', '#000000'); // Black background
        root.style.setProperty('--text-color', '#ffffff'); // White text
        root.style.setProperty('--button-text-color', '#ffffff');
        root.style.setProperty('--button-border-color', '#ffffff');
        root.style.setProperty('--box-border-color', '#ffffff');
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
// Function to start lightning effect during stormy weather
function startLightningEffect() {
    const body = document.body;

    // Clear any existing intervals to prevent multiple intervals running
    if (gameState.lightningInterval) {
        clearInterval(gameState.lightningInterval);
    }

    gameState.lightningInterval = setInterval(() => {
        // Flash the background color to white briefly
        body.style.backgroundColor = '#ffffff';

        setTimeout(() => {
            // Reset to the current background color based on CSS variables
            body.style.backgroundColor = 'var(--background-color)';
        }, 100); // Flash duration of 100ms
    }, Math.random() * 5000 + 2000); // Random interval between 2-7 seconds
}


// Function to stop lightning effect
function stopLightningEffect() {
    if (gameState.lightningInterval) {
        clearInterval(gameState.lightningInterval);
        gameState.lightningInterval = null;
    }

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
    const bucketButton = document.querySelector('[data-action="Craft bucket"] .cost');
    if (bucketButton) {
        const currentBucketCost = costs.bucket.baseWood + (gameState.bucketCrafted * costs.bucket.additionalCostPerBucket);
        bucketButton.textContent = `Cost: ${currentBucketCost} wood`;
    }

    const rainBarrelButton = document.querySelector('[data-action="Craft rain barrel"] .cost');
    if (rainBarrelButton) {
        rainBarrelButton.textContent = `Cost: ${costs.rainBarrel.wood} wood, ${costs.rainBarrel.rope} rope`;
    }

    const debrisNetButton = document.querySelector('[data-action="Craft debris net"] .cost');
    if (debrisNetButton) {
        const currentNetCost = costs.debrisNet.baseRope + (gameState.netsCrafted * costs.debrisNet.additionalCostPerNet);
        debrisNetButton.textContent = `Cost: ${currentNetCost} rope`; // Correct calculation
    }

    const storageUpgradeButton = document.querySelector('[data-action="Upgrade storage"] .cost');
    if (storageUpgradeButton) {
        const currentUpgradeCost = costs.storageUpgrade.baseWood + (gameState.storageUpgrades * costs.storageUpgrade.additionalCostPerUpgrade);
        storageUpgradeButton.textContent = `Cost: ${currentUpgradeCost} wood`;
    }

    const raftButton = document.querySelector('[data-action="Craft raft"] .cost');
    if (raftButton) {
        raftButton.textContent = `Cost: ${costs.raft.wood} wood, ${costs.raft.rope} rope`;
    }
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
            addMessage('Your head is throbbing.');
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
    }, 20000); // 
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
    gameState.location = 'Above Deck';

    // Add 'Above Deck' to discovered locations if not already present
    if (!gameState.discoveredLocations.includes('Above Deck')) {
        gameState.discoveredLocations.push('Above Deck');
    }

    updateLocationDisplay();
    updateStylesBasedOnWeather();
    setTimeout(() => displayWeatherMessage(), 1000);
    clearActionButtons();

    // Add "Assess the situation" action
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
        }, 40000); // After 40 secs
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

    const findNoteChance = 0.2; // 20% probability
    if (Math.random() < findNoteChance) {
        showAlert('You find a mysterious note partially buried in the debris.<br><br>"Beware the storm<br>that approaches<br>the horizon..."', [
            {
                text: 'Close',
                callback: () => {
                    addMessage('You decide to leave the note undisturbed.');
                }
            }
        ]);
    }

    updateInventoryDisplay();

    if (gameState.scavengeAttempts >= gameState.maxScavengeAttempts) {
        addMessage('The deck is now clean.', true);
        addMessage('There is more debris floating in the sea surrounding the ship. You will need to craft a raft to reach it.', true);
        addActionButton('Craft raft');
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

    // Random amounts between 3 and 6 for wood, 2 to 4 for rope, 1 to 3 for food
    const woodFound = Math.floor(Math.random() * 4) + 8;
    const ropeFound = Math.floor(Math.random() * 3) + 4;
    const foodFound = Math.floor(Math.random() * 3) + 0;

    // Adjust items to fit inventory space
    const proportions = distributeItems([woodFound, ropeFound, foodFound], spaceLeft);
    const collectedWood = proportions[0];
    const collectedRope = proportions[1];
    const collectedFood = proportions[2];

    // Add collected items to inventory
    gameState.inventory.wood += collectedWood;
    gameState.inventory.rope += collectedRope;
    gameState.inventory.food += collectedFood;

    // Display the collected message or notify if inventory is full
    if (collectedWood > 0 || collectedRope > 0 || collectedFood > 0) {
        addMessage(`You scavenge the sea and find ${collectedWood} wood, ${collectedRope} rope, and ${collectedFood} food.`);
    } else {
        addMessage('You found debris in the sea, but your inventory is full. Deposit items below deck.');
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

    // Adjust amounts if storage limit is exceeded
    if (totalInventory > storageSpaceLeft) {
        const scale = storageSpaceLeft / totalInventory;
        const distributed = distributeItems([gameState.inventory.wood, gameState.inventory.rope, gameState.inventory.food], storageSpaceLeft);

        const depositedWood = distributed[0];
        const depositedRope = distributed[1];
        const depositedFood = distributed[2];

        gameState.storage.wood += depositedWood;
        gameState.storage.rope += depositedRope;
        gameState.storage.food += depositedFood;

        // Reduce inventory accordingly
        gameState.inventory.wood -= depositedWood;
        gameState.inventory.rope -= depositedRope;
        gameState.inventory.food -= depositedFood;

        addMessage('Your storage is full. You could only deposit some items.');

        promptUpgradeStorage(); // **Prompt to upgrade after partial deposit**
    } else {
        // Move all items from inventory to storage
        gameState.storage.wood += gameState.inventory.wood;
        gameState.storage.rope += gameState.inventory.rope;
        gameState.storage.food += gameState.inventory.food;
        gameState.inventory.wood = 0;
        gameState.inventory.rope = 0;
        gameState.inventory.food = 0;
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
    const currentNetCost = 15 + (gameState.netsCrafted * 10); // Adjusted to match the dynamic cost

    if (gameState.storage.rope >= currentNetCost) {
        gameState.storage.rope -= currentNetCost;
        gameState.netsCrafted += 1; // Increment nets crafted
        addMessage(`You craft a debris net using ${currentNetCost} rope. It will now collect resources automatically.`, true);
        updateStorageDisplay();
        updateNetsDisplay(); 
        updateActionButtonCosts();

        // If there are no more nets to craft (based on some limit), remove the action button
        if (gameState.netsCrafted < 5) {
            addActionButton('Craft debris net'); // Add option for more nets if needed
        }

        // Start resource collection
        startDebrisNetCollection();
    } else {
        addMessage(`You don't have enough rope to craft a debris net. You need ${currentNetCost} rope.`);
    }
}


// Function to update the nets display when Above Deck
function updateNetsDisplay() {
    const netsElement = document.getElementById('nets-display');
    if (!netsElement) return; // Ensure the element exists

    if (gameState.netOptionAvailable && gameState.location === 'Above Deck') {
        netsElement.innerHTML = `
            <div class="box">
                <p><strong>Debris Nets:</strong></p>
                <p>You have ${gameState.netsCrafted} debris net(s) collecting resources.</p>
                <p>Each net collects 1 wood, 1 rope, and 1 food every 20 seconds.</p>
            </div>
        `;
        netsElement.classList.add('visible');
    } else {
        netsElement.classList.remove('visible');
    }
}



function upgradeStorageAction() {
    const currentUpgradeCost = 50 + (gameState.storageUpgrades * 50); // Each upgrade costs 50 wood more

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
}


function startDebrisNetCollection() {
    setInterval(() => {
        if (gameState.netsCrafted > 0) {
            let spaceLeft = gameState.maxStorage - getTotalItems(gameState.storage);
            if (spaceLeft <= 0) {
                // Storage is full, do not collect
                return;
            }

            let totalWoodAdded = 0;
            let totalRopeAdded = 0;
            let totalFoodAdded = 0;

            for (let i = 0; i < gameState.netsCrafted; i++) {
                if (spaceLeft <= 0) break;

                // Add wood
                if (spaceLeft > 0) {
                    gameState.storage.wood += 1;
                    totalWoodAdded += 1;
                    spaceLeft -= 1;
                }

                // Add rope
                if (spaceLeft > 0) {
                    gameState.storage.rope += 1;
                    totalRopeAdded += 1;
                    spaceLeft -= 1;
                }

                // Add food
                if (spaceLeft > 0) {
                    gameState.storage.food += 1;
                    totalFoodAdded += 1;
                    spaceLeft -= 1;
                }
            }

            // Generate dynamic collection message
            let collectedItems = [];
            if (totalWoodAdded > 0) collectedItems.push(`${totalWoodAdded} wood`);
            if (totalRopeAdded > 0) collectedItems.push(`${totalRopeAdded} rope`);
            if (totalFoodAdded > 0) collectedItems.push(`${totalFoodAdded} food`);

            if (collectedItems.length > 0) {
                let message = `Your debris nets collected ${collectedItems.join(', ')}.`;
                addMessage(message);
            }

            updateStorageDisplay();
            updateNetsDisplay(); // Update the nets display when collection happens
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



// Function to update the inventory display
function updateInventoryDisplay() {
    const inventoryElement = document.getElementById('inventory');
    const totalInventory = getTotalItems(gameState.inventory);

    if (gameState.inventoryVisible) {
        inventoryElement.innerHTML = `
            <div class="box">
                <p><strong>Inventory (${totalInventory}/${gameState.maxInventory}):</strong></p>
                <p>Wood: ${gameState.inventory.wood}</p>
                <p>Rope: ${gameState.inventory.rope}</p>
                <p>Food: ${gameState.inventory.food}</p>
            </div>
        `;

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
                <p>Wood: ${gameState.storage.wood}</p>
                <p>Rope: ${gameState.storage.rope}</p>
                <p>Food: ${gameState.storage.food}</p>
        `;

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
        if (key !== 'bucket') {
            return total + obj[key];
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

// Switch location when location name is clicked
function switchLocation(targetLocation) {

    if (gameState.location !== targetLocation) {
        gameState.location = targetLocation;
        updateLocationDisplay();
        updateStylesBasedOnWeather();

        // Update messages for switching locations
        if (gameState.location === 'Above Deck') {
            addMessage('You ascend to the deck.');
            setTimeout(() => displayWeatherMessage(), 2000);
        } else {
            addMessage('You descend to the lower deck.');
        }

        clearActionButtons();

        updateInventoryDisplay();
        updateStorageDisplay();
        updateNetsDisplay(); // Update the nets display

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

            // **Add "Craft raft" button if prompted and raft not yet crafted**
            if (gameState.raftPrompted && !gameState.raftCrafted) {
                addActionButton('Craft raft');
                const raftButtonExists = document.querySelector('[data-action="Craft raft"]');
                if (!raftButtonExists) {
                    addActionButton('Craft raft');
                }
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
                if (getTotalItems(gameState.storage) >= gameState.maxStorage || gameState.storagePrompted == true) {
                    addActionButton('Upgrade storage');
                    storagePrompted = true;
                }
            }

            if (gameState.standAttempts >= 3 && !gameState.inventoryVisible) {
                // Player can still climb back up if inventory is not yet visible
                addActionButton('Climb the stairs');
            }
        }
    }
}





// Start the game when the page loads
window.onload = startGame;
