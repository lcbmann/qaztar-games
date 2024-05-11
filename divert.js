//#region Basic Variables
var availablePower = 20;
var maxAvailablePower = 20;
var enginePower = 0;
var weaponPower = 0;
var shieldPower = 0;
var shieldHealth = 50;
var hullHealth = 50;
var coreTemperature = 0;
var maxTemperature = 1000;

var enemyCount = 0;
var enemyShieldHealth = 20;
var enemyHullHealth = 20;
var enemyDistance = 100;
const minDistance = 100;
const maxDistance = 30000;

var maxShieldHealth = 50;
var shieldRegenInterval = 500;
var regenDelay = 8000;
let isRegenerating = true;
var regenerationSpeed = shieldPower * 0.1;
var elapsedTime = shieldRegenInterval / 1000;
var regenerationAmount = regenerationSpeed * elapsedTime;
var flyingTowardEnemy = false;

let starSpawnInterval;
const stars = []; // Store references to the created stars
let starCounter = 0; // Counter to track the number of stars created
var playerCredits = 10; 





var gameOver = false;


meters = Array(availablePower, enginePower, weaponPower, shieldPower, shieldHealth, hullHealth);


var damageType;
//#endregion

//#region Page Elements
const availablePowerElement = document.getElementById('availablePowerID');
const enginePowerElement = document.getElementById('enginePowerID');
const weaponPowerElement = document.getElementById('weaponPowerID');
const shieldPowerElement = document.getElementById('shieldPowerID');
const shieldHealthElement = document.getElementById('shieldHealthID');
const hullHealthElement = document.getElementById('hullHealthID')
const temperatureElement = document.getElementById('coreTemperature');
const maxTemperatureElement = document.getElementById('maxCoreTemperature');

const enemyShieldElement = document.getElementById('enemyShieldsID');
const enemyHealthElement = document.getElementById('enemyHealthID');
const enemyDistanceElement = document.getElementById('enemyDistance');

const increaseEngineButton = document.getElementById('increaseEngine');
const increaseWeaponButton = document.getElementById('increaseWeapon');
const increaseShieldButton = document.getElementById('increaseShield');
const decreaseEngineButton = document.getElementById('decreaseEngine');
const decreaseWeaponButton = document.getElementById('decreaseWeapon');
const decreaseShieldButton = document.getElementById('decreaseShield');

const flyTowardEnemyButton = document.getElementById('towardEnemy');
const flyAwayEnemyButton = document.getElementById('awayEnemy');

const level1button = document.getElementById('level1button');
const level2button = document.getElementById('level2button');
const startLevelButton = document.getElementById('startLevel');
const notificationBox1 = document.getElementById('notificationBox1');
const notificationBox2 = document.getElementById('notificationBox2');
const commsBoxElement = document.getElementById('comms-box');

const shipElement = document.querySelector('.ship');
const shieldElement = document.querySelector('.shield');
const thrustersElement = document.querySelector('.thrusters');
const enemyVisualElement = document.getElementById('enemyVisual');

const playAreaElement = document.getElementById('playArea');
const enemyStatusElement = document.getElementById('enemyStatus');
const statusElement = document.getElementById('status');
const reactorControlsElement = document.getElementById('reactorControls');
const flightControlsElement = document.getElementById('flightControls');
const continueButtonElement = document.getElementById('continueButton');
continueButtonElement.style.display = 'none';
const creditsDisplay = document.getElementById('creditsAmount');



//#endregion

//#region Buttons and Controls
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'o':
            increaseEngineButton.click();
            break;
        case 'i':
            decreaseEngineButton.click();
            break;
        case 'k':
            increaseWeaponButton.click();
            break;
        case 'j':
            decreaseWeaponButton.click();
            break;
        case 'm':
            increaseShieldButton.click();
            break;
        case 'n':
            decreaseShieldButton.click();
            break;
        case 'Enter':
            continueButtonElement.click();
            break;
        default:
            // Do nothing for other keys
            break;
    }
});

function waitForButtonClick(buttonElement) {
    return new Promise(resolve => {
        const onClick = () => {
            buttonElement.removeEventListener('click', onClick);
            resolve();
        };
        buttonElement.addEventListener('click', onClick);
    });
}

