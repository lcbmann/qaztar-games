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


const shipElement = document.querySelector('.ship');
const shieldElement = document.querySelector('.shield');
const thrustersElement = document.querySelector('.thrusters');

//#endregion

//#region Buttons and Controls
document.addEventListener('keydown', function(event) {
    switch(event.key) {
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
        default:
            // Do nothing for other keys
            break;
    }
});



increaseEngineButton.onclick = function() {
    if(availablePower > 0){
        enginePower = increase(enginePower, 1, "engine");
        updateStarSpeed(enginePower);
        document.documentElement.style.setProperty('--scale-factor', (enginePower / 10.5).toString());
    }
};

increaseWeaponButton.onclick = function() {
    if(availablePower > 0){
        weaponPower = increase(weaponPower, 1, "weapon");
    }
};

increaseShieldButton.onclick = function() {
    if(availablePower > 0){
        shieldPower = increase(shieldPower, 1, "shield");
        document.documentElement.style.setProperty('--shield-power', shieldPower.toString());
    }
};

decreaseEngineButton.onclick = function () {
    if(availablePower <= maxAvailablePower){
        enginePower = decrease(enginePower, 1, "engine");
        updateStarSpeed(enginePower);
        document.documentElement.style.setProperty('--scale-factor', (enginePower / 10.5).toString());
    }
};

decreaseWeaponButton.onclick = function () {
    if(availablePower <= maxAvailablePower){
        weaponPower = decrease(weaponPower, 1, "weapon");
    }
};

decreaseShieldButton.onclick = function () {
    if(availablePower <= maxAvailablePower){
        shieldPower = decrease(shieldPower, 1, "shield");
        document.documentElement.style.setProperty('--shield-power', shieldPower.toString());
    }
};

flyTowardEnemyButton.onclick = function() {
    flyingTowardEnemy = true;
    showNotification("Flying toward the enemy!", "neutral");
};

flyAwayEnemyButton.onclick = function() {
    flyingTowardEnemy = false;
    showNotification("Flying away from the enemy!", "neutral");
};

//#endregion


//Start game
//Start game
let starSpawnInterval;
const stars = []; // Store references to the created stars
let starCounter = 0; // Counter to track the number of stars created


function startDivertGame(){
    updateAllMeters();
    regenerateShield();
    initializeCoreTemperature();
    setInterval(calculateEnemyDistance, 100); // Adjust the interval as needed
    gameOver = false;
    document.documentElement.style.setProperty('--scale-factor', enginePower.toString());
    document.documentElement.style.setProperty('--shield-health', shieldHealth.toString());
    document.documentElement.style.setProperty('--shield-power', shieldPower.toString());

    // Spawn stars continuously at random x coordinates along the top of the screen
    starSpawnInterval = setInterval(() => {
        if (starCounter < 150) {
            createStar(enginePower + 0.1);
            starCounter++;
        } else {
            clearInterval(starSpawnInterval); // Stop spawning stars
        }
    }, 50); // Adjust the interval for star spawning as needed
}

function createStar(speed) {
    const star = document.createElement('div');
    star.className = 'stars';

    star.animationStartTime = Date.now();

    const xPos = Math.random() * window.innerWidth;
    // Start the stars at the top of the screen
    const yPos = -10;

    // Initial position
    star.style.left = `${xPos}px`;
    star.style.top = `${yPos}px`;

    // Generate a random size between 1 and 2
    const size = Math.random() + 1;

    // Set the width and height of the star to the random size
    star.style.width = size + 'px';
    star.style.height = size + 'px';

    // Randomize animation delay for twinkling effect
    const twinklingDelay = Math.random() * 2; // Adjust the delay as needed

    // Set animation duration based on enginePower
    const randomFactor = Math.random() * 2 + 0.5; // Adjust the range as needed
    const newDuration = Math.max(1, 10 / (speed * randomFactor + 1)); // Ensure minimum duration is 1s

    star.style.animation = `moveDown ${newDuration}s 0s linear infinite, twinkle 2s ${twinklingDelay}s infinite alternate`;
    star.style.animationPlayState = 'running'; // Start the animations immediately

    // Add an event listener to remove the star if it's outside the viewport
    star.addEventListener('animationiteration', () => {
        if (star.getBoundingClientRect().top > window.innerHeight) {
            star.remove();
            // Remove the reference from the stars array
            const index = stars.indexOf(star);
            if (index !== -1) {
                stars.splice(index, 1);
            }
        }
    });

    document.body.appendChild(star);
    // Store the reference to the created star
    stars.push(star);
}

