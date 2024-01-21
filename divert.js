var availablePower = 50;
var enginePower = 0;
var weaponPower = 0;
var shieldPower = 0;
var shieldHealth = 100;
var hullHealth = 100;

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

increaseEngineButton.onclick = function() {
    enginePower = increase(enginePower, 1, "engine");
};

increaseWeaponButton.onclick = function() {
    weaponPower = increase(weaponPower, 1, "weapon");
};

increaseShieldButton.onclick = function() {
    shieldPower = increase(shieldPower, 1, "shield");
};

decreaseEngineButton.onclick = function () {
    enginePower = decrease(enginePower, 1, "engine");
};

decreaseWeaponButton.onclick = function () {
    weaponPower = decrease(weaponPower, 1, "weapon");
};

decreaseShieldButton.onclick = function () {
    shieldPower = decrease(shieldPower, 1, "shield");
};


function startDivertGame(){
    console.log("enginePowerElement: " + enginePowerElement.textContent);
}


function increase(increasingMeter, amount, meterType){
    console.log("increase function: " + increasingMeter + " with amount " + amount)
    console.log("increasingMeter: " + increasingMeter + " and enginePower: " + enginePower)
    var maxPower; 
    if(increasingMeter == availablePower){
        maxPower = 50;
    }
    else if(increasingMeter == enginePower || increasingMeter == weaponPower || increasingMeter == shieldPower){
        maxPower = 10;
    }
    else if(increasingMeter == (shieldHealth || hullHealth)){
        maxPower = 100;
    }
    console.log("max power set to " + maxPower)

    if((increasingMeter + amount) < maxPower){
        console.log("if statement in increasing called")
        increasingMeter = increasingMeter + amount;
        updateMeter(increasingMeter, meterType);
        return increasingMeter;
    }
}

function decrease(decreasingMeter, amount, meterType) {
    console.log("decrease function: " + decreasingMeter + " with amount " + amount);

    // Check if decreasingMeter - amount is greater than or equal to 0
    if (decreasingMeter - amount >= 0) {
        console.log("if statement in decreasing called");
        decreasingMeter = decreasingMeter - 1;
        updateMeter(decreasingMeter, meterType);
        return decreasingMeter;
    } else {
        // If decreasingMeter - amount would be negative, return the original value
        return decreasingMeter;
    }
}

function updateMeter(meter, meterType){
    var updatingElement;
    console.log("engine power element length: " + enginePowerElement.textContent.length);
    if(meterType == "available"){
        updatingElement = availablePowerElement;
    }
    else if(meterType == "engine"){
        updatingElement = enginePowerElement;
        console.log("updatingElement set to enginePowerElement")
    }
    else if(meterType == "weapon"){
        updatingElement = weaponPowerElement;
    }
    else if(meterType == "shield"){
        updatingElement = shieldPowerElement;
    }
    else if(meterType == "shieldHealth"){
        updatingelement = shieldHealthElement;
    }
    else if(meterType == "hullHealth"){
        updatingElement = hullHealthElement;
    }

    if(meter > updatingElement.textContent.length){
        while(meter > updatingElement.textContent.length){
            updatingElement.textContent = updatingElement.textContent + "▓";
        }
    }
    else if (meter < updatingElement.textContent.length){
        while(meter < updatingElement.textContent.length){
            updatingElement.textContent = updatingElement.textContent.slice(0, -1);
        }
    }

}
    
startDivertGame();