increaseEngineButton.onclick = function () {
    if (availablePower > 0) {
        enginePower = increase(enginePower, 1, "engine");
        updateStarSpeed(enginePower + 0.1);
        document.documentElement.style.setProperty('--scale-factor', (enginePower / 10.5).toString());
    }
};

increaseWeaponButton.onclick = function () {
    if (availablePower > 0) {
        weaponPower = increase(weaponPower, 1, "weapon");
    }
};

increaseShieldButton.onclick = function () {
    if (availablePower > 0) {
        shieldPower = increase(shieldPower, 1, "shield");
        document.documentElement.style.setProperty('--shield-power', shieldPower.toString());
    }
};

decreaseEngineButton.onclick = function () {
    if (availablePower <= maxAvailablePower) {
        enginePower = decrease(enginePower, 1, "engine");
        updateStarSpeed(enginePower + 0.1);
        document.documentElement.style.setProperty('--scale-factor', (enginePower / 10.5).toString());
    }
};

decreaseWeaponButton.onclick = function () {
    if (availablePower <= maxAvailablePower) {
        weaponPower = decrease(weaponPower, 1, "weapon");
    }
};

decreaseShieldButton.onclick = function () {
    if (availablePower <= maxAvailablePower) {
        shieldPower = decrease(shieldPower, 1, "shield");
        document.documentElement.style.setProperty('--shield-power', shieldPower.toString());
    }
};

flyTowardEnemyButton.onclick = function () {
    flyingTowardEnemy = true;
};

flyAwayEnemyButton.onclick = function () {
    flyingTowardEnemy = false;
    showNotification("Flying away from the enemy!", "neutral");
};

//#endregion





function startDivertGame() {
    updateAllMeters();
    regenerateShield();
    initializeCoreTemperature();
    setInterval(calculateEnemyDistance, 100);
    gameOver = false;
    document.documentElement.style.setProperty('--scale-factor', enginePower.toString());
    document.documentElement.style.setProperty('--shield-health', shieldHealth.toString());
    document.documentElement.style.setProperty('--shield-power', shieldPower.toString());

    starSpawnInterval = setInterval(() => {
        if (starCounter < 250) {
            createStar(enginePower + 0.1);
            starCounter++;
        } else {
            clearInterval(starSpawnInterval);
        }
    }, 50);
}

function createStar(speed) {
    const star = document.createElement('div');
    star.className = 'stars';

    const xPos = Math.random() * window.innerWidth;
    const yPos = -10;

    star.style.left = `${xPos}px`;
    star.style.top = `${yPos}px`;

    const size = Math.random() + 0.5;

    star.style.width = size + 'px';
    star.style.height = size + 'px';

    const twinklingDelay = Math.random() * 2;

    const randomFactor = Math.random() * 2 + 0.5;
    const newDuration = Math.max(1, 10 / (speed * randomFactor + 1));

    star.style.animation = `moveDown ${newDuration}s 0s linear infinite, twinkle 2s ${twinklingDelay}s infinite alternate`;
    star.style.animationPlayState = 'running';

    star.addEventListener('animationiteration', () => {
        if (star.getBoundingClientRect().top > window.innerHeight) {
            star.remove();
            const index = stars.indexOf(star);
            if (index !== -1) {
                stars.splice(index, 1);
            }
        }
    });

    document.body.appendChild(star);
    stars.push(star);
}

function updateStarSpeed(enginePower) {
    stars.forEach(star => {
        const currentDuration = parseFloat(getComputedStyle(star).animationDuration);
        const currentTime = Date.now();
        const elapsedTime = (currentTime - (star.animationStartTime || currentTime)) % currentDuration;

        const progress = elapsedTime / currentDuration;

        const randomFactor = Math.random() * 2 + 0.5;
        const newDuration = Math.max(1, 10 / (enginePower * randomFactor + 1));

        const adjustedElapsedTime = progress * newDuration;

        const twinklingDelay = Math.random() * 2;

        star.style.animationDuration = `${newDuration}s, 2s`;
        star.style.animationDelay = `${adjustedElapsedTime}ms, ${twinklingDelay}s`;

        star.style.animationPlayState = 'running';
        star.animationStartTime = currentTime - adjustedElapsedTime;
    });
}