function updateStarSpeed(enginePower) {
    // Adjust animation duration for existing stars
    stars.forEach(star => {
        // Pause the animation and get the current progress
        star.style.animationPlayState = 'paused';
        const currentDuration = parseFloat(getComputedStyle(star).animationDuration); // Get the current duration
        const currentTime = Date.now();
        const elapsedTime = (currentTime - (star.animationStartTime || currentTime)) % currentDuration; // Calculate elapsed time since animation start

        // Calculate the progress of the moveDown animation
        const progress = elapsedTime / currentDuration;

        // After the fade out animation is complete, update the speed and fade the star back in
        const randomFactor = Math.random() * 2 + 0.5; // Adjust the range as needed
        const newDuration = Math.max(1, 10 / (enginePower * randomFactor + 1)); // Calculate new duration

        // Adjust the elapsedTime based on the progress and the new duration
        const adjustedElapsedTime = progress * newDuration;

        // Update the moveDown animation with the new duration and the adjusted progress
        const twinklingDelay = Math.random() * 2; // Adjust the delay as needed

        // Update the animation-duration and animation-delay properties separately
        star.style.animationDuration = `${newDuration}s, 2s`;
        star.style.animationDelay = `${adjustedElapsedTime}ms, ${twinklingDelay}s`;

        star.style.animationPlayState = 'running';
        star.animationStartTime = currentTime - adjustedElapsedTime; // Store the adjusted animation start time
    });
}














