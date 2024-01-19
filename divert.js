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
    increase(enginePower, 1);
};

increaseWeaponButton.onclick = function() {
    increase(weaponPower, 1);
};

increaseShieldButton.onclick = function() {
    increase(shieldPower, 1);
};

decreaseEngineButton.onclick = function() {
    decrease(enginePower, 1);
};

decreaseWeaponButton.onclick = function() {
    decrease(weaponPower, 1);
};

decreaseShieldButton.onclick = function() {
    decrease(shieldPower, 1);
};
function startDivertGame(){
    
}


function increase(increasingMeter, amount){
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
        updateMeter(increasingMeter);
    }
}

function decrease(decreasingMeter, amount){
    console.log("decrease function: " + decreasingMeter + " with amount " + amount)

    if(decreasingMeter - amount > 0){
        console.log("if statement in decreasing called")
        decreasingMeter = decreasingMeter - amount;
        updateMeter(decreasingMeter);
    }
}

function updateMeter(meter){
    var updatingElement;
    console.log("engine power element length: " + enginePowerElement.textContent.length);
    if(meter == availablePower){
        updatingElement = availablePowerElement;
    }
    else if(meter == enginePower){
        updatingElement = enginePowerElement;
    }
    else if(meter == weaponPower){
        updatingElement = weaponPowerElement;
    }
    else if(meter == shieldPower){
        updatingElement = shieldPowerElement;
    }
    else if(meter == shieldHealth){
        updatingelement = shieldHealthElement;
    }
    else if(meter == hullHealth){
        updatingElement = hullHealthElement;
    }

    if(meter > (updatingElement.textContent.length - 1)){
        while(meter > (updatingElement.textContent.length - 1)){
            updatingElement.textContent = updatingElement.textContent + "▓";
        }
    }
    else if (meter < (updatingElement.textContent.length - 1)){
        while(meter < (updatingElement.textContent.length - 1)){
            updatingElement.textContent = updatingElement.textContent.slice(0, -1);
        }
    }

}
    
startDivertGame();