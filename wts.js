// Game state variables
let gameState = {
    location: 'Below Deck',
    standAttempts: 0,
    locations: ['Below Deck', 'Above Deck'],
    discoveredLocations: ['Below Deck'], // Start with only 'Below Deck' discovered
    actionCooldowns: {}, // Store cooldowns for actions
    weather: 'sunny', // Current weather
    initialWeatherSet: false, // Flag to check if initial weather is set
    storage: { wood: 0, rope: 0, food: 0, bucket: 0 }, // Initial storage amounts, including buckets
    maxStorage: 50, // Maximum storage capacity
    inventory: { wood: 0, rope: 0, food: 0 }, // Player's carry inventory
    baseMaxInventory: 10, // Base max items player can carry
    maxInventory: 10, // Current max inventory, increases with buckets
    scavengeAttempts: 0, // Number of times scavenged
    maxScavengeAttempts: 10, // Max scavenge attempts
    inventoryVisible: false, // Inventory visibility flag
    storageVisible: false, // Storage visibility flag
    stamina: 30, // Player's starting stamina (out of 50)
    maxStamina: 50, // Current max stamina, increases with water
    staminaVisible: false, // Stamina bar visibility flag
    bucketCrafted: false, // Flag to track if bucket has been crafted
    bucketOptionAvailable: false, // Flag to show bucket crafting option
    rainBarrelCrafted: false, // Flag for rain barrel
    firstScavengeTime: null, // Time when player first scavenged
    thirstInterval: null, // Interval for decreasing stamina over time
    lightningInterval: null // Interval for lightning effect
};

// Timed events
let headacheInterval;
let bucketHintTimeout;
let rainBarrelHintTimeout;

// Action definitions
const actions = {
    'Stand up': {
        cooldown: 5,
        execute: standUpAction
    },
    'Climb the stairs': {
        cooldown: 0,
        execute: climbStairsAction
    },
    'Assess the situation': {
        cooldown: 0,
        execute: assessSituationAction
    },
    'Scavenge debris': {
        cooldown: 5,
        execute: scavengeDebrisAction
    },
    'Deposit items into storage': {
        cooldown: 0,
        execute: depositItemsAction
    },
    'Eat food': {
        cooldown: 0,
        execute: eatFoodAction
    },
    'Craft bucket': {
        cooldown: 0,
        execute: craftBucketAction
    },
    'Craft rain barrel': {
        cooldown: 0,
        execute: craftRainBarrelAction
    },
    'Collect water': {
        cooldown: 60, // Collect water every 60 seconds
        execute: collectWaterAction
    }
};

// Initialize the game
function startGame() {
    updateLocationDisplay();
    updateStylesBasedOnWeather();
    scheduleHeadacheMessage();
    startStaminaRegeneration();
    // Initial messages with delays
    setTimeout(() => addMessage("Your head is throbbing."), 2000);
    setTimeout(() => addMessage("The ship creaks."), 4000);

    // Add the "Stand up" action after a delay
    setTimeout(() => addActionButton('Stand up'), 6000);
}

// Function to update the location display
function updateLocationDisplay() {
    const locationElement = document.getElementById('location');
    locationElement.innerHTML = ''; // Clear previous content

    gameState.discoveredLocations.forEach(loc => {
        const locElement = document.createElement('span');
        locElement.textContent = loc;
        locElement.className = 'location-name';
        if (loc === gameState.location) {
            locElement.classList.add('current-location');
        }
        locElement.onclick = () => switchLocation(loc);
        locationElement.appendChild(locElement);
    });
}