//Update all meters
function updateAllMeters(){

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
function startLevel(level){
    if(level == 1){
        spawnEnemy(20, 20, "laser", 6000, 20);
        
    }
    else if(level == 2){
        spawnEnemy(30, 30, "plasma", 6000);
    }

}



//Increase a meter by amount
function increase(increasingMeter, amount, meterType){

    if (gameOver) {
        return;
    }

    var maxPower; 
    if(meterType == "available"){
        maxPower = 20;
    }
    else if(meterType == "engine" || meterType == "weapon" || meterType == "shield"){
        maxPower = 10;
    }
    else if(meterType == "shieldHealth" || meterType == "hullHealth"){
        maxPower = 100;
    }


    if((increasingMeter + amount) <= maxPower){
        increasingMeter = increasingMeter + amount;
        updateMeter(increasingMeter, meterType);
        if(meterType == "engine" || meterType == "weapon" || meterType == "shield"){
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
        if(meterType == "engine" || meterType == "weapon" || meterType == "shield"){
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
function spawnEnemy(enemyHullHealth, enemyShieldHealth, damageType, damageRate, damageAmount = 30) {
    console.log("Enemy spawned");
    showNotification("An enemy ship has appeared!", "enemy", 2);
    enemyCount++;
    updateMeter(enemyShieldHealth, "enemyShieldHealth");
    updateMeter(enemyHullHealth, "enemyHullHealth");

    let damageInterval = setInterval(() => {
        if(enemyHullHealth > 0 && !gameOver){
            damage(damageType, damageAmount);
        } else {
            clearInterval(damageInterval);
        }
    }, damageRate);

    let attackInterval = setInterval(() => {
        if(enemyHullHealth > 0 && !gameOver){
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
        coreTemperature: temperatureElement
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
    else if (damageType === "missile"){
        damageMessage = "missile";
        if(shieldHealth <= 0){
            damage = Math.round((amount - 0.8 * enginePower) * distanceModifier);
        }
        else if(shieldHealth > 0){
            damage = Math.round((amount - (0.3 * shieldPower - 0.8 * enginePower)) * distanceModifier);
        }
    }
    else if (damageType === "railgun"){
        damageMessage = "railgun shot";
        if(shieldHealth <= 0){
            damage = Math.round((amount - 0.5 * enginePower) * distanceModifier);
        }
        else if(shieldHealth > 0){
            damage = Math.round((amount - (0.5 * shieldPower - 0.5 * enginePower)) * distanceModifier);
        }
    }


    //Damaging the ship
    showNotification(`The enemy has fired a ${damageMessage} of <b>${amount}</b> strength!`, "enemy", 2);
    setTimeout(function() {
    document.documentElement.style.setProperty('--shield-health', shieldHealth.toString());

        if (damage > 0) {
            if (shieldHealth > 0) {
                if (damage >= shieldHealth) {
                    damage = shieldHealth;
                }
                shieldHealth = decrease(shieldHealth, damage, "shieldHealth");
                showNotification(`Your shields took <b>${damage}</b> points of damage.`, "enemy");
            } else if (shieldHealth <= 0) {
                if (damage >= hullHealth) {
                    death();
                }
                else {
                    hullHealth = decrease(hullHealth, damage, "hullHealth");
                    showNotification(`Your hull took <b>${damage}</b> points of damage.`, "enemy");
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
    else if (attackType === "missile"){
        attackMessage = "missile";
        attack = Math.round((amount + 0.8 * weaponPower) * distanceModifier);
    }
    else if (attackType === "railgun"){
        attackMessage = "railgun shot";
        attack = Math.round((amount + 0.5 * weaponPower) * distanceModifier);
    }

    showNotification(`You have fired a ${attackMessage} of <b>${amount}</b> strength!`, "player");
    setTimeout(function() {
        if (attack > 0) {
            if (enemyShieldHealth > 0) {
                if (attack >= enemyShieldHealth) {
                    attack = enemyShieldHealth;
                }
                enemyShieldHealth = decrease(enemyShieldHealth, attack, "enemyShieldHealth");
                showNotification(`The enemy's shields took <b>${attack}</b> points of damage.`, "player", 2);
            } else if (enemyShieldHealth <= 0) {
                if (attack >= enemyHullHealth) {
                    showNotification("The enemy ship has been destroyed!", "player", 2);
                    enemyHullHealth = 0;
                    updateMeter(enemyHullHealth, "enemyHullHealth");
                    endGame();
                }
                else {
                    enemyHullHealth = decrease(enemyHullHealth, attack, "enemyHullHealth");
                    showNotification(`The enemy's hull took <b>${attack}</b> points of damage.`, "player", 2);
                }
            }
        } else if (attack <= 0) {
            showNotification("All damage was avoided by the enemy!", "enemy", 2);
        }
    }, 1500);
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
        } else if (overheatingTime >= 1000){
            console.log('overheatingTime decreased');
            overheatingTime -= 1000; // Decrease overheating time if temperature is below threshold
        }

        if(overheatingTime == 0){
            temperatureElement.style.color = "white";
        }
        if(overheatingTime > 0 && overheatingTime < 5000){
            showNotification("WARNING: Core temperature above operating limits!", "neutral");
            temperatureElement.style.color = "orange";
        }
        else if(overheatingTime >= 5000){
            showNotification("WARNING: Core temperature has been above maximum level for too long, explosion imminent!", "enemy");
            temperatureElement.style.color = "red";
        }
    }, 1000); // Check temperature every second
}

//Update enemy distance
function updateEnemyDistance() {
    enemyDistanceElement.textContent = `${enemyDistance} km`;
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
function endGame() {
    gameOver = true;
    setTimeout(() => {
        window.location.href = `divertlevelselector.html`;
    }, 6000);
}


//Player ship destruction
function death(){
    showNotification("Your ship has been destroyed!", "enemy");
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
function showNotification(message, type = 'neutral', box = 1) {

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

    if(box == 1){
        notificationBox1.prepend(notification);
    }
    else{
        notificationBox2.prepend(notification);
    }
    

    // Remove the notification after 7 seconds
    setTimeout(() => {
        notification.remove();
    }, 7000);
}

//Reset the game
function resetGame(){
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
    notificationBox.innerHTML = '';
    gameOver = false;
    startDivertGame();
}
// Usage example:
showNotification('Notification box initialized.');

    
startDivertGame();

