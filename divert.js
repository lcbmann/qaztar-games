document.addEventListener("DOMContentLoaded", function () {
    // Your code inside this function will run when the DOM is fully loaded
    startDivertGame();
});

function startDivertGame(){
    var availablePower = 50;
    var enginePower = 0;
    var weaponPower = 0;
    var shieldPower = 0;
    var shieldHealth = 100;
    var hullHealth = 100;

    const availablePowerElement = document.getElementById('availablePower');
    const enginePowerElement = document.getElementById('enginePower');
    const weaponPowerElement = document.getElementById('weaponPower');
    const shieldPowerElement = document.getElementById('shieldPower');
    const shieldHealthElement = document.getElementById('shieldHealth');
    const hullHealthElement = document.getElementById('hullHealth')

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
}


function increase(increasingMeter, amount){
    var maxPower; 
    if(increasingMeter == availablePower){
        maxPower = 50;
    }
    else if(increasingMeter == (enginePower || weaponPower || shieldPower)){
        maxPower = 10;
    }
    else if(increasingMeter == (shieldHealth || hullHealth)){
        maxPower = 100;
    }

    if((increasingMeter + amount) < maxPower){
        increasingMeter = increasingMeter + amount;
        updateMeter(increasingMeter);
    }
}

function decrease(decreasingMeter, amount){
    if(decreasingMeter - amount > 0){
        decreasingMeter = decreasingMeter - amount;
        updateMeter(decreasingMeter);
        console.log(decreasingMeter + "is decreased by " + amount)
    }
}

function updateMeter(meter){
    var updatingElement;
    if(meter == availablePower){
        updatingElement = availablePowerElement;
    }
    else if(meter == enginePower){
        updatingElement = enginePowerElement;
        console.log("element set to engine");
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

    if(meter > updatingElement.textContent.length){
        while(meter > updatingElement.textContent.length){
            updatingElement.textContent = updatingElement.textContent + "▓";
        }
    }
    else if (meter < updatingElement.textContent.length){
        while(meter < updatingElement.textContent.length){
            updatingElement.textContent = updatingElement.textContent.slice(0, -1);
            console.log("text should be changed");
        }
    }

}
    