// Function to update styles based on weather
function updateStylesBasedOnWeather() {
    const body = document.body;
    if (gameState.location === 'Above Deck') {
        if (!gameState.initialWeatherSet) {
            gameState.weather = 'cloudy'; // Set initial weather to cloudy
            gameState.initialWeatherSet = true;
        } else {
            randomizeWeather(); // Randomize weather each time above deck
        }
        if (gameState.weather === 'sunny') {
            body.style.backgroundColor = '#f5f5f5'; // Very light gray
            body.style.color = '#000000'; // Black text
            setTimeout(() => addMessage("The sun is shining brightly overhead."), 1000);
            stopLightningEffect(); // Stop lightning if it was active
        } else if (gameState.weather === 'cloudy') {
            body.style.backgroundColor = '#dcdcdc'; // Gainsboro
            body.style.color = '#000000'; // Black text
            setTimeout(() => addMessage("Gray clouds cover the sky."), 1000);
            stopLightningEffect();
        } else if (gameState.weather === 'rainy') {
            body.style.backgroundColor = '#a9a9a9'; // Dark gray
            body.style.color = '#ffffff'; // White text
            setTimeout(() => addMessage("Rain pours down relentlessly."), 1000);
            stopLightningEffect();
        } else if (gameState.weather === 'stormy') {
            body.style.backgroundColor = '#1a1a1a'; // Darker gray
            body.style.color = '#ffffff'; // White text
            setTimeout(() => addMessage("A fierce storm rages around you."), 1000);
            startLightningEffect();
        }
    } else {
        // Below Deck styles
        body.style.backgroundColor = '#000000'; // Black background
        body.style.color = '#ffffff'; // White text
        stopLightningEffect(); // Stop lightning when below deck
    }
}

// Function to randomize weather
function randomizeWeather() {
    const weatherOptions = ['sunny', 'cloudy', 'rainy', 'stormy'];
    const randomIndex = Math.floor(Math.random() * weatherOptions.length);
    gameState.weather = weatherOptions[randomIndex];
}

// Function to start lightning effect during stormy weather
function startLightningEffect() {
    const body = document.body;

    // Clear any existing intervals
    if (gameState.lightningInterval) {
        clearInterval(gameState.lightningInterval);
    }

    gameState.lightningInterval = setInterval(() => {
        // Flash the background color to white briefly
        body.style.backgroundColor = '#ffffff';

        setTimeout(() => {
            body.style.backgroundColor = '#1a1a1a'; // Back to dark gray
        }, 100); // Flash duration
    }, Math.random() * 5000 + 2000); // Random interval between 2-7 seconds
}

// Function to stop lightning effect
function stopLightningEffect() {
    if (gameState.lightningInterval) {
        clearInterval(gameState.lightningInterval);
        gameState.lightningInterval = null;
        document.body.style.backgroundColor = ''; // Reset background color
    }
}

