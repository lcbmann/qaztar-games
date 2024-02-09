var availablePower = 20;
var maxAvailablePower = 20;
var enginePower = 0;
var weaponPower = 0;
var shieldPower = 0;
var shieldHealth = 50;
var hullHealth = 50;

var enemyCount = 0;
var enemyShieldHealth = 20;
var enemyHullHealth = 20;

var maxShieldHealth = 50;
var shieldRegenInterval = 1000;
var regenDelay = 8000;
let isRegenerating = true;
var regenerationSpeed = shieldPower * 0.1;
var elapsedTime = shieldRegenInterval / 1000;
var regenerationAmount = regenerationSpeed * elapsedTime;


var gameOver = false;


meters = Array(availablePower, enginePower, weaponPower, shieldPower, shieldHealth, hullHealth);


var damageType;

const availablePowerElement = document.getElementById('availablePowerID');
const enginePowerElement = document.getElementById('enginePowerID');
const weaponPowerElement = document.getElementById('weaponPowerID');
const shieldPowerElement = document.getElementById('shieldPowerID');
const shieldHealthElement = document.getElementById('shieldHealthID');
const hullHealthElement = document.getElementById('hullHealthID')

const enemyShieldElement = document.getElementById('enemyShieldsID');
const enemyHealthElement = document.getElementById('enemyHealthID');

const increaseEngineButton = document.getElementById('increaseEngine');
const increaseWeaponButton = document.getElementById('increaseWeapon');
const increaseShieldButton = document.getElementById('increaseShield');
const decreaseEngineButton = document.getElementById('decreaseEngine');
const decreaseWeaponButton = document.getElementById('decreaseWeapon');
const decreaseShieldButton = document.getElementById('decreaseShield');

const startLevelButton = document.getElementById('startLevel');
const notificationBox = document.getElementById('notificationBox');

const shipElement = document.querySelector('.ship');
const shieldElement = document.querySelector('.shield');
const thrustersElement = document.querySelector('.thrusters');


startLevelButton.onclick = function(){
    startLevel();
}

increaseEngineButton.onclick = function() {
    if(availablePower > 0){
        enginePower = increase(enginePower, 1, "engine");
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

//Start game
function startDivertGame(){
    updateAllMeters();
    regenerateShield();
    document.documentElement.style.setProperty('--scale-factor', enginePower.toString());
    document.documentElement.style.setProperty('--shield-health', shieldHealth.toString());
    document.documentElement.style.setProperty('--shield-power', shieldPower.toString());
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



//Activate the level
function startLevel() {
    gameOver = false;

    spawnEnemy(enemyHullHealth, enemyShieldHealth, "laser", 5000);
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



function regenerateShield() {
    setInterval(() => {
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
    
                updateMeter(shieldHealth, "shieldHealth");
            } else if (shieldHealth <= 0) {
                // Disable normal regeneration and wait for a few seconds
                isRegenerating = false;
                setTimeout(() => {
                    // Reset shieldHealth to starting value
                    shieldHealth = increase(shieldHealth, Math.min(maxShieldHealth - shieldHealth, regenerationAmount), "shieldHealth");
                    updateMeter(shieldHealth, "shieldHealth");
                    // Enable normal regeneration
                    isRegenerating = true;
                }, regenDelay); // Delay in milliseconds // if shieldPower is 10, it should take 5 seconds to recharge. If shieldPower is 5, it should take 10 seconds to recharge. if shieldPower is 1, it should take 50 seconds to recharge. If shieldPower is 0, it should not recharge.
            } 
        }
    }, shieldRegenInterval);
}

//Spawn an enemy
function spawnEnemy(enemyHullHealth, enemyShieldHealth, damageType, damageRate) {
    showNotification("An enemy ship has appeared!", "enemy");
    enemyCount++;
    updateMeter(enemyShieldHealth, "enemyShieldHealth");
    updateMeter(enemyHullHealth, "enemyHullHealth");

    
    setInterval(() => {
        if(enemyHullHealth > 0 && !gameOver){
            damage(damageType, 30);
        }
    }, damageRate);


    setInterval(() => {
        if(enemyHullHealth > 0 && !gameOver){
            attack("laser", weaponPower);
        }
    }, 5000);
    
    
}


//Update meter visuals
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
        enemyShieldHealth: enemyShieldElement
    };

    const updatingElement = meterElements[meterType];

    if (meter > updatingElement.textContent.length) {
        updatingElement.textContent += "▄".repeat(meter - updatingElement.textContent.length);
    } else if (meter < updatingElement.textContent.length) {
        updatingElement.textContent = updatingElement.textContent.slice(0, meter);
    }
}