//Update all meters
function updateAllMeters() {

    if (gameOver) {
        return;
    }

    updateMeter(availablePower, "available");
    updateMeter(enginePower, "engine");
    updateMeter(weaponPower, "weapon");
    updateMeter(shieldPower, "shield");
    updateMeter(shieldHealth, "shieldHealth");
    updateMeter(hullHealth, "hullHealth");
    updateMeter(enemyShieldHealth, "enemyShieldHealth");
    updateMeter(enemyHullHealth, "enemyHullHealth");
}


//Go to level page
function runLevel(level) {
    // Redirect to the divertgame.html page with the selected level as a parameter
    window.location.href = `divertgame.html?level=${level}`;
}

//Start the selected level
async function startLevel(level){
    continueButtonElement.style.display = 'none';
    if(level == 0){
        maxTemperature = 10000;
        runTutorial();
    }
    else if(level == 1){
        maxTemperature = 1000;
        spawnEnemy(20, 20, "laser", 6000, 20);
        showCommsMessage("Command", "Enemy ship detected! Destroy it before it escapes!", "white");
        await delay(2000);
        showCommsMessage("Hostile", "You can't stop us! We will escape!", "red");
    }
    else if(level == 2){
        maxTemperature = 1000;
        spawnEnemy(30, 30, "plasma", 6000);
    }

}

//Create a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Run tutorial
async function runTutorial() {
    playAreaElement.style.display = 'none';
    enemyStatusElement.style.display = 'none';
    statusElement.style.display = 'none';
    reactorControlsElement.style.display = 'none';
    flightControlsElement.style.display = 'none';
    enemyVisualElement.style.display = 'none';
    commsBoxElement.style.display = 'none';
    continueButtonElement.style.display = '';

    showNotification("Welcome to the tutorial! Click Continue or press Enter to continue.", "neutral", 1, 10000);

    await waitForButtonClick(continueButtonElement);
    continueButtonElement.style.display = 'none';

    showNotification("Piloting your spaceship requires knowledge of its systems. Let's walk through those now.", "neutral", 1, 9000);

    await delay(9000);
    showNotification("Here is your ship.", "neutral", 1, 4000);
    playAreaElement.style.display = '';

    continueButtonElement.style.display = '';
    await waitForButtonClick(continueButtonElement);
    continueButtonElement.style.display = 'none';

    showNotification("You can keep track of your ship's shields and health here.", "neutral", 1, 7000);
    statusElement.style.display = '';

    await delay(7000);
    showNotification("Be aware: shields can recharge, but health is gone for good until you return to base.");

    continueButtonElement.style.display = '';
    await waitForButtonClick(continueButtonElement);
    continueButtonElement.style.display = 'none';
    
    showNotification("Your primary job is to divert power between the three primary systems: Engines, Weapons, and Shields.", "neutral", 1, 7000);
    reactorControlsElement.style.display = '';


    await delay(7000);
    showNotification("You can adjust your ship's power levels here. Each system has a maximum power level, and when you run out of Available Power, you can't increase them further.", "neutral", 1, 8000);

    await delay(8000);
    showNotification("You also must keep track of the reactor Core Temperature. If it gets too high for too long, the ship will explode.", "neutral", 1, 7000);

    await delay(7000);
    showNotification("Try adjusting the power to each system by clicking the + and - buttons. To continue, increase the Weapon Power to 1.", "neutral", 1, 10000);

    await waitForButtonClick(increaseWeaponButton);

    showNotification("You can also adjust power using the keyboard (I and O for Engines, J and K for Weapons, and N and M for Shields.)", "neutral", 1, 10000);

    continueButtonElement.style.display = '';
    await waitForButtonClick(continueButtonElement);
    continueButtonElement.style.display = 'none';

    showNotification("Here is the enemy ship. Your goal is to destroy it before it escapes.", "neutral", 1, 6000);
    enemyStatusElement.style.display = '';
    enemyVisualElement.style.display = '';

    await delay(6000);
    showNotification("You can see the enemy's shields and hull health here.");

    continueButtonElement.style.display = '';
    await waitForButtonClick(continueButtonElement);
    continueButtonElement.style.display = 'none';

    showNotification("You can also adjust your ship's speed by flying toward or away from the enemy.", "neutral", 1, 6000);
    flightControlsElement.style.display = '';


    await delay(6000);
    showNotification("Try flying toward the enemy by clicking the 'Towards Enemy' button in your Flight Controls.");
    await waitForButtonClick(flyTowardEnemyButton);
    showNotification("Flying toward the enemy will make your and their weapons more effective.", "neutral", 1, 5000);
    await delay(5000);
    showNotification("Make sure they don't get too far away, or they'll escape!");

    continueButtonElement.style.display = '';
    await waitForButtonClick(continueButtonElement);
    continueButtonElement.style.display = 'none';

    showNotification("Status updates will appear here when they're about your ship,", "neutral", 1, 8000)
    showNotification("and here when they're about the enemy.", "neutral", 2, 8000);

    continueButtonElement.style.display = '';
    await waitForButtonClick(continueButtonElement);
    continueButtonElement.style.display = 'none';

    showNotification("You will also receive communications from your crew and other vessels in the Communications box.", "neutral", 1, 8000);
    commsBoxElement.style.display = '';
    showCommsMessage("Tutorial", "This is an incoming communication!", "white");

    continueButtonElement.style.display = '';
    await waitForButtonClick(continueButtonElement);
    continueButtonElement.style.display = 'none';

    showNotification("That's it for the tutorial! Click Continue to start the first level.");
    continueButtonElement.style.display = '';
    await waitForButtonClick(continueButtonElement);
    continueButtonElement.style.display = 'none';
    runLevel(1);

}