// Function to add a message to the message list
function addMessage(text) {
    const messagesContainer = document.getElementById('messages');

    // Create the new message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.textContent = text;
    messageElement.style.opacity = 0; // Start with opacity 0

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
                msg.style.top = (currentTop + newMessageHeight) + 'px';
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

// Function to add an action button
function addActionButton(actionName) {
    const action = actions[actionName];
    if (!action) return;

    const actionsContainer = document.getElementById('actions');

    // Check if the button already exists
    const existingButton = Array.from(actionsContainer.children).find(
        (btnContainer) => btnContainer.getAttribute('data-action') === actionName
    );
    if (existingButton) return;

    // Create a container for the button and its cost
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'action-button-container';
    buttonContainer.setAttribute('data-action', actionName);

    // Create the button
    const button = document.createElement('button');
    button.textContent = actionName;
    button.style.opacity = 0; // Start with opacity 0

    // Create the cooldown overlay
    const cooldownOverlay = document.createElement('div');
    cooldownOverlay.className = 'cooldown-overlay';
    cooldownOverlay.style.opacity = 0; // Start transparent
    cooldownOverlay.style.width = '0%'; // Start with zero width
    button.appendChild(cooldownOverlay);

    // Fade in the button
    requestAnimationFrame(() => {
        // Force reflow to register the initial opacity
        getComputedStyle(button).opacity;
        button.style.opacity = 1; // Trigger fade-in
    });

    // Handle cost display
    if (actionName === 'Craft bucket') {
        // Create a cost display element
        const costElement = document.createElement('div');
        costElement.className = 'cost';
        costElement.textContent = 'Cost: 20 wood';
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(costElement);
    } else if (actionName === 'Craft rain barrel') {
        // Create a cost display element
        const costElement = document.createElement('div');
        costElement.className = 'cost';
        costElement.textContent = 'Cost: 50 wood';
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(costElement);
    } else {
        buttonContainer.appendChild(button);
    }

    button.onclick = () => {
        // Check if the button is on cooldown
        const lastUsed = gameState.actionCooldowns[actionName];
        const now = Date.now();
        if (lastUsed && (now - lastUsed) < action.cooldown * 1000) {
            // Cooldown active, do nothing
            return;
        }

        // Set cooldown
        if (action.cooldown > 0) {
            gameState.actionCooldowns[actionName] = now;
            startCooldown(button, action.cooldown);
        }

        // Execute the action
        action.execute();

        // If the action should disappear after execution
        if (actionName === 'Assess the situation') {
            buttonContainer.remove();
        }
    };

    // Add the button container to the actions container
    actionsContainer.appendChild(buttonContainer);
}

// Function to handle button cooldown visualization
function startCooldown(button, cooldownSeconds) {
    button.disabled = true;

    // Get the cooldown overlay
    const cooldownOverlay = button.querySelector('.cooldown-overlay');
    if (cooldownOverlay) {
        // Reset any previous transition
        cooldownOverlay.style.transition = 'none';
        cooldownOverlay.style.width = '100%';
        cooldownOverlay.style.opacity = 1;

        // Force reflow to apply the styles
        cooldownOverlay.offsetWidth;

        // Set the transition for the cooldown animation
        cooldownOverlay.style.transition = `width ${cooldownSeconds}s linear`;

        // Start the animation
        requestAnimationFrame(() => {
            cooldownOverlay.style.width = '0%';
        });

        // When the transition ends, re-enable the button and hide the overlay
        cooldownOverlay.addEventListener('transitionend', function handler() {
            button.disabled = false;
            cooldownOverlay.style.opacity = 0; // Hide the overlay
            cooldownOverlay.style.width = '0%'; // Reset width for next use
            cooldownOverlay.style.transition = ''; // Reset transition
            cooldownOverlay.removeEventListener('transitionend', handler);
        });
    }
}

// Function to clear all action buttons
function clearActionButtons() {
    const actionsContainer = document.getElementById('actions');
    actionsContainer.innerHTML = '';
}

// Schedule the "Your head is throbbing" message every few minutes
function scheduleHeadacheMessage() {
    if (headacheInterval) clearInterval(headacheInterval);
    headacheInterval = setInterval(() => {
        addMessage("Your head is throbbing.");
    }, 180000); // Every 3 minutes
}

// Function to start stamina regeneration
function startStaminaRegeneration() {
    setInterval(() => {
        if (gameState.stamina < gameState.maxStamina) {
            changeStamina(1); // Regenerate 1 stamina point every minute
        }
    }, 15000); // Every minute
}

// Action implementations
function standUpAction() {
    gameState.standAttempts += 1;

    if (gameState.standAttempts === 1) {
        addMessage("You try to stand, but collapse back onto the floor.");
    } else if (gameState.standAttempts === 2) {
        addMessage("You struggle to your knees, but can't quite get up.");
    } else if (gameState.standAttempts >= 3) {
        addMessage("You stand, wobble, and steady yourself.");
        setTimeout(() => addMessage("You see a staircase leading up into the light."), 2000);
        clearActionButtons();
        setTimeout(() => addActionButton('Climb the stairs'), 2000);
    }
}

function climbStairsAction() {
    addMessage("You slowly make your way up the stairs.");
    gameState.location = 'Above Deck';

    // Set initial weather to 'cloudy' if not already set
    if (!gameState.initialWeatherSet) {
        gameState.weather = 'cloudy';
        gameState.initialWeatherSet = true;
    }

    // Add 'Above Deck' to discovered locations if not already present
    if (!gameState.discoveredLocations.includes('Above Deck')) {
        gameState.discoveredLocations.push('Above Deck');
    }

    updateLocationDisplay();
    updateStylesBasedOnWeather();
    clearActionButtons();

    // Add "Assess the situation" action
    setTimeout(() => addActionButton('Assess the situation'), 2000);
}

function assessSituationAction() {
    addMessage("Debris covers the deck in every direction.");
    setTimeout(() => addMessage("The mast is in pieces. The sails are torn."), 2000);

    // After assessing, set inventory and storage to visible
    gameState.inventoryVisible = true;
    gameState.storageVisible = true;
    gameState.staminaVisible = true;
    updateInventoryDisplay();
    updateStorageDisplay();
    updateStaminaBar();

    // After assessing, add "Scavenge debris" action
    setTimeout(() => addActionButton('Scavenge debris'), 2000);
    setTimeout(() => addActionButton('Eat food'), 2000);
}

function scavengeDebrisAction() {
    if (gameState.scavengeAttempts >= gameState.maxScavengeAttempts) {
        addMessage("The deck is now clean.");
        return;
    }

    // Check if the player has enough stamina
    if (gameState.stamina < 10) {
        addMessage("You are too exhausted to scavenge. You need to rest or eat some food.");
        return;
    }

    // Check if inventory is full
    const totalInventory = getTotalItems(gameState.inventory);
    let spaceLeft = gameState.maxInventory - totalInventory;

    if (spaceLeft <= 0) {
        addMessage("Your inventory is full. You need to deposit items into storage.");
        return;
    }

    // Decrease stamina
    changeStamina(-10);

    // Record first scavenge time
    if (!gameState.firstScavengeTime) {
        gameState.firstScavengeTime = Date.now();
        // Schedule bucket hint after 1 minute
        bucketHintTimeout = setTimeout(() => {
            addMessage("A bucket could be useful. It would help you carry more items.");
            gameState.bucketOptionAvailable = true;
            if (gameState.location === 'Below Deck') {
                addActionButton('Craft bucket');
            }
        }, 60000); // After 1 minute
    }

    gameState.scavengeAttempts += 1;

    // Random amounts between 1 and 3
    const woodFound = Math.floor(Math.random() * 3) + 1;
    const ropeFound = Math.floor(Math.random() * 3) + 1;
    const foodFound = Math.floor(Math.random() * 3) + 1;

    // Total items found
    let itemsFound = woodFound + ropeFound + foodFound;

    // Adjust items to fit inventory space
    let collectedWood = 0;
    let collectedRope = 0;
    let collectedFood = 0;

    if (spaceLeft <= 0) {
        addMessage("Your inventory is full. You need to deposit items into storage.");
        return;
    }

    const proportions = distributeItems([woodFound, ropeFound, foodFound], spaceLeft);
    collectedWood = proportions[0];
    collectedRope = proportions[1];
    collectedFood = proportions[2];

    gameState.inventory.wood += collectedWood;
    gameState.inventory.rope += collectedRope;
    gameState.inventory.food += collectedFood;

    addMessage(`You scavenge some debris and find ${collectedWood} wood, ${collectedRope} rope, and ${collectedFood} food.`);
    updateInventoryDisplay();

    // Check if max scavenge attempts reached
    if (gameState.scavengeAttempts >= gameState.maxScavengeAttempts) {
        addMessage("The deck is now clean.");
    }
}


function depositItemsAction() {
    // Check if inventory is empty
    const totalInventory = getTotalItems(gameState.inventory);
    if (totalInventory === 0) {
        addMessage("You have nothing to deposit.");
        return;
    }

    // Calculate total items in storage
    const totalStorage = getTotalItems(gameState.storage);
    const storageSpaceLeft = gameState.maxStorage - totalStorage;

    if (storageSpaceLeft <= 0) {
        addMessage("Your storage is full. You cannot deposit more items.");
        return;
    }

    // Adjust amounts if storage limit is exceeded
    if (totalInventory > storageSpaceLeft) {
        const scale = storageSpaceLeft / totalInventory;
        gameState.storage.wood += Math.floor(gameState.inventory.wood * scale);
        gameState.storage.rope += Math.floor(gameState.inventory.rope * scale);
        gameState.storage.food += Math.floor(gameState.inventory.food * scale);
        // Reduce inventory accordingly
        gameState.inventory.wood -= Math.floor(gameState.inventory.wood * scale);
        gameState.inventory.rope -= Math.floor(gameState.inventory.rope * scale);
        gameState.inventory.food -= Math.floor(gameState.inventory.food * scale);
        addMessage("Your storage is full. You could only deposit some items.");
    } else {
        // Move all items from inventory to storage
        gameState.storage.wood += gameState.inventory.wood;
        gameState.storage.rope += gameState.inventory.rope;
        gameState.storage.food += gameState.inventory.food;
        gameState.inventory.wood = 0;
        gameState.inventory.rope = 0;
        gameState.inventory.food = 0;
        addMessage("You deposit your items into storage.");
    }

    updateInventoryDisplay();
    updateStorageDisplay();
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
        addMessage("You have no food to eat.");
        return;
    }

    // Restore stamina, but not exceeding maxStamina
    const staminaGain = Math.min(Math.floor(gameState.maxStamina / 3), gameState.maxStamina - gameState.stamina);
    changeStamina(staminaGain);

    addMessage(`You eat some food from your ${foodSource}.`);
    updateInventoryDisplay();
    updateStorageDisplay();
}