//Get damaged
function damage(damageType, amount) {

    if (gameOver) {
        return;
    }

    let damageMessage, damage;

    //Damage types
    if (damageType === "laser") {
        damageMessage = "laser beam";
        if (shieldHealth <= 0) {
            damage = Math.round(amount - 0.1 * enginePower);
        } else if (shieldHealth > 0) {
            damage = Math.round(amount - shieldPower - 0.1 * enginePower);
        }
    } else if (damageType === "plasma") {
        damageMessage = "plasma projectile";
        if (shieldHealth <= 0) {
            damage = Math.round(amount - 0.3 * enginePower);
        } else if (shieldHealth > 0) {
            damage = Math.round(amount - 0.8 * shieldPower - 0.3 * enginePower);
        }
    }
    else if (damageType === "missile"){
        damageMessage = "missile";
        if(shieldHealth <= 0){
            damage = Math.round(amount - 0.8 * enginePower);
        }
        else if(shieldHealth > 0){
            damage = Math.round(amount - 0.3 * shieldPower - 0.8 * enginePower);
        }
    }
    else if (damageType === "railgun"){
        damageMessage = "railgun shot";
        if(shieldHealth <= 0){
            damage = Math.round(amount - 0.5 * enginePower);
        }
        else if(shieldHealth > 0){
            damage = Math.round(amount - 0.5 * shieldPower - 0.5 * enginePower);
        }
    }


    //Damaging the ship
    showNotification(`The enemy has fired a ${damageMessage} of <b>${amount}</b> strength!`, "enemy");
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
            showNotification("You avoided all damage!", "player");
        }
    }, 1500);
}

function attack(attackType, amount) {
    if (gameOver) {
        return;
    }

    let attackMessage, attack;

    if (attackType === "laser") {
        attackMessage = "laser beam";
        attack = Math.round(amount + 0.1 * weaponPower);
    } else if (attackType === "plasma") {
        attackMessage = "plasma projectile";
        attack = Math.round(amount + 0.3 * weaponPower);
    }
    else if (attackType === "missile"){
        attackMessage = "missile";
        attack = Math.round(amount + 0.8 * weaponPower);
    }
    else if (attackType === "railgun"){
        attackMessage = "railgun shot";
        attack = Math.round(amount + 0.5 * weaponPower);
    }

    showNotification(`You have fired a ${attackMessage} of <b>${amount}</b> strength!`, "player");
    setTimeout(function() {
        if (attack > 0) {
            if (enemyShieldHealth > 0) {
                if (attack >= enemyShieldHealth) {
                    attack = enemyShieldHealth;
                }
                enemyShieldHealth = decrease(enemyShieldHealth, attack, "enemyShieldHealth");
                showNotification(`The enemy's shields took <b>${attack}</b> points of damage.`, "player");
            } else if (enemyShieldHealth <= 0) {
                if (attack >= enemyHullHealth) {
                    showNotification("The enemy ship has been destroyed!", "player");
                    enemyHullHealth = 0;
                    updateMeter(enemyHullHealth, "enemyHullHealth");
                    gameOver = true;
                }
                else {
                    enemyHullHealth = decrease(enemyHullHealth, attack, "enemyHullHealth");
                    showNotification(`The enemy's hull took <b>${attack}</b> points of damage.`, "player");
                }
            }
        } else if (attack <= 0) {
            showNotification("All damage was avoided by the enemy!", "enemy");
        }
    }, 1500);
}

function death(){
    showNotification("The ship has been destroyed!", "enemy");
    hullHealth = 0;
    updateMeter(hullHealth, "hullHealth");

    shipElement.classList.add('explode');
    shieldElement.classList.add('explode');
    thrustersElement.classList.add('explode');
    gameOver = true;
}

function showNotification(message, type = 'neutral') {

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

    notificationBox.prepend(notification);

    // Remove the notification after 7 seconds
    setTimeout(() => {
        notification.remove();
    }, 7000);
}


// Usage example:
showNotification('Notification box initialized.');

    
startDivertGame();