//Increase a meter by amount
function increase(increasingMeter, amount, meterType) {

    if (gameOver) {
        return;
    }

    var maxPower;
    if (meterType == "available") {
        maxPower = 20;
    }
    else if (meterType == "engine" || meterType == "weapon" || meterType == "shield") {
        maxPower = 10;
    }
    else if (meterType == "shieldHealth" || meterType == "hullHealth") {
        maxPower = 100;
    }


    if ((increasingMeter + amount) <= maxPower) {
        increasingMeter = increasingMeter + amount;
        updateMeter(increasingMeter, meterType);
        if (meterType == "engine" || meterType == "weapon" || meterType == "shield") {
            availablePower = decrease(availablePower, 1, "available");
        }
    }
    return increasingMeter;
}


//Decrease a meter by amount
function decrease(decreasingMeter, amount, meterType) {

    if (gameOver) {
        return;
    }
    // Check if decreasingMeter - amount is greater than or equal to 0
    if (decreasingMeter - amount >= 0) {
        decreasingMeter = decreasingMeter - amount;
        updateMeter(decreasingMeter, meterType);
        if (meterType == "engine" || meterType == "weapon" || meterType == "shield") {
            availablePower = increase(availablePower, 1, "available");
        }

    }
    return decreasingMeter;
}


//Regenerate shield
function regenerateShield() {
    setInterval(async () => {
        if (isRegenerating) {
            // Check if shields need regeneration
            if (shieldHealth < maxShieldHealth && shieldHealth > 0) {
                // Calculate regeneration speed based on shieldPower
                regenerationSpeed = shieldPower * 0.1; // Adjust the multiplier as needed

                // Calculate regeneration amount based on time since last regeneration
                elapsedTime = shieldRegenInterval / 1000; // Convert milliseconds to seconds
                regenerationAmount = regenerationSpeed * elapsedTime;

                // Update shieldHealth
                shieldHealth = increase(shieldHealth, Math.min(maxShieldHealth - shieldHealth, regenerationAmount), "shieldHealth");

                // Wait for a bit before updating the meter
                await new Promise(resolve => setTimeout(resolve, 100)); // Adjust the delay as needed
                updateMeter(shieldHealth, "shieldHealth");
            } else if (shieldHealth <= 0) {
                // Disable normal regeneration and wait for a few seconds
                isRegenerating = false;
                setTimeout(async () => {
                    // Reset shieldHealth to starting value
                    shieldHealth = increase(shieldHealth, Math.min(maxShieldHealth - shieldHealth, regenerationAmount), "shieldHealth");

                    // Wait for a bit before updating the meter
                    await new Promise(resolve => setTimeout(resolve, 100)); // Adjust the delay as needed
                    updateMeter(shieldHealth, "shieldHealth");

                    // Enable normal regeneration
                    isRegenerating = true;
                }, regenDelay); // Delay in milliseconds // if shieldPower is 10, it should take 5 seconds to recharge. If shieldPower is 5, it should take 10 seconds to recharge. if shieldPower is 1, it should take 50 seconds to recharge. If shieldPower is 0, it should not recharge.
            }
        }
    }, shieldRegenInterval);
}