function craftBucketAction() {
    if (gameState.storage.wood >= 20) {
        gameState.storage.wood -= 20;
        gameState.storage.bucket += 1;
        gameState.bucketCrafted = true;
        gameState.maxInventory += 5; // Increase inventory size
        addMessage("You craft a bucket using 20 wood. You can now carry more items.");
        updateInventoryDisplay();

        // Show number of buckets in storage
        updateStorageDisplay();

        // Remove the craft bucket action
        const actionsContainer = document.getElementById('actions');
        const craftButtonContainer = actionsContainer.querySelector('[data-action="Craft bucket"]');
        if (craftButtonContainer) {
            craftButtonContainer.remove();
        }

        // Schedule rain barrel hint after some time
        rainBarrelHintTimeout = setTimeout(() => {
            addMessage("Your head is throbbing. Need water. Perhaps a rain barrel.");
            if (!gameState.rainBarrelCrafted) {
                if (gameState.location === 'Below Deck') {
                    addActionButton('Craft rain barrel');
                }
            }
        }, 120000); // After 2 minutes
    } else {
        addMessage("You don't have enough wood to craft a bucket.");
    }
    updateStorageDisplay();
}

function craftRainBarrelAction() {
    if (gameState.storage.wood >= 50) {
        gameState.storage.wood -= 50;
        gameState.rainBarrelCrafted = true;
        addMessage("You craft a rain barrel using 50 wood.");
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
    } else {
        addMessage("You don't have enough wood to craft a rain barrel.");
    }
    updateStorageDisplay();
}

