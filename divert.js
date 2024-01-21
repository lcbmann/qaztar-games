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

startLevelButton.onclick = function(){
    startLevel();
}

increaseEngineButton.onclick = function() {
    if(availablePower > 0){
        enginePower = increase(enginePower, 1, "engine");
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


function updateAllMeters(){
    updateMeter(availablePower, "available");
    updateMeter(enginePower, "engine");
    updateMeter(weaponPower, "weapon");
    updateMeter(shieldPower, "shield");
    updateMeter(shieldHealth, "shieldHealth");
    updateMeter(hullHealth, "hullHealth");
}

function startDivertGame(){
    updateAllMeters();
}   

function startLevel(){
    descriptionsElement.innerText = "Incoming attack from an enemy ship!"
    setTimeout(attack("energy", 10), 10000);
}


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
        if(meterType != "available"){
            availablePower = decrease(availablePower, 1, "available");
        }
    }
    return increasingMeter;
}


function decrease(decreasingMeter, amount, meterType) {

    // Check if decreasingMeter - amount is greater than or equal to 0
    if (decreasingMeter - amount >= 0) {
        decreasingMeter = decreasingMeter - amount;
        updateMeter(decreasingMeter, meterType);
        if(meterType != "available"){
            availablePower = increase(availablePower, 1, "available");
        }
        
    }
    return decreasingMeter;
}

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



function attack(attackType, amount){
    if(attackType == "energy"){
        attacksElement.innerHTML = "The enemy has launched an energy attack of <b>" + amount + "</b> strength!";
        var damage = amount;
        damage = damage - shieldPower;
        damage = damage - (0.5 * enginePower);
        if(damage > 0){
            if(shieldHealth > 0){
                shieldHealth = decrease(shieldHealth, damage, "shieldHealth");
                statusReportsElement.innerHTML = "The shields took <b>" + damage + "</b> points of damage.";
            }
            else if (shieldHealth <= 0){
                hullHealth = decrease(hullHealth, damage, "hullHealth");
                statusReportsElement.innerHTML = "The hull took <b>" + damage + "</b> points of damage."
            }
        }
        else if (damage <= 0){
            statusReportsElement.innerHTML = "All damage was avoided!";
        }
    }
}
    
startDivertGame();