//Run core-temperature
function initializeCoreTemperature(){
    maxTemperatureElement.textContent = `/${Math.round(maxTemperature)}°C`;

    setInterval(() => {
        updateCoreTemperature();
    }, 500);
    checkCoreTemperature();

}
function updateCoreTemperature() {
    const totalPowerUsage = enginePower + weaponPower + shieldPower;

    // Calculate the percentage of power used
    const powerPercentage = (totalPowerUsage / maxAvailablePower) * 100;

    // Determine temperature change based on power usage
    if (powerPercentage <= 50) {
        // If using less than half of available power, decrease core temperature
        coreTemperature -= (50 - powerPercentage) * 0.4; // Adjust temperature change rate as needed
    } else {
        // If using more than half of available power, increase core temperature
        coreTemperature += (powerPercentage - 50) * 0.4; // Adjust temperature change rate as needed
    }

    // Ensure core temperature stays within bounds
    coreTemperature = Math.max(0, Math.min(coreTemperature, maxTemperature + 200));

    // Update core temperature display
    updateMeter(coreTemperature, "coreTemperature");
}


//Spawn an enemy
async function spawnEnemy(enemyHullHealth, enemyShieldHealth, damageType, damageRate, damageAmount = 30) {
    console.log("Enemy spawned");
    showNotification("An enemy ship has appeared!", "enemy", 2);
    await delay(3000);
    enemyCount++;
    updateMeter(enemyShieldHealth, "enemyShieldHealth");
    updateMeter(enemyHullHealth, "enemyHullHealth");

    let damageInterval = setInterval(() => {
        if (enemyHullHealth > 0 && !gameOver) {
            damage(damageType, damageAmount);
        } else {
            clearInterval(damageInterval);
        }
    }, damageRate);

    let attackInterval = setInterval(() => {
        if (enemyHullHealth > 0 && !gameOver) {
            attack("laser", weaponPower);
        } else {
            clearInterval(attackInterval);
        }
    }, 5000);
}


//#region Update meter visuals
function updateMeter(meter, meterType) {
    if (gameOver) {
        return;
    }
    const meterElements = {
        available: availablePowerElement,
        engine: enginePowerElement,
        weapon: weaponPowerElement,
        shield: shieldPowerElement,
        shieldHealth: shieldHealthElement,
        hullHealth: hullHealthElement,
        enemyHullHealth: enemyHealthElement,
        enemyShieldHealth: enemyShieldElement,
        coreTemperature: temperatureElement,
        maxCoreTemperature: maxTemperatureElement
    };

    const updatingElement = meterElements[meterType];

    if (meterType == "coreTemperature") {
        temperatureElement.textContent = `${Math.round(coreTemperature)}°C`;
    } else {
        updateMeterText(updatingElement, meter);
    }
}

function updateMeterText(element, targetLength) {
    const currentLength = element.textContent.length;
    const delay = 30; // Adjust the delay between characters as needed

    if (targetLength > currentLength) {
        // If the target length is greater, add characters one by one
        addCharacters(element, targetLength, currentLength, delay);
    } else if (targetLength < currentLength) {
        // If the target length is smaller, remove characters one by one
        removeCharacters(element, targetLength, currentLength, delay);
    }
}

function addCharacters(element, targetLength, currentLength, delay) {
    if (currentLength < targetLength) {
        element.textContent += "▄";
        setTimeout(() => {
            addCharacters(element, targetLength, currentLength + 1, delay);
        }, delay);
    }
}

function removeCharacters(element, targetLength, currentLength, delay) {
    if (currentLength > targetLength) {
        element.textContent = element.textContent.slice(0, -1);
        setTimeout(() => {
            removeCharacters(element, targetLength, currentLength - 1, delay);
        }, delay);
    }
}
//#endregion