function collectWaterAction() {
    addMessage("You collect fresh water from the rain barrel.");
    gameState.maxStamina += 10; // Increase max stamina
    if (gameState.maxStamina > 100) gameState.maxStamina = 100;
    updateStaminaBar();

    // Start thirst interval if not already running
    if (!gameState.thirstInterval) {
        gameState.thirstInterval = setInterval(() => {
            changeStamina(-5); // Decrease stamina over time
            if (gameState.stamina <= 20) {
                addMessage("You're thirsty.");
            }
            if (gameState.stamina <= 0) {
                addMessage("Your head is throbbing. You need water.");
            }
        }, 60000); // Every minute
    }
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
        inventoryElement.style.display = 'block';
    } else {
        inventoryElement.style.display = 'none';
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

        if (gameState.bucketCrafted || gameState.storage.bucket > 0) {
            storageContent += `<p>Buckets: ${gameState.storage.bucket}</p>`;
        }

        storageContent += '</div>';
        storageElement.innerHTML = storageContent;
        storageElement.style.display = 'block';
    } else {
        storageElement.style.display = 'none';
    }
}

// Function to update the stamina bar
function updateStaminaBar() {
    const staminaElement = document.getElementById('stamina-bar');
    if (gameState.staminaVisible) {
        const staminaPercent = Math.max(0, Math.min(100, (gameState.stamina / gameState.maxStamina) * 100));
        staminaElement.innerHTML = `
            <div class="stamina-container">
                <div class="stamina-fill" style="width: ${staminaPercent}%"></div>
            </div>
            <p>Stamina: ${Math.floor(gameState.stamina)}/${gameState.maxStamina}</p>
        `;
        staminaElement.style.display = 'block';
    } else {
        staminaElement.style.display = 'none';
    }
}

// Function to change stamina and check for depletion
function changeStamina(amount) {
    gameState.stamina += amount;
    if (gameState.stamina > gameState.maxStamina) {
        gameState.stamina = gameState.maxStamina;
    }
    if (gameState.stamina < 0) {
        gameState.stamina = 0;
    }
    updateStaminaBar();

    if (gameState.stamina <= 0) {
        addMessage("You feel exhausted. You need to eat some food or drink water.");
    }
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
            let amount = Math.min(items[i] - distributed[i], Math.floor((items[i] / total) * spaceLeft));
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
            addMessage("You ascend to the deck.");
        } else {
            addMessage("You descend to the lower deck.");
        }

        clearActionButtons();

        updateInventoryDisplay();
        updateStorageDisplay();

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
        } else if (gameState.location === 'Below Deck') {
            // Add actions for Below Deck
            if (gameState.storageVisible) {
                if (getTotalItems(gameState.inventory) > 0) {
                    addActionButton('Deposit items into storage');
                }
                if (gameState.bucketOptionAvailable && !gameState.bucketCrafted) {
                    addActionButton('Craft bucket');
                }
                if (!gameState.rainBarrelCrafted && gameState.bucketCrafted) {
                    addActionButton('Craft rain barrel');
                }
                addActionButton('Eat food');
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
