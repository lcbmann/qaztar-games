var availablePower = 20;
var maxAvailablePower = 20;
var enginePower = 0;
var weaponPower = 0;
var shieldPower = 0;
var shieldHealth = 50;
var hullHealth = 50;


meters = Array(availablePower, enginePower, weaponPower, shieldPower, shieldHealth, hullHealth);


var attackType;

const descriptionsElement = document.getElementById('descriptions');
const attacksElement = document.getElementById('attacks');
const statusReportsElement = document.getElementById('statusReports');

const availablePowerElement = document.getElementById('availablePowerID');
const enginePowerElement = document.getElementById('enginePowerID');
const weaponPowerElement = document.getElementById('weaponPowerID');
const shieldPowerElement = document.getElementById('shieldPowerID');
const shieldHealthElement = document.getElementById('shieldHealthID');
const hullHealthElement = document.getElementById('hullHealthID')

const increaseEngineButton = document.getElementById('increaseEngine');
const increaseWeaponButton = document.getElementById('increaseWeapon');
const increaseShieldButton = document.getElementById('increaseShield');
const decreaseEngineButton = document.getElementById('decreaseEngine');
const decreaseWeaponButton = document.getElementById('decreaseWeapon');
const decreaseShieldButton = document.getElementById('decreaseShield');

const startLevelButton = document.getElementById('startLevel');
const notificationBox = document.getElementById('notificationBox');


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
    }
};

//Start game
function startDivertGame(){
    updateAllMeters();
    document.documentElement.style.setProperty('--scale-factor', enginePower.toString());
}   

//Update all meters
function updateAllMeters(){
    updateMeter(availablePower, "available");
    updateMeter(enginePower, "engine");
    updateMeter(weaponPower, "weapon");
    updateMeter(shieldPower, "shield");
    updateMeter(shieldHealth, "shieldHealth");
    updateMeter(hullHealth, "hullHealth");
}



//Activate the level
function startLevel() {

    //Event 1 - 5 seconds in
    showNotification("Incoming laser attack from an enemy ship!");
    setTimeout(function() {
        attack("laser", 10);
        
        setTimeout(function() {
            showNotification("Incoming plasma attack from an enemy ship!");

            //Event 2
            setTimeout(function() {
                attack("plasma", 10);
                
                setTimeout(function() {
                    showNotification("Incoming missile attack from an enemy ship!");

                    //Event 3
                    setTimeout(function() {
                        attack("missile", 10);
                    }, 5000);
                }, 5000);
    
                
            }, 5000);

        }, 5000);

        
    }, 5000);
}



//Increase a meter by amount
function increase(increasingMeter, amount, meterType){
    var maxPower; 
    if(increasingMeter == availablePower){
        maxPower = 20;
    }
    else if(increasingMeter == enginePower || increasingMeter == weaponPower || increasingMeter == shieldPower){
        maxPower = 10;
    }
    else if(increasingMeter == (shieldHealth || hullHealth)){
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

//Update meter visuals
function updateMeter(meter, meterType) {
    const meterElements = {
        available: availablePowerElement,
        engine: enginePowerElement,
        weapon: weaponPowerElement,
        shield: shieldPowerElement,
        shieldHealth: shieldHealthElement,
        hullHealth: hullHealthElement
    };

    const updatingElement = meterElements[meterType];

    if (meter > updatingElement.textContent.length) {
        updatingElement.textContent += "▓".repeat(meter - updatingElement.textContent.length);
    } else if (meter < updatingElement.textContent.length) {
        updatingElement.textContent = updatingElement.textContent.slice(0, meter);
    }
}


//Launch attack on the ship
function attack(attackType, amount) {
    let attackMessage, damage;

    //Attack types
    if (attackType === "laser") {
        attackMessage = "laser beam";
        damage = Math.round(amount - shieldPower - 0.1 * enginePower);
    } else if (attackType === "plasma") {
        attackMessage = "plasma projectile";
        damage = Math.round(amount - 0.8 * shieldPower - 0.3 * enginePower);
    }
    else if (attackType === "missile"){
        attackMessage = "missile";
        damage = Math.round(amount - 0.3 * shieldPower - 0.8 * enginePower);
    }


    //Damaging the ship
    showNotification(`The enemy has fired a ${attackMessage} of <b>${amount}</b> strength!`);

    setTimeout(function() {
        if (damage > 0) {
            if (shieldHealth > 0) {
                if (damage >= shieldHealth) {
                    damage = shieldHealth;
                }
                shieldHealth = decrease(shieldHealth, damage, "shieldHealth");
                showNotification(`The shields took <b>${damage}</b> points of damage.`);
            } else if (shieldHealth <= 0) {
                if (damage >= hullHealth) {
                    damage = hullHealth;
                }
                hullHealth = decrease(hullHealth, damage, "hullHealth");
                showNotification(`The hull took <b>${damage}</b> points of damage.`);
            }
        } else if (damage <= 0) {
            showNotification("All damage was avoided!");
        }
    }, 1500);
}


function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = message;

    notificationBox.prepend(notification);

    // Remove the notification after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Usage example:
showNotification('Notification box initialized.');

    
startDivertGame();