//Calculate distance modifier for damage and attacks
function calculateDistanceModifier() {
    // Assuming a linear relationship between distance and damage
    const distanceRange = maxDistance - minDistance;
    distanceModifier = 1 - ((enemyDistance - minDistance) / distanceRange);

    // Ensure the modifier is within bounds (0 to 1)
    return Math.max(0, Math.min(distanceModifier, 1));
}

//Get damaged
function damage(damageType, amount) {

    if (gameOver) {
        return;
    }

    let damageMessage, damage;
    distanceModifier = calculateDistanceModifier();

    //Damage types
    if (damageType === "laser") {
        damageMessage = "laser beam";
        if (shieldHealth <= 0) {
            damage = Math.round((amount - 0.1 * enginePower) * distanceModifier);
        } else if (shieldHealth > 0) {
            damage = Math.round((amount - (shieldPower - 0.1 * enginePower)) * distanceModifier);
        }
    } else if (damageType === "plasma") {
        damageMessage = "plasma projectile";
        if (shieldHealth <= 0) {
            damage = Math.round((amount - 0.3 * enginePower) * distanceModifier);
        } else if (shieldHealth > 0) {
            damage = Math.round((amount - (0.8 * shieldPower - 0.3 * enginePower)) * distanceModifier);
        }
    }
    else if (damageType === "missile") {
        damageMessage = "missile";
        if (shieldHealth <= 0) {
            damage = Math.round((amount - 0.8 * enginePower) * distanceModifier);
        }
        else if (shieldHealth > 0) {
            damage = Math.round((amount - (0.3 * shieldPower - 0.8 * enginePower)) * distanceModifier);
        }
    }
    else if (damageType === "railgun") {
        damageMessage = "railgun shot";
        if (shieldHealth <= 0) {
            damage = Math.round((amount - 0.5 * enginePower) * distanceModifier);
        }
        else if (shieldHealth > 0) {
            damage = Math.round((amount - (0.5 * shieldPower - 0.5 * enginePower)) * distanceModifier);
        }
    }


    //Damaging the ship
    showNotification(`The enemy has fired a ${damageMessage} of <b>${amount}</b> strength!`, "enemy", 2);
    setTimeout(function () {
        document.documentElement.style.setProperty('--shield-health', shieldHealth.toString());

        if (damage > 0) {
            if (shieldHealth > 0) {
                if (damage >= shieldHealth) {
                    damage = shieldHealth;
                }
                shieldHealth = decrease(shieldHealth, damage, "shieldHealth");
                showNotification(`Your shields took <b>${Math.round(damage)}</b> points of damage.`, "enemy");
            } else if (shieldHealth <= 0) {
                if (damage >= hullHealth) {
                    death();
                }
                else {
                    hullHealth = decrease(hullHealth, damage, "hullHealth");
                    showNotification(`Your hull took <b>${Math.round(damage)}</b> points of damage.`, "enemy");
                }
            }
        } else if (damage <= 0) {
            showNotification("You avoided all damage!", "enemy");
        }
    }, 1500);
}

//Attack enemy ship
function attack(attackType, amount) {
    if (gameOver) {
        return;
    }

    let attackMessage, attack;
    distanceModifier = calculateDistanceModifier();

    if (attackType === "laser") {
        attackMessage = "laser beam";
        attack = Math.round((amount + 0.1 * weaponPower) * distanceModifier);
    } else if (attackType === "plasma") {
        attackMessage = "plasma projectile";
        attack = Math.round((amount + 0.3 * weaponPower) * distanceModifier);
    }
    else if (attackType === "missile") {
        attackMessage = "missile";
        attack = Math.round((amount + 0.8 * weaponPower) * distanceModifier);
    }
    else if (attackType === "railgun") {
        attackMessage = "railgun shot";
        attack = Math.round((amount + 0.5 * weaponPower) * distanceModifier);
    }
    if (amount > 0) {
        showNotification(`You have fired a ${attackMessage} of <b>${amount}</b> strength!`, "player");

        setTimeout(function () {
            if (enemyShieldHealth > 0) {
                if (attack >= enemyShieldHealth) {
                    attack = enemyShieldHealth;
                }
                enemyShieldHealth = decrease(enemyShieldHealth, attack, "enemyShieldHealth");
                showNotification(`The enemy's shields took <b>${Math.round(attack)}</b> points of damage.`, "player", 2);
            } else if (enemyShieldHealth <= 0) {
                if (attack >= enemyHullHealth) {
                    showCommsMessage("Command", "Enemy ship destroyed! Well done!", "white");
                    enemyHullHealth = 0;
                    updateMeter(enemyHullHealth, "enemyHullHealth");
                    enemyVisualElement.classList.add('explode');
                    endGame();
                }
                else {
                    enemyHullHealth = decrease(enemyHullHealth, attack, "enemyHullHealth");
                    showNotification(`The enemy's hull took <b>${Math.round(attack)}</b> points of damage.`, "player", 2);
                }
            }
            else if (attack <= 0) {
                showNotification("All damage was avoided by the enemy!", "enemy", 2);
            }
        }, 1500);

    }
    else if (amount <= 0) {
        showNotification("Your weapons didn't fire!", "enemy", 1);
    }

}


//Check core temperature for overheating
function checkCoreTemperature() {
    const timeThreshold = 7000; // Time threshold in milliseconds
    let overheatingTime = 0; // Time in milliseconds the temperature has been above threshold

    setInterval(() => {
        if (coreTemperature > maxTemperature) {
            console.log('overheatingTime increased');
            overheatingTime += 1000; // Increment by 1 second
            if (overheatingTime >= timeThreshold) {
                // Call death function if temperature remains high for too long
                showNotification("The ship has overheated!", "neutral");
                death();
            }
        } else if (overheatingTime >= 1000) {
            console.log('overheatingTime decreased');
            overheatingTime -= 1000; // Decrease overheating time if temperature is below threshold
        }

        if (overheatingTime == 0) {
            temperatureElement.style.color = "white";
        }
        if (overheatingTime > 0 && overheatingTime < 5000) {
            showNotification("WARNING: Core temperature above operating limits!", "neutral");
            temperatureElement.style.color = "orange";
        }
        else if (overheatingTime >= 5000) {
            showNotification("WARNING: Core temperature has been above maximum level for too long, explosion imminent!", "enemy");
            temperatureElement.style.color = "red";
        }
    }, 1000); // Check temperature every second
}

//Update enemy distance
function updateEnemyDistance() {
    enemyDistanceElement.textContent = `${enemyDistance} km`;
    scaleEnemySize();
}


function scaleEnemySize() {
    const startingSize = 120; // Adjust the starting font size as needed
    const minSize = 10; // Minimum font size when enemyDistance is maxDistance
    const fontSize = `${Math.max(startingSize - (enemyDistance / maxDistance * (startingSize - minSize)), minSize)}%`;
    enemyVisualElement.style.fontSize = fontSize;
}






function calculateEnemyDistance() {
    const distanceChangeRate = 5; // Adjust the rate at which the enemyDistance changes


    if (flyingTowardEnemy) {
        // Decrease enemyDistance when flying toward the enemy
        enemyDistance -= enginePower * distanceChangeRate;
    } else {
        // Increase enemyDistance when flying away from the enemy
        enemyDistance += enginePower * distanceChangeRate;
    }

    // Ensure enemyDistance stays within bounds
    enemyDistance = Math.max(minDistance, Math.min(enemyDistance, maxDistance));

    // Check if the enemy has escaped
    if (enemyDistance >= maxDistance) {
        showNotification("The enemy has escaped!", "enemy");
        endGame();
    }
    updateEnemyDistance();
}

//End the game
async function endGame() {
    gameOver = true;
    continueButtonElement.style.display = '';
    await waitForButtonClick(continueButtonElement);
    window.location.href = `divertlevelselector.html`;

    continueButtonElement.style.display = 'none';

}


//Player ship destruction
async function death() {
    showNotification("Your ship has been destroyed!", "enemy", 1, 20000);
    hullHealth = 0;
    shieldHealth = 0;
    updateMeter(hullHealth, "hullHealth");
    updateMeter(shieldHealth, "shieldHealth");

    shipElement.classList.add('explode');
    shieldElement.classList.add('explode');
    thrustersElement.classList.add('explode');




    endGame();
}

//Display a notification
function showNotification(message, type = 'neutral', box = 1, duration = 7000) {

    if (gameOver) {
        return;
    }

    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = message;

    // Determine the color based on the specified type
    switch (type) {
        case 'enemy':
            notification.style.color = 'red'; // Enemy damage notification
            break;
        case 'player':
            notification.style.color = 'green'; // Player attack notification
            break;
        default:
            notification.style.color = 'white'; // Neutral notification
            break;
    }

    if (box == 1) {
        notificationBox1.prepend(notification);
    }
    else {
        notificationBox2.prepend(notification);
    }

    // Set the animation duration
    notification.style.animationDuration = `${duration}ms`;

    // Remove the notification after the specified duration
    setTimeout(() => {
        notification.remove();
    }, duration);
}

// Full console log:
// console.log("Message count: " + messageCount);
// console.log("Line count" + lines);
// console.log("Message length" + message.length);

//Display a new comms message
const maxLines = 4; // Adjust this value to set the maximum number of lines
const maxCharsPerLine = 35; // Adjust this value to set the maximum number of characters per line

function showCommsMessage(name, message, color) {
    // Create a new message element
    const messageElement = document.createElement('div');
    messageElement.classList.add('comms-message');

    // Create a new name element
    const nameElement = document.createElement('span');
    nameElement.classList.add('comms-name');
    nameElement.textContent = `${name}: `;
    nameElement.style.color = color; // Set the color of the name element

    // Create a new text element for the message content
    const textElement = document.createElement('span');
    textElement.classList.add('comms-text');

    // Append the name and text elements to the message element
    messageElement.append(nameElement, textElement);

    // Prepend the message element to the comms-box
    commsBoxElement.prepend(messageElement);

    // Calculate the number of lines the message will take up
    const lines = Math.ceil(message.length / maxCharsPerLine);
    messageElement.dataset.lines = lines; // Store the number of lines in a data attribute

    // Create a typing effect
    let i = 0;
    const typingEffect = setInterval(() => {
        if (i < message.length) {
            textElement.textContent += message.charAt(i);
            i++;
        } else {
            clearInterval(typingEffect);
        }
    }, 25); // Adjust the speed of typing here


    console.log("Message after loop: " + messageElement.textContent);
    
    // Set a timeout to remove the message after 15 seconds
    setTimeout(() => {
        // Check if the message is still in the commsBox
        if (commsBoxElement.contains(messageElement)) {
            // Remove the message element
            messageElement.remove();
            // Subtract the number of lines in the removed message from the totalLines
            totalLines -= lines;
        }
    }, 15000);

    // Update the total number of lines in the commsBox
    let totalLines = Array.from(commsBoxElement.getElementsByClassName('comms-message'))
        .reduce((total, message) => total + Number(message.dataset.lines), 0);

    // If the maximum number of lines is reached, remove the oldest messages
    while (totalLines > maxLines) {
        // Get all the message elements
        const messages = commsBoxElement.getElementsByClassName('comms-message');
        // If there are no messages, exit the loop
        if (messages.length === 0) break;
        // Subtract the number of lines in the oldest message from the total
        totalLines -= Number(messages[messages.length - 1].dataset.lines);
        // Remove the oldest message
        messages[messages.length - 1].remove();
    }
}

function updateCreditsDisplay() {
    creditsDisplay.textContent = playerCredits; // Make sure this variable is defined in your linked JS file
}












//Reset the game
function resetGame() {
    availablePower = 20;
    enginePower = 0;
    weaponPower = 0;
    shieldPower = 0;
    shieldHealth = 50;
    hullHealth = 50;
    enemyCount = 0;
    enemyShieldHealth = 20;
    enemyHullHealth = 20;
    gameOver = false;
    meters = Array(availablePower, enginePower, weaponPower, shieldPower, shieldHealth, hullHealth);
    updateAllMeters();
    document.documentElement.style.setProperty('--scale-factor', enginePower.toString());
    document.documentElement.style.setProperty('--shield-health', shieldHealth.toString());
    document.documentElement.style.setProperty('--shield-power', shieldPower.toString());
    shipElement.classList.remove('explode');
    shieldElement.classList.remove('explode');
    thrustersElement.classList.remove('explode');
    enemyVisualElement.classList.remove('explode');
    notificationBox.innerHTML = '';
    gameOver = false;
    startDivertGame();
}


startDivertGame();
