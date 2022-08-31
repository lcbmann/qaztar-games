const textElement = document.getElementById('text');
const quoteElement = document.getElementById('quote');
const continueButtonElement = document.getElementById('continue-button');

const shipImageElement = document.getElementById('ascii-ship');

const goodLand1ImageElement = document.getElementById('ascii-good-land1');
const goodLand2ImageElement = document.getElementById('ascii-good-land2');
const goodLand3ImageElement = document.getElementById('ascii-good-land3');
const mediumLand1ImageElement = document.getElementById('ascii-medium-land1');
const mediumLand2ImageElement = document.getElementById('ascii-medium-land2');
const mediumLand3ImageElement = document.getElementById('ascii-medium-land3');
const badLand1ImageElement = document.getElementById('ascii-bad-land1');
const badLand2ImageElement = document.getElementById('ascii-bad-land2');
const badLand3ImageElement = document.getElementById('ascii-bad-land3');
var chosenLandElement;

const scenarioImageElements = document.getElementsByClassName('scenario-images');
const stormySeaImageElement = document.getElementById('ascii-stormy-sea');
const egestaImageElement = document.getElementById('ascii-egesta');
const distanceImageElement = document.getElementById('ascii-distance');
const revengeImageElement = document.getElementById('ascii-revenge');
const charscylImageElement = document.getElementById('ascii-charscyl');
const merchantImageElement = document.getElementById('ascii-merchant');
const islandImageElement = document.getElementById('ascii-island');
const volcanoImageElement = document.getElementById('ascii-volcano');
const cyclopsImageElement = document.getElementById('ascii-cyclops');
const olympusImageElement = document.getElementById('ascii-olympus');

const statusElements = document.getElementsByClassName('status');

const sailorCountElement = document.getElementById('sailor-count');
const shipCountElement = document.getElementById('ship-count');
const foodCountElement = document.getElementById('food-count');
const waterCountElement = document.getElementById('water-count');
const materialsCountElement = document.getElementById('materials-count');

const sailorChangeElement = document.getElementById('sailor-change');
const shipChangeElement = document.getElementById('ship-change');
const foodChangeElement = document.getElementById('food-change');
const waterChangeElement = document.getElementById('water-change');
const materialsChangeElement = document.getElementById('materials-change');

const landElements = document.getElementsByClassName('land');
const vegetationTierElement = document.getElementById('vegetation-tier');
const temperatureTierElement = document.getElementById('temperature-tier');
const harborTierElement = document.getElementById('harbor-tier');
const riverTierElement = document.getElementById('river-tier');
const nativesTierElement = document.getElementById('natives-tier');
const ruinsTierElement = document.getElementById('ruins-tier');

const allScoreElements = document.getElementsByClassName('score');
const scoreElement = document.getElementById('score');
const populationScoreElement = document.getElementById('population-score');
const temperatureScoreElement = document.getElementById('temperature-score');
const constructionScoreElement = document.getElementById('construction-score');
const ruinsScoreElement = document.getElementById('ruins-score');
var totalScore = 0;

const boonElements = document.getElementsByClassName('boon');
const ceresBoonElement = document.getElementById('ceres-boon');
const jupiterBoonElement = document.getElementById('jupiter-boon');
const neptuneBoonElement = document.getElementById('neptune-boon');
var ceresLevel = 0;
var jupiterLevel = 0;
var neptuneLevel = 0;
var isOffering = false;

var sailors = 100;
var ships = 10;
var food = 100;
var water = 100;
var materials = 100;
var sailorsChange = 0;
var shipsChange = 0;
var foodChange = 0;
var waterChange = 0;
var materialsChange = 0;

var assignedScenario;
var assignedQuote;
var assignedOption1;
var assignedOption2;
var assignedScenarioResult;

var attackedMerchant = false;
var revengeTaken = false;
var stolenFood = 0;
var stolenWater = 0;
var stolenMaterials = 0;

var completedUniqueScenarios = Array();
var completedUniqueScenariosLength = 0;

var completedScenarios = Array();
var scenarioId = 99;
var scenarioCount = 0;
var uniqueScenarioSwitch = false;

var dead = false;

let state = {};

//Start the game
function startGame(){
    shipImageElement.style.display = 'none';

    goodLand1ImageElement.style.display = 'none';
    goodLand2ImageElement.style.display = 'none';
    goodLand3ImageElement.style.display = 'none';
    mediumLand1ImageElement.style.display = 'none';
    mediumLand2ImageElement.style.display = 'none';
    mediumLand3ImageElement.style.display = 'none';
    badLand1ImageElement.style.display = 'none';
    badLand2ImageElement.style.display = 'none';
    badLand3ImageElement.style.display = 'none';

    completedUniqueScenariosLength = completedUniqueScenarios.length;

    continueButtonElement.classList.remove("continue-button-ending");
    void continueButtonElement.offsetWidth;
    continueButtonElement.classList.add("continue-button");

    for (let i = 0; i < scenarioImageElements.length; i++){
        scenarioImageElements[i].style.display = 'none'
    }

    for (let i = 0; i < statusElements.length; i++) {
        statusElements[i].style.display = 'none';
    }
    for (let i = 0; i < boonElements.length; i++) {
        boonElements[i].style.display = 'none';
    }
    for (let i = 0; i < landElements.length; i++) {
        landElements[i].style.display = 'none';
        landElements[i].style.color = '#FFFFFF';
    }
    riverTierElement.style.color = '#FFFFFF';
    nativesTierElement.style.color = '#FFFFFF';
    ruinsTierElement.style.color = '#FFFFFF';
    for (let i = 0; i < allScoreElements.length; i++) {
        allScoreElements[i].style.display = 'none';
    }

    sailors = 100;
    ships = 10;
    food = 100;
    water = 100;
    materials = 100;

    ceresLevel = 0;
    jupiterLevel = 0;
    neptuneLevel = 0;
    isOffering = false;

    totalScore = 0;
    stolenFood = 0;
    stolenWater = 0;
    stolenMaterials = 0;

    scenarioId = 99;
    scenarioCount = 0;
    completedUniqueScenariosLength = 0;

    revengeTaken = false;
    attackedMerchant = false;

    state = {}
    showTextNode(1);
    var element = document.getElementById('text');
    var buttons = document.getElementsByClassName('btn');
    buttons.addEventListener("click", function(element) {
        element.preventDefault;

        element.classList.remove('fade-in-text');

        void element.offsetWidth;

        element.classList.add('fade-in-text');
    }, false)
}


//Inspect fleet
function inspectFleet()
{
    //Hide changes
    sailorChangeElement.style.display = 'none';
    shipChangeElement.style.display = 'none';
    foodChangeElement.style.display = 'none';
    waterChangeElement.style.display = 'none';
    materialsChangeElement.style.display = 'none';

    //Update changes
    sailors = sailors + sailorsChange;
    ships = ships + shipsChange;
    food = food + foodChange;
    water = water + waterChange;
    materials = materials + materialsChange;

    //Set element colors
    sailorCountElement.innerText = sailors;
    if (sailors >= 67){
        sailorCountElement.style.color = "#008000";
    }
    else if (sailors < 67 && sailors >= 33){
        sailorCountElement.style.color = "#FDDA0D";
    }
    else if (sailors < 33){
        sailorCountElement.style.color = "#800000";
    }

    shipCountElement.innerText = ships;
    if(ships >= 7){
        shipCountElement.style.color = "#008000";
    }
    else if (ships < 7 && ships >= 3){
        shipCountElement.style.color = "#FDDA0D";
    }
    else if (ships < 3){
        shipCountElement.style.color = "#800000";
    }

    foodCountElement.innerText = food;
    if(food >= 67){
        foodCountElement.style.color = "#008000";
    }
    else if (food < 67 && food >= 33){
        foodCountElement.style.color = '#FDDA0D';
    }
    else if (food < 33){
        foodCountElement.style.color = '#800000';
    }

    waterCountElement.innerText = water;
    if(water >= 67){
        waterCountElement.style.color = '#008000';
    }
    else if (water < 67 && water >= 33){
        waterCountElement.style.color = '#FDDA0D';
    }
    else if (water < 33){
        waterCountElement.style.color = '#800000';
    }

    materialsCountElement.innerText = materials;
    if(materials >= 67){
        materialsCountElement.style.color = '#008000';
    }
    else if (materials < 67 && materials >= 33){
        materialsCountElement.style.color = '#FDDA0D';
    }
    else if (materials < 33){
        materialsCountElement.style.color = '#800000';
    }

    //Changes
    if (sailorsChange != 0){
        sailorChangeElement.style.display = '';
        if(sailorsChange > 0){
            sailorChangeElement.innerText = "+" + sailorsChange;
        }
        else if(sailorsChange < 0){
            sailorChangeElement.innerText = "-" + -sailorsChange;
        }
    }

    if(shipsChange != 0){
        shipChangeElement.style.display = '';
        if(shipsChange > 0){
            shipChangeElement.innerText = "+" + shipsChange;
        }
        else if (shipsChange < 0){
            shipChangeElement.innerText = "-" + -shipsChange;
        }
    }

    if (foodChange != 0){
        foodChangeElement.style.display = '';
        if (foodChange > 0){
            foodChangeElement.innerText = "+" + foodChange;
        }
        else if (foodChange < 0){
            foodChangeElement.innerText = "-" + -foodChange;
        }
    }

    if(waterChange != 0){
        waterChangeElement.style.display = '';
        if(waterChange > 0){
            waterChangeElement.innerText = "+" + waterChange;
        }
        else if (waterChange < 0){
            waterChangeElement.innerText = "-" + -waterChange;
        }
    }

    if (materialsChange != 0){
        materialsChangeElement.style.display = '';
        if(materialsChange > 0){
            materialsChangeElement.innerText = "+" + materialsChange;
        }
        else if (materialsChange < 0){
            materialsChangeElement.innerText = "-" + -materialsChange;
        }
    }

    //Reset changes
    sailorsChange = 0;
    shipsChange = 0;
    foodChange = 0;
    waterChange = 0;
    materialsChange = 0;
}

function updateBoons(){
    if(ceresLevel == 0){
        ceresBoonElement.innerText = "Unaware";
        ceresBoonElement.style.color = "#800000";
    }
    else if (ceresLevel == 1){
        ceresBoonElement.innerText = "Taken Notice";
        ceresBoonElement.style.color = "#FDDA0D";
    }
    else if (ceresLevel == 2){
        ceresBoonElement.innerText = "Supporting";
        ceresBoonElement.style.color = "#008000";
    }
    else if (ceresLevel >= 3){
        ceresBoonElement.innerText = "Maximum Favor";
        ceresBoonElement.style.color = "#9309CF"
    }
    for (let i = 0; i < boonElements.length; i++) {
        boonElements[i].style.display = '';
    }

    if(jupiterLevel == 0){
        jupiterBoonElement.innerText = "Unaware";
        jupiterBoonElement.style.color = "#800000";
    }
    else if (jupiterLevel == 1){
        jupiterBoonElement.innerText = "Taken Notice";
        jupiterBoonElement.style.color = "#FDDA0D";
    }
    else if (jupiterLevel == 2){
        jupiterBoonElement.innerText = "Supporting";
        jupiterBoonElement.style.color = "#008000";
    }
    else if (jupiterLevel >= 3){
        jupiterBoonElement.innerText = "Maximum Favor";
        jupiterBoonElement.style.color = "#9309CF"
    }
    for (let i = 0; i < boonElements.length; i++) {
        boonElements[i].style.display = '';
    }


    if(neptuneLevel == 0){
        neptuneBoonElement.innerText = "Unaware";
        neptuneBoonElement.style.color = "#800000";
    }
    else if (neptuneLevel == 1){
        neptuneBoonElement.innerText = "Taken Notice";
        neptuneBoonElement.style.color = "#FDDA0D";
    }
    else if (neptuneLevel == 2){
        neptuneBoonElement.innerText = "Supporting";
        neptuneBoonElement.style.color = "#008000";
    }
    else if (neptuneLevel >= 3){
        neptuneBoonElement.innerText = "Maximum Favor";
        neptuneBoonElement.style.color = "#9309CF"
    }
    for (let i = 0; i < boonElements.length; i++) {
        boonElements[i].style.display = '';
    }
}
//Generate new land
function generateLand(nextTextNodeId)
{
    //Subtract food and water
    foodChange = -Math.floor(Math.random() * 3 + 1);

    waterChange = -Math.floor(Math.random() * 3 + 1);

    inspectFleet();

    //Randomize quotes
    deathQuote = deathQuotes[Math.floor(Math.random()*deathQuotes.length)];
    landQuote = landQuotes[Math.floor(Math.random()*landQuotes.length)];
    arrivalText = arrivalTexts[Math.floor(Math.random()*arrivalTexts.length)];

    //Base stats set
    if(nextTextNodeId != 10 && nextTextNodeId != 11){
        
        var vegetation = Array('None', 'None', 'None', 'None', 'None', 'Sparse', 'Sparse', 'Sparse', 'Plentiful');
        var temperature = Array('Extreme', 'Extreme', 'Extreme', 'Extreme', 'Extreme', 'Fluctuating', 'Fluctuating', 'Fluctuating', 'Comfortable');
        var harbor = Array('Impassable','Impassable', 'Impassable', 'Impassable', 'Impassable', 'Tight', 'Tight', 'Tight', 'Spacious');

        //Set religious buffs
        if (ceresLevel == 1){
            vegetation = Array('Sparse', 'Sparse', 'Plentiful');
        }
        else if (ceresLevel == 2){
            vegetation = Array('Sparse', 'Plentiful');
        }
        else if (ceresLevel >= 3){
            vegetation = Array('Plentiful');
        }

        if(jupiterLevel == 1){
            temperature = Array('Fluctuating', 'Fluctuating', 'Comfortable');
        }
        else if (jupiterLevel == 2){
            temperature = Array('Fluctuating', 'Comfortable');
        }
        else if (jupiterLevel >= 3){
            temperature = Array('Comfortable')
        }

        if(neptuneLevel == 1){
            harbor = Array('Tight', 'Tight', 'Spacious');
        }
        else if (neptuneLevel == 2){
            harbor = Array('Tight', 'Spacious');
        }
        else if (neptuneLevel >= 3){
            harbor = Array('Spacious');
        }

        vegetationTier = vegetation[Math.floor(Math.random()*vegetation.length)];
        temperatureTier = temperature[Math.floor(Math.random()*temperature.length)];
        harborTier = harbor[Math.floor(Math.random()*harbor.length)];

        var river = 'Unknown';
        var natives = 'Unknown';
        var ruins = 'Unknown';

        riverTier = river;
        nativesTier = natives;
        ruinsTier = ruins;

        //Set land image based on vegetation
        if(vegetationTier == 'None'){
            var choice = Math.floor(Math.random() * 3 + 1)
            if (choice == 1){
                badLand1ImageElement.style.display = '';
                chosenLandElement = badLand1ImageElement;
            }
            else if (choice == 2){
                badLand2ImageElement.style.display = '';
                chosenLandElement = badLand2ImageElement;
            }
            else if (choice == 3){
                badLand3ImageElement.style.display = '';
                chosenLandElement = badLand3ImageElement;
            }
        }

        else if (vegetationTier == 'Sparse'){
            var choice = Math.floor(Math.random() * 3 + 1)
            if (choice == 1){
                mediumLand1ImageElement.style.display = '';
                chosenLandElement = mediumLand1ImageElement;
            }
            else if (choice == 2){
                mediumLand2ImageElement.style.display = '';
                chosenLandElement = mediumLand2ImageElement;
            }
            else if (choice == 3){
                mediumLand3ImageElement.style.display = '';
                chosenLandElement = mediumLand3ImageElement;
            }
        }

        else if (vegetationTier == 'Plentiful'){
            var choice = Math.floor(Math.random() * 3 + 1)
            if (choice == 1){
                goodLand1ImageElement.style.display = '';
                chosenLandElement = goodLand1ImageElement;
            }
            else if (choice == 2){
                goodLand2ImageElement.style.display = '';
                chosenLandElement = goodLand2ImageElement;
            }
            else if (choice == 3){
                goodLand3ImageElement.style.display = '';
                chosenLandElement = goodLand3ImageElement;
            }
        }
    }

    //Scouted
    else if (nextTextNodeId == 10 && ships > 1){
        var river = Array('Barren', 'Trickling', 'Trickling', 'Flowing');
        var natives = Array('Hostile', 'Indifferent', 'Indifferent', 'Generous');
        var ruins = Array('Empty', 'Relics', 'Relics', 'Treasures');
        
        riverTier = river[Math.floor(Math.random()*river.length)];
        nativesTier = natives[Math.floor(Math.random()*natives.length)];
        ruinsTier = ruins[Math.floor(Math.random()*ruins.length)];

        shipsChange = -1
        inspectFleet();
    }

    //Colony founded
    else if (nextTextNodeId == 11){
        if (riverTier == 'Unknown' && nativesTier == 'Unknown' && ruinsTier == 'Unknown'){
            var river = Array('Barren', 'Trickling', 'Trickling', 'Flowing');
            var natives = Array('Hostile', 'Indifferent', 'Indifferent', 'Generous');
            var ruins = Array('Empty', 'Relics', 'Relics', 'Treasures');
            
            riverTier = river[Math.floor(Math.random()*river.length)];
            nativesTier = natives[Math.floor(Math.random()*natives.length)];
            ruinsTier = ruins[Math.floor(Math.random()*ruins.length)];
        }
    }

    vegetationTierElement.innerText = vegetationTier;
    if(vegetationTier == 'None')
    {
        vegetationTierElement.style.color = "#800000";
    }
    else if (vegetationTier == 'Sparse')
    {
        vegetationTierElement.style.color = "#FDDA0D";
    }
    else if (vegetationTier == 'Plentiful')
    {
        vegetationTierElement.style.color = "#008000";
    }

    
    temperatureTierElement.innerText = temperatureTier;
    if(temperatureTier == 'Extreme')
    {
        temperatureTierElement.style.color = "#800000";
    }
    else if (temperatureTier == 'Fluctuating')
    {
        temperatureTierElement.style.color = "#FDDA0D";
    }
    else if (temperatureTier == 'Comfortable')
    {
        temperatureTierElement.style.color = "#008000";
    }

    harborTierElement.innerText = harborTier;
    if(harborTier == 'Impassable')
    {
        harborTierElement.style.color = "#800000";
    }
    else if (harborTier == 'Tight')
    {
        harborTierElement.style.color = "#FDDA0D";
    }
    else if (harborTier == 'Spacious')
    {
        harborTierElement.style.color = "#008000";
    }


    riverTierElement.innerText = riverTier;
    if(riverTier == 'Barren')
    {
        riverTierElement.style.color = "#800000";
    }
    else if (riverTier == 'Trickling')
    {
        riverTierElement.style.color = "#FDDA0D";
    }
    else if (riverTier == 'Flowing')
    {
        riverTierElement.style.color = "#008000";
    }

    nativesTierElement.innerText = nativesTier;
    if(nativesTier == 'Hostile')
    {
        nativesTierElement.style.color = "#800000";
    }
    else if (nativesTier == 'Indifferent')
    {
        nativesTierElement.style.color = "#FDDA0D";
    }
    else if (nativesTier == 'Generous')
    {
        nativesTierElement.style.color = "#008000";
    }

    ruinsTierElement.innerText = ruinsTier;
    if(ruinsTier == 'Empty')
    {
        ruinsTierElement.style.color = "#800000";
    }
    else if (ruinsTier == 'Relics')
    {
        ruinsTierElement.style.color = "#FDDA0D";
    }
    else if (ruinsTier == 'Treasures')
    {
        ruinsTierElement.style.color = "#008000";
    }

    if(nextTextNodeId == 11)
    {
        endGame(sailors, ships, food, water, materials, vegetationTier, temperatureTier, harborTier, riverTier, nativesTier, ruinsTier);
    }
}

    
//Generate new scenario
function generateScenario(nextTextNodeId, optionId)
{
    //Scenario encounter
    if(nextTextNodeId == 12){

        var islandQuotes = Array(
            '"They stretch their salt-soaked limbs along the beach. Achates was the first to strike a spark from flint and catch the fire up with leaves." \n \n - Virgil, The Aeneid',
            '"Achates spread dry fuel about, and then he waved the tinder into flame. Tired of their trials, the Trojan crewmen carry out the tools and the sea-drenched corn of Ceres." \n \n - Virgil, The Aeneid',
            '"Aeneas climbs a crag to seek a prospect far and wide... there is no ship in sight. All he can see are three stags wandering along the shore, with whole herds following behind, a long line grazing through the valley." \n \n - Virgil, The Aeneid',
            '"There is a cove within a long, retiring bay; and there an island\'s jutting harbor where every breaker off the high sea shatters and parts into the shoreline\'s winding shelters." \n \n - Virgil, The Aeneid',
        )
        var uniqueScenarioText = Array(
            'The fleet sails on, passing between a narrow strait. A loud roaring is heard to the left - the monster Charybdis sucks vast waves into the abyss. A screeching is heard to the right - Scylla\'s mouths fly down from the cliffside. \n \n Will you go left to Charybdis\' vortex, or right to Scylla\'s cliff?',
            'The fleet slows to a stop, arriving in the allied Sicilian city of Egesta. The king Acestes offers the captain a choice of gift: food and water, or timber for ships? \n \n Will you take the food and water, or materials and ships?',
            'The fleet navigates along a rocky coastline, and a shout goes out: something has been spotted inland. It\'s too difficult to discern what the object is from the ships. \n \n Will you prepare a party to investigate or move on?',
            'The fleet sails on, and a call goes out: another ship has been spotted on the horizon. Then another. And another. The entire horizon becomes dotted with ships fast approaching. The previously attacked merchants have not taken kindly to the fleet\'s piracy in their waters. \n \n Will you attempt to negotiate, or flee?',
            'The fleet drops anchor on a coastline, a tall volcano rising in the distance. Just as the sailors spot a herd of deer to hunt, a small tremor moves through the ground, and the nearby volcano belches a plume of black smoke. \n \n Will you stay to hunt the deer, or leave immediately?',
            'The fleet arrives on a beach surrounded by thick forests. As they set up camp, an unknown man stumbles out from the tree-line. Obviously exhausted, the man explains that he and some of his fellow travelers were captives of a cyclops, and that he alone was able to escape. He implores you to lay a trap for the cyclops to free his kinsmen. \n \n Will you use some food to lure and attack the cyclops, or leave his kinsmen behind?'
        )
        var uniqueQuoteText = Array(
            '"Now Scylla holds the right; insatiable Charybdis keeps the left." \n \n "Three times [Charybdis] sucks the vast waves into her abyss, the deepest whirlpool within her vortex, then she hurls the waters high, lashing the stars with spray." \n \n "Scylla is confined to blind retreats, a cavern; and her mouths thrust out to drag ships toward the shoals." \n \n - Vergil, The Aeneid',
            '"They head for harbor; kind winds swell their sails; the fleet runs swift across the surge; at last, and glad, they reach familiar sands." \n \n - Virgil, The Aeneid',
            '',
            '',
            '"The harbor is wide and free from winds; but Etna is thundering nearby with dread upheavals. At times it belches into upper air dark clouds with tar-black whirlwinds, blazing lava, while lifting balls of flame that lick the stars." \n \n "The tale is told that, charred by lightning bolts, the body of Enceladus lies pressed beneath this mass." \n \n - Virgil, The Aeneid',
            '"Aurora had banned damp shadows from the sky, when suddenly a tattered stranger, gaunt with final hunger, staggers from the woods and stretches pleading hands toward shore." \n \n - Virgil, The Aeneid',
        )
        var uniqueOption1Text = Array(
            'Go to the left, to Charybdis',
            'Accept the food and water',
            'Sail onward',
            'Attempt to negotiate',
            'Return to the ships and set sail',
            'Return to the ships and set sail',

        )
        
        var uniqueOption2Text = Array(
            'Go to the right, to Scylla',
            'Accept the materials and ships',
            'Launch an expedition to investigate the sighting',
            'Flee',
            'Stay and hunt the deer',
            'Lay a food trap for the cyclops',
        )

        var scenarioText = Array(
            'The fleet sails on, passing under dark storm clouds. Wind lashes the ship, and lightning cracks in the distance. Salt water floods the cargo hold, threatening to spoil the water and food there. \n \n Will you send a group of sailors to try and rescue the supplies?',
            'The fleet sails on, moving slowly with the calm winds. One of the sailors reports that a ship in the fleet is beginning to fall apart with the wear of the sea. \n \n Will you abandon the ship and move the sailors onto the others, or hope it holds together?',
            'The fleet sails on, and night falls. One of the most trustworthy lieutenants reports that a mutiny is brewing among the crew, and points out a group of culprits. \n \n Will you have the suspected culprits thrown overboard?',
            'The fleet slows to a stop, anchoring off the coast of a small island. The sailors make camp on the white sand shore. \n \n Will you send them to gather food and water, or to chop down trees for materials and shipbuilding?',
            'The fleet comes to a halt at a small beach, and the sailors disembark. A few express a desire to perform rituals to improve their chances of finding an ideal homeland. \n \n Will you burn food to make an offering to the gods?',
            'The fleet comes to rest in a small inlet. The fleet\'s augur recommends the construction of an altar to improve the fleet\'s chances of finding an ideal homeland. \n \n Will you use materials to make an altar to the gods?',
            'The fleet sails on, and the sailors\' stomachs are rumbling. Unfortunately, it\'s discovered that some of the food may have spoiled. \n \n Will you discard the potentially spoiled rations, or eat them before they can completely turn?', 
            'The fleet sails on, and a call goes out: another ship has been spotted on the horizon. Some of the bored sailors look to the captain expectantly, their hands reaching for their swords. \n \n Will you pursue the potential victim, or spare them?',
            'The fleet slows to a stop, anchoring in a small inlet. The sailors disembark from the remaining ships. \n \n Will you order the creation of three new ships to be constructed from the remaining material stores?',
            'The fleet slows to a stop, and treks up a cliffside to a small temple. Within lies a basin, empty. Some of the sailors believe that refilling the basin would improve favor with the gods, increasing their chances of finding an ideal land to settle. \n \n Will you refill the basin with fresh water for the gods?',
            'The fleet clashes with the waves as a great stormfront rocks the ships. One of the ships begins to come apart, its planks creaking and growning as they split. \n \n Will you send sailors to try to repair the ship, or will you order its evacuation?',
        )
        var quoteText = Array(
            '"A blue-black cloud ran overhead; it brought the night and storm and breakers rough in darkness. The winds roll up the sea, great waters heave. And we are scattered, tossed upon the vast abyss." \n \n "Then, suddenly, the cloud banks snatch away the sky and daylight from the Trojan\'s eyes. Black night hangs on the waters, heavens thunder, and frequent lightning glitters in the air; everything intends quick death to men." \n \n - Virgil, The Aeneid',
            '"', // ship falling apart
            '', // mutiny
            islandQuotes[Math.floor(Math.random()*islandQuotes.length)],
            '', // burn food
            '', // build altar
            '"The grass was parched. Sick grain denied us food." \n \n - Virgil, The Aeneid', //spoiled food
            '"All the crewmen fasten the sheets; at once, together, they let loose the sails, to port, to starboard; and as one, they shift and turn the high yardarms; kind winds drive on the fleet." \n \n - Virgil, The Aeneid',
            '"Then let us build out of Italian oak twice-ten ships for the Trojans - even more, if they can fill them.', // building ships
            '', // fill basin
            '"The seas are heaved to heaven. The oars are cracked; the prow sheers off; the waves attack broadside; against his hull the swell now shatters in a heap, mountainous, steep. Some sailors hang upon a wave crest; others stare out at the gaping waters, land that lies below the waves, surge that seethes with sand." \n \n - Virgil, The Aeneid',

        )
        var option1Text = Array(
            'Send the sailors',
            'Abandon the ship',
            'Throw them overboard',
            'Send them to gather food and water',
            'Burn an offering to the gods',
            'Build an altar to the gods',
            'Discard the food',
            'Pursue the ship',
            'Construct three new ships',
            'Refill the temple basin',
            'Attempt to save the ship',
        )

        var option2Text = Array(
            'Leave the supplies',
            'Push onwards',
            'Take no action',
            'Send them to chop trees for materials and ships',
            'Make no offering',
            'Build no altar',
            'Eat them quickly',
            'Spare the ship',
            'Continue with the existing ships and materials',
            'Leave the basin empty and depart',
            'Order the evacuation',
        )
        
        //Unique Scenario generator
        if(completedUniqueScenarios.length == 5 && attackedMerchant == true && revengeTaken == false){
            completedUniqueScenariosLength = 2;
        }
        else {
            completedUniqueScenariosLength = completedUniqueScenarios.length;
        }
        if (scenarioCount > 2 && completedUniqueScenariosLength < 5){
            var choice = Math.floor(Math.random() * 2 + 1);
            if (choice == 1){
                if(attackedMerchant == false){
                    do { 
                        assignedScenario = uniqueScenarioText[Math.floor(Math.random()*uniqueScenarioText.length)];
                        scenarioId = uniqueScenarioText.indexOf(assignedScenario);
                    } while (completedUniqueScenarios.includes(scenarioId) || assignedScenario == uniqueScenarioText[3]);
                }
                else if (attackedMerchant == true){
                    do { 
                        assignedScenario = uniqueScenarioText[Math.floor(Math.random()*uniqueScenarioText.length)];
                        scenarioId = uniqueScenarioText.indexOf(assignedScenario);
                    } while (completedUniqueScenarios.includes(scenarioId));
                }

                assignedQuote = uniqueQuoteText[scenarioId];
                assignedOption1 = uniqueOption1Text[scenarioId];
                assignedOption2 = uniqueOption2Text[scenarioId];

                scenarioCount = scenarioCount + 1;

                uniqueScenarioSwitch = true;

                completedUniqueScenarios.push(scenarioId);
                
                return;
            }
        }
        do {
            assignedScenario = scenarioText[Math.floor(Math.random()*scenarioText.length)];
            scenarioId = scenarioText.indexOf(assignedScenario);
        } while (completedScenarios.includes(scenarioId));
        assignedQuote = quoteText[scenarioId];
        assignedOption1 = option1Text[scenarioId];
        assignedOption2 = option2Text[scenarioId];
        scenarioCount = scenarioCount + 1;

        completedScenarios.length = 0;
        completedScenarios.push(scenarioId);
    }
    //Scenario result
    else if(nextTextNodeId == 13){

        var uniqueScenarioResultText = Array(
            'The fleet goes left, to Charybdis. A ship is sucked into the howling abyss, but the rest of the fleet escapes.',
            'The fleet goes right, to Scylla. Her vicious heads stretch down and pluck sailors from the ships.',
            'The captain graciously accepts the food and water.',
            'The captain graciously accepts the materials and ships.',
            'The fleet sails onward, ignoring the sighting.',
            'The party is sent inland to investigate the sighting. Unfortunately, they return empty handed, the sighting nothing but a fiction of weary minds.',
            'The party is sent inland to investigate the sighting. They return with supplies, a gift from the native village they\'d come across.',
            'The party is sent inland to investigate the sighting. They return with more people than they\'d set out with, a group of travelers having agreed to join the fleet.',
            'The signal of peace is raised, and the ships approach. Their leader demands the return of all stolen goods twice over. Without another option, an agreement is quickly reached.',
            'The fleet flees. Some of the slower ships in the fleet are quickly overtaken, but some are able to escape.',
            'The sailors return to their ships and hastily return to sea. Deep rumbles echo from the ground behind them.',
            'The sailors hastily hunt the deer. Fortunately, the looming volcano remains dormant.',
            'The sailors hastily hunt the deer. Unfortunately, as the last deer is killed, the volcano furiously erupts; flaming boulders careen down the mountainside, killing a few of the panicked sailors.',
            'The sailors return to their ships despite the pleas of the stranger. Although he is unhappy with the decision, he still joins the Trojans as they set sail.',
            'The sailors lay a food trap for the cyclops, near to his cave. Within a few hours, he stumbles out of his cave, smells the food, and falls straight into the trap. The Trojans quickly release the prisoners, who happily join the crew.',
            'The sailors lay a food trap for the cyclops, near to his cave. The cyclops, while large, recognizes the trap before he falls for it. Now alerted to the Trojans presence, he returns to his cave. The Trojans depart soon after, taking the single escapee with them.',
        );

        var scenarioResultText = Array(
            'The group of sailors is sent to save the supplies. Two are lost to the waves, but they successfully repair the damage.',
            'The supplies become drenched in saltwater, and are later tossed overboard.',
            'The ship is abandoned to the sea.',
            'The ship soon falls apart, taking its company with it.',
            'The ship struggles on, but does not sink.',
            'The suspected sailors are thrown overboard.',
            'No action is taken and the fleet sails onward. Despite the lieutenant\'s warning, no mutiny is attempted.',
            'No action is taken and the fleet sails onward. The next night, the mutineers attack, and many sailors are killed before the captain regains control of the fleet.',
            'No action is taken and the fleet sails onward. The next night, the mutineers, having heard word that they\'d been discovered, slip away with one of the ships and some supplies.',
            'The sailors spend the evening roaming the island, collecting food and water.',
            'The sailors spend the evening felling trees, constructing new ships and storing extra materials.',
            'The offering is made.',
            'No offering is made.',
            'The altar is made.',
            'No altar is made.',
            'The food is sent over the edge of the boat. Some of the sailors watch it float away with begrudging acceptance.',
            'The food is quickly eaten. Fortunately, no sailors report any sickness.',
            'The food is quickly devoured. Unfortunately, a number of the sailors fall ill from the spoiled food.',
            'The ship is quickly run down by the superior Trojan fleet. The small merchant vessel resists mightily, but soon surrenders.',
            'The ship is quickly run down by the superior Trojan fleet. However, the inhabitants appear prepared for attacks - they take a number of crewmen down before they can be subdued.',
            'The ship slowly disappears into the horizon. The sailors, grumbling, return to their routines.',
            'The sailors set to work building three more ships for the fleet, pulling from the existing material stores.',
            'No new ships are built.',
            'The basin is filled',
            'The basin is left empty',
            'The sailors scramble to follow the shouted order, rushing to the broken ship. Fortunately, they are able to save it, sealing the gaps in its shuddering hull.',
            'The sailors scramble to follow the shouted order. Unfortunately, just as the first are arriving on the ship, it capsizes, and vanishes beneath the swell.',
            'The sailors pass on the shouted evacuation order, barely heard over the crashing waves and howling winds. The sailors grab as much of the cargo as they can before leaving, though some is left behind, and the ship soon vanishes beneath the surface.',
        );
        
        //Unique scenarios
        if(uniqueScenarioSwitch == true)
        {
            //Scylla/Charybdis
            if(scenarioId == 0){
                if(optionId == 1){
                    assignedScenarioResult = uniqueScenarioResultText[0];
                    shipsChange = -1;
                    
                    sailorsChange = -10;
                    foodChange = -8;
                    waterChange = -8;
                    sailorsChange = -8;
                    materialsChange = -8;
                    inspectFleet();
                }
                else if (optionId == 2){
                    assignedScenarioResult = uniqueScenarioResultText[1];
                    sailorsChange = -(Math.floor(Math.random() * 50 + 10))
                    inspectFleet();
                }
            }

            //Egesta landing
            else if (scenarioId == 1){
                if(optionId == 1){
                    assignedScenarioResult = uniqueScenarioResultText[2];
                    foodChange = 30;
                    waterChange = 30;
                    inspectFleet();
                }
                else if(optionId == 2){
                    assignedScenarioResult = uniqueScenarioResultText[3];
                    materialsChange = 30;
                    shipsChange = 5;
                    inspectFleet();
                }
            }

            //Inland sighting
            else if (scenarioId == 2){
                if(optionId == 1){
                    assignedScenarioResult = uniqueScenarioResultText[4];
                }
                else if (optionId == 2){
                    var choice = Math.floor(Math.random() * 2 + 1)
                    if (choice == 1){
                        assignedScenarioResult = uniqueScenarioResultText[5];
                        foodChange = -10;
                        waterChange = -10;
                        inspectFleet();
                    }
                    else if (choice == 2){
                        var choice = Math.floor(Math.random() * 2 + 1)
                        if (choice == 1){
                            assignedScenarioResult = uniqueScenarioResultText[6];
                            foodChange = 15;
                            waterChange = 15;
                            inspectFleet();
                        }
                        else if (choice == 2){
                            assignedScenarioResult = uniqueScenarioResultText[7];
                            sailorsChange = (Math.floor(Math.random() * 12 + 5));
                            foodChange = -3;
                            waterChange = -3;
                            inspectFleet();
                        }
                    }
                }
            }

            //Merchant revenge
            else if(scenarioId == 3){
                if(optionId == 1){
                    assignedScenarioResult = uniqueScenarioResultText[8];
                    foodChange = -stolenFood * 2;
                    materialsChange = -stolenMaterials * 2;
                    waterChange = -stolenWater * 2;
                    revengeTaken = true;
                    inspectFleet();
                }
                else if (optionId == 2){
                    assignedScenarioResult = uniqueScenarioResultText[9];
                    shipsChange = -(Math.floor(Math.random() * 3 + 1));
                    foodChange = -(Math.floor(Math.random() * 15 + 5));
                    waterChange = -(Math.floor(Math.random() * 15 + 5));
                    materialsChange = -(Math.floor(Math.random() * 15 + 5));
                    sailorsChange = -(Math.floor(Math.random() * 15 + 5));
                    revengeTaken = true;
                    inspectFleet();
                }
            }
            
            //Volcano
            else if(scenarioId == 4){
                if(optionId == 1){
                    assignedScenarioResult = uniqueScenarioResultText[10];
                }
                else if (optionId == 2){
                    var choice = Math.floor(Math.random() * 2 + 1)
                    if (choice == 1){
                        assignedScenarioResult = uniqueScenarioResultText[11];
                        foodChange = (Math.floor(Math.random() * 10 + 5));
                        inspectFleet();
                    }
                    else if (choice == 2){
                        assignedScenarioResult = uniqueScenarioResultText[12];
                        foodChange = (Math.floor(Math.random() * 5 + 3));
                        sailorsChange = -(Math.floor(Math.random() * 7 + 3));
                        inspectFleet();
                    }
                }
            }

            //Cyclops
            else if(scenarioId == 5){
                if(optionId == 1){
                    assignedScenarioResult = uniqueScenarioResultText[13];
                    sailorsChange = 1;
                    inspectFleet();
                }
                else if(optionId == 2){
                    var choice = Math.floor(Math.random() * 3 + 1)
                    if (choice == 1 || choice == 2){
                        assignedScenarioResult = uniqueScenarioResultText[14];
                        sailorsChange = (Math.floor(Math.random() * 7 + 5));
                        inspectFleet();
                    }
                    else if(choice == 3){
                        assignedScenarioResult = uniqueScenarioResultText[15];
                        sailorsChange = 1;
                        foodChange = -(Math.floor(Math.random() * 8 + 5));
                        inspectFleet();
                    }
                }
            }

            uniqueScenarioSwitch = false;
            return;
        }

        //Storm
        if(scenarioId == 0) {
            if(optionId == 1){
                assignedScenarioResult = scenarioResultText[0]
                sailorsChange = -2;
                inspectFleet();
            }
            else if (optionId == 2){
                assignedScenarioResult = scenarioResultText[1];
                foodChange = -(Math.floor(Math.random() * 5 + 1));
                waterChange = -(Math.floor(Math.random() * 5 + 1));
                materialsChange = -(Math.floor(Math.random() * 5 + 1));
                inspectFleet();
            }
        }

        //Worn ship
        if(scenarioId == 1){
            if(optionId == 1){
                assignedScenarioResult = scenarioResultText[2];
                shipsChange = -1;
                inspectFleet();
            }
            else if (optionId == 2){
                var choice = Math.floor(Math.random() * 2 + 1)
                if (choice == 1){
                    assignedScenarioResult = scenarioResultText[3];
                    shipsChange = -1;
                    foodChange = -10;
                    waterChange = -10;
                    sailorsChange -10;
                    materialsChange = -10;
                    inspectFleet();
                }
                if (choice == 2){
                    assignedScenarioResult = scenarioResultText[4];
                }
            }
        }

        //Mutineers
        if(scenarioId == 2){
            if(optionId == 1){
                assignedScenarioResult = scenarioResultText[5];
                sailorsChange = -(Math.floor(Math.random() * 5 + 3));
                inspectFleet();
            }
            else if (optionId == 2){
                var choice = Math.floor(Math.random() * 2 + 1)
                if(choice == 1){
                    assignedScenarioResult = scenarioResultText[6];
                }
                else if (choice == 2){
                    if (ships > 1){
                        var choice = Math.floor(Math.random() * 2 + 1)
                    }
                    else {
                        choice = 1;
                    }
                    if(choice == 1){
                        assignedScenarioResult = scenarioResultText[7];
                        sailorsChange = -(Math.floor(Math.random() * 15 + 5));
                        inspectFleet();
                    }
                    else if (choice == 2){
                        assignedScenarioResult = scenarioResultText[8];
                        sailorsChange = -(Math.floor(Math.random() * 5 + 3));
                        foodChange = -(Math.floor(Math.random() * 3 + 3));
                        waterChange = -(Math.floor(Math.random() * 3 + 3));
                        shipsChange = -1;
                        inspectFleet();
                    }
                }
            }
        }

        //Island respite
        if(scenarioId == 3){
            if(optionId == 1){
                assignedScenarioResult = scenarioResultText[9];
                foodChange = (Math.floor(Math.random() * 15 + 1));
                waterChange = (Math.floor(Math.random() * 15 + 1));
                inspectFleet();
            }
            else if (optionId == 2){
                assignedScenarioResult = scenarioResultText[10];
                materialsChange = (Math.floor(Math.random() * 15 + 1));
                shipsChange = (Math.floor(Math.random() * 3 + 1));
                inspectFleet();
            }
        }

        //Offering to the gods (food)
        if(scenarioId == 4){
            if(optionId == 1){
                assignedScenarioResult = scenarioResultText[11];
                isOffering = true;
                foodChange = -(Math.floor(Math.random() * 15 + 1))
                inspectFleet();
            }
            else if (optionId == 2){
                assignedScenarioResult = scenarioResultText[12];
            }
        }

        //Offering to the gods (altar)
        if(scenarioId == 5){
            if(optionId == 1){
                assignedScenarioResult = scenarioResultText[13];
                isOffering = true;
                materialsChange = -(Math.floor(Math.random() * 15 + 1))
                inspectFleet();
            }
            else if (optionId == 2){
                assignedScenarioResult = scenarioResultText[14];
            }
        }

        //Spoiled food
        if(scenarioId == 6){
            if(optionId == 1){
                assignedScenarioResult = scenarioResultText[15];
                foodChange = -(Math.floor(Math.random() * 5 + 1));
                inspectFleet();
            }
            if(optionId == 2){
                var choice = Math.floor(Math.random() * 2 + 1)
                if (choice == 1){
                    assignedScenarioResult = scenarioResultText[16];
                    inspectFleet();
                }
                else if (choice == 2){
                    assignedScenarioResult = scenarioResultText[17];
                    sailorsChange = -(Math.floor(Math.random() * 5 + 1));
                    inspectFleet();
                }
            }
        }

        //Spotted merchant ship
        if(scenarioId == 7){
            if(optionId == 1){
                if(revengeTaken == false){
                    assignedScenarioResult = scenarioResultText[18];
                    materialsChange = (Math.floor(Math.random() * 8 + 1));
                    stolenMaterials = stolenMaterials + materialsChange;
                    foodChange = (Math.floor(Math.random() * 8 + 1));
                    stolenFood = stolenFood + foodChange;
                    waterChange = (Math.floor(Math.random() * 8 + 1));
                    stolenWater = stolenWater + waterChange;
                    sailorsChange = -(Math.floor(Math.random() * 1 + 1))
                    var choice = Math.floor(Math.random() * 4 + 1)
                    if (choice == 2){
                        attackedMerchant = true;
                    }
                    inspectFleet();
                }
                else if (revengeTaken == true){
                    assignedScenarioResult = scenarioResultText[19];
                    materialsChange = (Math.floor(Math.random() * 8 + 1));
                    foodChange = (Math.floor(Math.random() * 8 + 1));
                    waterChange = (Math.floor(Math.random() * 8 + 1));
                    sailorsChange = -(Math.floor(Math.random() * 12 + 5))
                    inspectFleet();
                }
            }
            else if (optionId == 2){
                assignedScenarioResult = scenarioResultText[20];
            }
        }

        //Build Ships
        if(scenarioId == 8){
            if(optionId == 1){
                assignedScenarioResult = scenarioResultText[21];
                shipsChange = 3;
                materialsChange = -15;
                inspectFleet();
            }
            else if(optionId == 2){
                assignedScenarioResult = scenarioResultText[22];
            }
        }

        //Basin
        if(scenarioId == 9){
            if(optionId == 1){
                assignedScenarioResult = scenarioResultText[23];
                isOffering = true;
                waterChange = -(Math.floor(Math.random() * 15 + 1))
                inspectFleet();
            }
            else if (optionId == 2){
                assignedScenarioResult = scenarioResultText[24];
            }
        }

        //Storm 2
        if(scenarioId == 10){
            if(optionId == 1){
                var choice = Math.floor(Math.random() * 2 + 1)
                if(choice == 1){
                    assignedScenarioResult = scenarioResultText[25]
                    inspectFleet();
                }
                else if (choice == 2){
                    assignedScenarioResult = scenarioResultText[26]
                    sailorsChange = -(Math.floor(Math.random() * 3 + 1));
                    foodChange = -(Math.floor(Math.random() * 2 + 1));
                    waterChange = -(Math.floor(Math.random() * 2 + 1));
                    materialsChange = -(Math.floor(Math.random() * 2 + 1));
                    shipsChange = -1;
                    inspectFleet();
                }

            }
            else if (optionId == 2){
                assignedScenarioResult = scenarioResultText[27];
                foodChange = -1;
                waterChange = -1;
                materialsChange = -1;
                shipsChange = -1;
                inspectFleet();
            }
        }
    }
}

function Death(){
    showTextNode(5);
    dead = true;
    shipImageElement.style.display = '';
    chosenLandElement.style.display = 'none';

    for (let i = 0; i < landElements.length; i++) {
        landElements[i].style.display = 'none';
    } 
}


//Show new description and quote
function showTextNode(textNodeIndex){

    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);

    if(textNodeIndex != 11 && textNodeIndex != 12 && textNodeIndex != 13){
        textElement.innerText = textNode.text;
        quoteElement.innerText = textNode.quoteText;

        while (continueButtonElement.firstChild) {
            continueButtonElement.removeChild(continueButtonElement.firstChild);
        }

        textNode.options.forEach(option => {
            if (showOption(option)) {
                const button = document.createElement('button');
                button.innerText = option.text;
                button.classList.add('btn');
                button.addEventListener('click', () => selectOption(option));
                continueButtonElement.appendChild(button);
            }
        })
    }

    //Colony
    else if (textNodeIndex == 11){
        while (continueButtonElement.firstChild) {
            continueButtonElement.removeChild(continueButtonElement.firstChild);
        }

        textNode.options.forEach(option => {
            if (showOption(option)) {
                const button = document.createElement('button');
                button.innerText = option.text;
                button.classList.add('btn');
                button.addEventListener('click', () => selectOption(option));
                continueButtonElement.appendChild(button);
            }
        })

        continueButtonElement.classList.remove("continue-button");
        void continueButtonElement.offsetWidth;
        continueButtonElement.classList.add("continue-button-ending");
        quoteElement.innerText = assignedQuote;
    }
    else if (textNodeIndex == 12){
        textElement.innerText = assignedScenario;
        quoteElement.innerText = assignedQuote;

        while (continueButtonElement.firstChild) {
            continueButtonElement.removeChild(continueButtonElement.firstChild);
        }

        textNode.options.forEach(option => {
            if (showOption(option)) {
                const button = document.createElement('button');
                if (option.id == 1){
                    button.innerText = assignedOption1;
                }
                else if (option.id == 2){
                    button.innerText = assignedOption2;
                }
                button.classList.add('btn');
                button.addEventListener('click', () => selectOption(option));
                continueButtonElement.appendChild(button);
            }
        })
    }

    else if (textNodeIndex == 13){
        textElement.innerText = assignedScenarioResult;
        quoteElement.innerText = textNode.quoteText;

        while (continueButtonElement.firstChild) {
            continueButtonElement
            .removeChild(continueButtonElement.firstChild);
        }
        textNode.options.forEach(option => {
            if (showOption(option)) {
                const button = document.createElement('button');
                button.innerText = option.text;
                button.classList.add('btn');
                button.addEventListener('click', () => selectOption(option));
                continueButtonElement.appendChild(button);
            }
        })
    }

    //Death
    if(textNodeIndex == 5){
        quoteElement.innerText = deathQuote;
    }
    //Arrival
    else if (textNodeIndex == 8){
        textElement.innerText = arrivalText;
        if (materials < 0 && ships > 2){
            textElement.innerText = 'The fleet has begun to run dangerously low on materials for ship maintenance. As the ships dock at a new land, the captain orders the destruction of a few of them to replenish the stores.';
            materialsChange = 15;
            shipsChange = -1;
            inspectFleet();
        }
        else if (materials < 0 && ships <= 1){
            textElement.innerText = 'The fleet has begun to run dangerously low on materials for ship maintenance. As the ships dock at a new land, the captain orders the sailors to scavenge for materials.';
            materialsChange = 15;
            foodChange = -(Math.floor(Math.random() * 8 + 1));
            waterChange = -(Math.floor(Math.random() * 8 + 1));
            inspectFleet();
        }

    }
    //Land
    else if (textNodeIndex == 9){
        quoteElement.innerText = landQuote;
    }
    //Colony
    else if (textNodeIndex == 11){
        quoteElement.innerText = endGameQuote;
    }
    //Praying alter
    else if (textNodeIndex == 14){
        quoteElement.innerText = prayQuote;
    }
    //Can't scout
    else if (textNodeIndex == 10 && ships <= 1){
        textElement.innerText = 'With only one ship remaining, scouting is impossible.';
    }

    //Refade buttons
    var buttons = document.getElementById("continue-button");
    buttons.classList.remove("fade-in-buttons");
    void buttons.offsetWidth;
    buttons.classList.add("fade-in-buttons");
}

//Show available buttons
function showOption(option) {
    return option.requiredState == null || option.requiredState(state);
}

//Select option
function selectOption(option){
    sailorChangeElement.style.display = 'none';
    shipChangeElement.style.display = 'none';
    foodChangeElement.style.display = 'none';
    waterChangeElement.style.display = 'none';
    materialsChangeElement.style.display = 'none';
    for (let i = 0; i < boonElements.length; i++) {
        boonElements[i].style.display = 'none';
    }
    for (let i = 0; i < scenarioImageElements.length; i++){
        scenarioImageElements[i].style.display = 'none'
    }

    nextTextNodeId = option.nextText;

    const optionId = option.id;

    //Check death
    if (dead == false && (sailors <= 0 || ships <= 0 || food <= 0 || water <= 0)){
        Death();
        nextTextNodeId = 5;
    }

    //Fade in text again
    var element = document.getElementById("text");
    element.classList.remove("fade-in-text");
    void element.offsetWidth;
    element.classList.add("fade-in-text");

    //Fade in quote again
    var element2 = document.getElementById("quote");
    element2.classList.remove("fade-in-quote");
    void element2.offsetWidth;
    element2.classList.add("fade-in-quote");

    if (nextTextNodeId <= 0) {
        chosenLandElement.classList.remove("ending-ascii");
        chosenLandElement.classList.add("ascii");
        return startGame();
    }

    //Death
    else if (nextTextNodeId == 5) {
        shipImageElement.style.display = '';
    }

    //Inspect fleet
    else if (nextTextNodeId == 7) {
        inspectFleet();
        shipImageElement.style.display = '';
        for (let i = 0; i < statusElements.length; i++) {
            statusElements[i].style.display = '';
        }
    }

    //New land discovery
    else if (nextTextNodeId == 8){
        for (let i = 0; i < landElements.length; i++) {
            landElements[i].style.display = 'none';
            landElements[i].style.color = '#FFFFFF';
        }

        riverTierElement.style.color = '#FFFFFF';
        nativesTierElement.style.color = '#FFFFFF';
        ruinsTierElement.style.color = '#FFFFFF';

        shipImageElement.style.display = '';
        goodLand1ImageElement.style.display = 'none';
        goodLand2ImageElement.style.display = 'none';
        goodLand3ImageElement.style.display = 'none';
        mediumLand1ImageElement.style.display = 'none';
        mediumLand2ImageElement.style.display = 'none';
        mediumLand3ImageElement.style.display = 'none';
        badLand1ImageElement.style.display = 'none';
        badLand2ImageElement.style.display = 'none';
        badLand3ImageElement.style.display = 'none';

    }

    //Inspect land and scout
    else if (nextTextNodeId == 9 || nextTextNodeId == 10) {
        generateLand(nextTextNodeId);
        shipImageElement.style.display = 'none';

        for (let i = 0; i < landElements.length; i++) {
            landElements[i].style.display = '';
        }
        if (ceresLevel > 0 || jupiterLevel > 0 || neptuneLevel > 0){
            for (let i = 0; i < boonElements.length; i++) {
                boonElements[i].style.display = '';
            }
        }
        for (let i = 0; i < scenarioImageElements.length; i++){
            scenarioImageElements[i].style.display = 'none'
        }
    }
    //Found a colony
    else if (nextTextNodeId == 11)
    {
        shipImageElement.style.display = 'none';
        for (let i = 0; i < landElements.length; i++) {
            landElements[i].style.display = '';
        }
        for (let i = 0; i < scenarioImageElements.length; i++){
            scenarioImageElements[i].style.display = 'none'
        }
        generateLand(nextTextNodeId);
    }

    //Scenario
    else if (nextTextNodeId == 12)
    {
        generateScenario(nextTextNodeId, optionId);
        shipImageElement.style.display = '';
        chosenLandElement.style.display = 'none';
        for (let i = 0; i < landElements.length; i++) {
            landElements[i].style.display = 'none';
        }
        for (let i = 0; i < scenarioImageElements.length; i++){
            scenarioImageElements[i].style.display = 'none'
        }
        //Unique Scenarios
        if(uniqueScenarioSwitch == true){
            //Charybdis
            if(scenarioId == 0){
                charscylImageElement.style.display = '';
                shipImageElement.style.display = 'none';
            }
            //Egesta
            else if (scenarioId == 1){
                egestaImageElement.style.display = '';
                shipImageElement.style.display = 'none';
            }
            //Something in distance
            else if (scenarioId == 2){
                distanceImageElement.style.display = '';
                shipImageElement.style.display = 'none';
            }
            //Merchant revenge
            else if (scenarioId == 3){
                revengeImageElement.style.display = '';
                shipImageElement.style.display = 'none';
            }

            //Volcano
            else if (scenarioId == 4){
                volcanoImageElement.style.display = '';
                shipImageElement.style.display = 'none';
            }

            //Cyclops
            else if (scenarioId == 5){
                cyclopsImageElement.style.display = '';
                shipImageElement.style.display = 'none';
            }
        }
        //Stormy Sea
        else if(scenarioId == 0 || scenarioId == 10){
            stormySeaImageElement.style.display = '';
            shipImageElement.style.display = 'none';
        }

        //Island collecting
        else if(scenarioId == 3){
            islandImageElement.style.display = '';
            shipImageElement.style.display = 'none';
        }

        else if (scenarioId == 4 || scenarioId == 5 || scenarioId == 9){
            olympusImageElement.style.display = '';
            shipImageElement.style.display = 'none';
        }
        //Merchant ship
        else if(scenarioId == 7){
            merchantImageElement.style.display = '';
            shipImageElement.style.display = 'none';
        }
        

    }

    //Scenario result    
    else if (nextTextNodeId == 13)
    {
        generateScenario(nextTextNodeId, optionId);
    }


    if(option.id == 1 && isOffering == true){
        nextTextNodeId = option.nextText2;
        for (let i = 0; i < boonElements.length; i++) {
            boonElements[i].style.display = '';
        }
        updateBoons();
        isOffering = false;
    }
    
    //Offering
        //ceres
    else if (nextTextNodeId == 15){
        ceresLevel = ceresLevel + 1;
        updateBoons();
    }
        //jupiter
    else if (nextTextNodeId == 16){
        jupiterLevel = jupiterLevel + 1;
        updateBoons();
    }
        //neptune
    else if (nextTextNodeId == 17){
        neptuneLevel = neptuneLevel + 1;
        updateBoons();
    }

    if(option.id == 1 && (assignedScenarioResult == 'The offering is made.' || assignedScenarioResult == 'The altar is made.')){
        nextTextNodeId = option.nextText2;
    }
    showTextNode(nextTextNodeId);
    state = Object.assign(state, option.setState);
}


//End Game
function endGame(sailors, ships, food, water, materials, vegetationTier, temperatureTier, harborTier, riverTier, nativesTier, ruinsTier){

    endGameQuote = endGameQuotes[Math.floor(Math.random()*endGameQuotes.length)];
    civilizationNames = Array(
        "Sekos",
        "Odnita",
        "Netrexo",
        "Cloarfar",
        "Eru",
        "Alba Longa",
        "Rome",
        "Midas",
        "Arcadia",
        "Agand",
        "Numenor",
        "Qanel",
        "Ahru",
        "Niral",
        "Iadne",
        "Teleth",
        "Sopax",
        "Bomhara",
        "Janih",
        "Bemir",
        "Ocqu",
        "Alhui",
        "Potaq",
        "Boweth",
        "Acmath",
        "Lasi",
        "Piti",
        "Alethkar",
        "Patji",
        "Vanu",
        "Hutton",
        "Falkreath",
        "Novigrad",
        "Ilum",
        "Ceah",
        "Arcdale",
        "Kluygate",
        "Encesa",
        "Adrenaburg",
        "Pholis",
        "Arkron",
        "Hodon"
    )

    var civilizationName = civilizationNames[Math.floor(Math.random()*civilizationNames.length)]

    if(vegetationTier == 'Plentiful' && temperatureTier == "Comfortable" && harborTier == "Spacious" && riverTier == "Flowing"){
        var idealCivilizationNames = Array(
            "Elysium",
            "Paradise",
            "Heaven",
            "The Celestial City",
            "Valhalla",
            "Zion",
            "Avalon",
            "Eden",
            "Utopia",
            "Rapture",
        )
        civilizationName = idealCivilizationNames[Math.floor(Math.random()*idealCivilizationNames.length)]
    }

    else if (ceresLevel == 3 && jupiterLevel == 3 && neptuneLevel == 3){
        var godsCivilizationNames = Array(
            "Olympus",
            "The Blessed Land",
            "The Hollowed Lands",
            "The Holy Land",
            "Sanctity",
            "Exalted"
        )
        civilizationName = godsCivilizationNames[Math.floor(Math.random()*godsCivilizationNames.length)];
    }

    var populationText = sailors + " crewmates had survived the journey across the sea. ";
    var foodText = "";
    var waterText = "";
    var nativesText = "The indifferent natives paid no attention to the new colonists, proving neither hostile nor helpful. ";
    var vegetationText = "The landscape contained sparse vegetation, which provided the colonists with a small amount of food. ";
    var riverText = "The trickling river nearby supplied the colonists with a small amount of fresh-water to drink in the early days of the colony. ";

    var temperatureText = "";
    var constructionText = "";
    var harborText = "The tight harbor benefitted the new colony, but required a moderate amount of construction to be usable. ";
    var materialsText = "";
    var civilizationTier = "";

    var ruinsText = "The ruins nearby were found to be empty. ";

    var population = sailors;
    var temperatureScore = 0;
    var ruinsScore = 0;
    var constructionScore = 0;
    var populationScore;

    totalScore = 0;

    if (vegetationTier == 'None'){
        food = food - 60;
        vegetationText = "The landscape was devoid of vegetation, and the colonists had to resort to labor-intensive activites to gather food. ";
        totalScore = totalScore - 80;
    }
    else if (vegetationTier == 'Plentiful'){
        food = food + 40;
        vegetationText = "The landscape was full of vegetation, and the colonists were easily able to collect extra food in the early days of their colony's construction. ";
    }

    if(riverTier == 'Barren'){
        water = water - 40;
        riverText = "The nearest river was bone-dry, having long since dried up. The first colonists had to drink much of their remaining water stores just to survive. ";
        populationScore = populationScore - 80;
    }
    else if (riverTier == 'Flowing'){
        water = water + 30;
        riverText = "The nearby river was healthily flowing, providing the first colonists with ample fresh-water to add to their stores. ";
    }

    if(nativesTier == 'Hostile')
    {
        population = population - 45;
        nativesText = "The natives proved hostile to the new colonists, and a number of conflicts broke out. Many of the early colonists were killed in these battles. ";

    }
    else if (nativesTier == 'Generous')
    {
        food = food + 25;
        water = water + 25;
        nativesText = "The natives proved generous to the new colonists, providing them with food and water to bolster their remaining stores. ";
    }

    materials = materials + (ships * 5);
    if (ships > 1){
        materialsText = "The new colonists broke down their remaining ships, using the planks to aid in the construction of their new civilization. ";
    }
  
    constructionScore = constructionScore + materials;

    if(food < 33){
        population = population - (55 - food);
        foodText = "With little remaining food after the journey, some colonists were unable to survive on the prescribed rations until the first harvest, and starved. ";
    }
    else if (food < 67 && food >= 33){
        foodText = "With some food supplies remaining, the colonists were able to survive until the first harvest. ";
    }
    else if (food >= 67){
        population = population + (food - 40);
        foodText = "With plenty of remaining food in storage, the fledgling colony grew swiftly and healthily. ";
    }

    if(water < 33){
        population = population - (55 - water);
        waterText = "The lack of stored, clean water caused some colonists to perish before any additional water could be collected from the land. ";
    }
    else if (water < 67 && water >= 33){
        waterText = "The remaining water stores kept the first colonists alive in the months before efficient water collection could begin. ";
    }
    else if (water >= 67){
        population = population + (water - 40);
        waterText = "The abundance of water in the fleet's holds allowed the new colony to thrive in the days before water collection could be established. ";
    }


    if(ruinsTier == 'Relics'){
        ruinsScore = 50;
        ruinsText = "The nearby ruins contained a few useful tools from a long-dead civilization, providing a small boost to the colony's early growth. ";
    }
    else if(ruinsTier == 'Treasures'){
        ruinsScore = 90;
        constructionScore = constructionScore + 30;
        ruinsText = "The nearby ruins were filled with valuable resources and provided a stable framework to construct a new colony upon, greatly bolstering the colony's survivability. ";
    }

    if(harborTier == 'Impassable'){
        constructionScore = constructionScore - 140;
        harborText = "The impassable harbor proved a difficult challenge to overcome, requiring the grueling construction of a network of canals. ";
    }
    else if(harborTier == 'Spacious'){
        constructionScore = constructionScore + 85;
        harborText = "The spacious harbor provided the new colonists with easy access to the sea and trade, and required little extra construction. ";
    }

    populationScore = population;

    if(temperatureTier == 'Extreme'){
        temperatureScore = -180;
        temperatureText = "The extreme temperatures stunted the colony's ability to grow and maintain a large population. ";

    }
    else if (temperatureTier == 'Fluctuating'){
        temperatureScore = 40;
        temperatureText = "The fluctuating temperatures neither helped nor hindered the colony's growth. ";
    }
    else if (temperatureTier == 'Comfortable'){
        temperatureScore = 140;
        temperatureText = "The comfortable temperatures amplified the colony's appeal to passing travelers, allowing it to maintain a much larger population. ";
    }
    
    totalScore = (populationScore * 1.8) + temperatureScore + (1.1 * constructionScore) + ruinsScore;
    totalScore = totalScore | 0;

    //Display final screen
    scoreElement.innerText = totalScore;
    populationScoreElement.innerText = populationScore;
    temperatureScoreElement.innerText = temperatureScore;
    constructionScoreElement.innerText = constructionScore;
    ruinsScoreElement.innerText = ruinsScore;

    for (let i = 0; i < statusElements.length; i++) {
        statusElements[i].style.display = '';
    }
    for (let i = 0; i < boonElements.length; i++) {
        boonElements[i].style.display = '';
    }
    for (let i = 0; i < landElements.length; i++) {
        landElements[i].style.display = '';
    }
    
    shipImageElement.style.display = 'none';
    chosenLandElement.style.display = '';
    chosenLandElement.classList.remove("ascii");
    void chosenLandElement.offsetWidth;
    chosenLandElement.classList.add("ending-ascii");

    //Set end texts
    populationText = populationText + vegetationText + riverText + nativesText + foodText + waterText;
    constructionText = materialsText + harborText;
    if(totalScore < 150){
        civilizationTier = "Even at its peak, it was nothing but a small, struggling hamlet.";
    }
    else if(totalScore >= 150 && totalScore < 300){
        civilizationTier = "At its height, it was a healthy but societally isolated village.";
    }
    else if (totalScore >= 300 && totalScore < 500){
        civilizationTier = "At its height, it was a small yet bustling trade town.";
    }
    else if (totalScore >= 500 && totalScore < 600){
        civilizationTier = "At its height, it was a healthy trading hub and cultural center.";
    }
    else if (totalScore >= 600 && totalScore < 700){
        civilizationTier = "At its height, it was a booming trade city and a formidable regional power.";
    }
    else if (totalScore >= 700 && totalScore < 800){
        civilizationTier = "At its height, it was a premier regional military and cultural power, with influence that expanded for miles.";
    }
    else if (totalScore >= 800 && totalScore < 900){
        civilizationTier = "At its height, it dominated its landmass militarily and culturally, and even expanded to settle across the seas.";
    }
    else if (totalScore >= 900 && totalScore < 1000){
        civilizationTier = "At its height, it was one of the premier civilizations of the world, conquering vast foreign lands and achieving technological wonders.";
    }
    else if (totalScore >= 1000){
        civilizationTier = "At its height, it was the greatest civilization of its time, permenently reshaping the world and redirecting the flow of human history.";
    }

    var endText = 
    "The fleet comes to a rest at its new home. The weary sailors are the first generation of a new civilization. " +
    "\n \n Gazing out over their new land, their captain named their colony " + civilizationName + "." + 
    "\n \n" +
    populationText +
    "\n \n" +
    ruinsText +
    "\n \n" +
    constructionText + 
    "\n \n" +
    temperatureText +
    "\n \n The civilization of " + civilizationName + " would go on to last " + totalScore + " years. " + civilizationTier;
    

    console.log(population);
    if (population <= 0 || totalScore <= 0){
        var endText = 
        "The fleet comes to a rest at its new home. The weary sailors are the first generation of a new civilization. " +
        "\n \n Gazing out over their new land, their captain named their colony " + civilizationName + "." +
        "\n \n" +
        populationText +
        "\n \n" + "With so many of their members lost, the colony was unable to survive. Within a few short years, it had vanished." +
        "\n \n The city of " + civilizationName + " would last only " + Math.floor(Math.random() * 4 + 1) + " years.";
    }
    textElement.innerText = endText;
    quoteElement.innerText = endGameQuote;
}

//Death quotes
var deathQuotes = Array(
    '"Let me rage before I die." \n \n - Virgil, The Aeneid', 
    '"The descent into Hell is easy." \n \n - Virgil, The Aeneid',
    '"All in the nearby crowd you notice here, are pauper souls, the souls of the unburied" \n \n - Virgil, The Aeneid',
    '"If only Jupiter would give me back the past years and the man I was, when I cut down the front rank by Praeneste Wall and won the fight and burned the piles of shields!" \n \n - Virgil, The Aeneid',
    '"Every man\'s last day is fixed" \n \n - Virgil, The Aeneid',
    '"Turnus, too, is called by fate. He stands at the given limit of his years." \n \n - Virgil, The Aeneid',
    '"Lifetimes are brief, and not to be regained." \n \n - Virgil, The Aeneid'
    
    
    
    );

//Arrive at land text
var arrivalTexts = Array(
    'The fleet pulls into a small cape, the sun low in the evening sky. Tiny waves lap against the side of the boat.',
    'The fleet passes around a bend, revealing a new land ahead. The evening sunbeams shatter across the cresting waves.',
    'The fleet glides along a shoreline of white sand, cliffs framing a beach ahead. Gusts of wind billow in the sails.',
    'The fleet drops anchor at the base of a shore, its sailors weary after their journey. The sand sparkles under the bright sunlight.'
)

//Inspect land quotes
var landQuotes = Array(
    '"Along this side and that there towers, vast, a line of cliffs, each ending in like crags." \n \n - Virgil, The Aeneid',
    '"The Trojans, longing so to touch the land, now disembark to gain the wished-for sands." \n \n - Virgil, The Aeneid',
    '"And as soon as gracious daylight is given to him, this is his decision: to go out and explore this foreign country, to learn what shores the wind has brought him to." \n \n - Virgil, The Aeneid',
    '"He hides his fleet inside the narrows of the wooded cove, beneath a hollow rock shut in by trees, with bristling shades around." \n \n - Virgil, The Aeneid'
)

//Prayer quotes
var prayQuotes = Array(
    '"Come near and pray: this altar shall yet save us all, or you shall die together with us." \n \n - Virgil, The Aeneid',
    '"Cloanthus, stretching seaward both his hands, poured prayers and called upon the gods with vows." \n \n - Virgil, The Aeneid',
    '"You gods who rule the kingdom of the seas, whose waters I now race upon: to keep the promise that I pledge, I shall with gladness offer a snow-white bull before your altars." \n \n - Virgil, The Aeneid',
)

//End game quotes
var endGameQuotes = Array(
    '"His empire\'s boundary shall be the Ocean; the only border to his fame, the stars." \n \n - Virgil, The Aeneid',
    '"I set no limits to their fortunes and no time; I give them empire without end." \n \n - Virgil, The Aeneid',
    '"We followed you, your men, from burning Troy and crossed the swollen waters in your care together with your ships; and we shall raise your children to the stars and build an empire out of their city." \n \n - Virgil, The Aeneid',
)

var deathQuote = deathQuotes[Math.floor(Math.random()*deathQuotes.length)];
var landQuote = landQuotes[Math.floor(Math.random()*landQuotes.length)];
var arrivalText = arrivalTexts[Math.floor(Math.random()*arrivalTexts.length)];
var prayQuote = prayQuotes[Math.floor(Math.random()*prayQuotes.length)];
var endGameQuote = endGameQuotes[Math.floor(Math.random()*endGameQuotes.length)];

//Text nodes
const textNodes = [
    {
        id: 1,
        text: 'And when he knew the king was dead, he fled.',
        quoteText: '"I go down and, guided by a god, move on among the foes and fires; weapons turn aside, the flames retire where I make my way." \n \n - Virgil, The Aeneid',
        options: [
            {
                text: 'Continue',
                nextText: 2
            },
            {
                text: 'Skip intro',
                nextText: 6
            }
        ]
    },
    {
        id: 2,
        text: 'To the ships he ran, and hastily a fleet was mustered.',
        quoteText: '"We build a fleet... knowing not where fate will carry us or where we are to settle." \n \n - Virgil, The Aeneid',
        options: [
            {
                text: 'Continue',
                nextText: 3
            }
        ]
    },
    {
        id: 3,
        text: 'The ruins of Troy burned behind them, the great homeland of their nation.',
        quoteText: '"The power of Asia and Priam\'s guiltless race are overturned, proud Ilium is fallen, and all of Neptune\'s Troy smokes from the ground." \n \n - Virgil, The Aeneid',
        options: [
            {
                text: 'Continue',
                nextText: 4
            }
        ]
    },
    {
        id: 4,
        text: 'But one by one, they turned to the sea. Their captain\'s gaze wandered out to the horizon, and only one goal appeared in his mind: to discover the ideal land on which to found the greatest civilization the world had ever known.',
        quoteText: '"Weeping, I must give up the shores, the harbors that were my home, the plain that once was Troy." \n \n "An exile, I go out across the waters together with my comrades and my son..." \n \n "We are driven by divine commands, and signs to sail in search of fields of exile in distant and deserted lands." \n \n - Virgil, The Aeneid',
        options: [
            {
                text: 'Set off into the sea.',
                nextText: 6
            }
        ]
    },
    {
        //Death
        id: 5,
        text: 'The journey of the exiles ends here. As the captain sees his dream of a new civilization die with his fleet, he wonders: "Where did it all go wrong?".',
        quoteText: 'Variable death quote here',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }
        ]
    },
    {
        id: 6,
        text: 'The fleet glides over calm waters under the glowing sun.',
        quoteText: '',
        options: [
            {
                text: 'Inspect the fleet.',
                nextText: 7
            }
        ]
    },
    {
        id: 7,
        text: 'The captain inspects his fleet.',
        quoteText: '',
        options: [
            {
                text: 'Set sail.',
                nextText: 8
            }
        ]
    },
    {
        id: 8,
        text: 'Variable arrival text here',
        quoteText: '',
        options: [
            {
                text: 'Inspect the land.',
                nextText: 9
            }
        ]
    },
    {
        id: 9,
        text: 'The captain scrutinizes the land.',
        quoteText: 'Variable land quote here',
        options: [
            {
                text: 'Scout the land.',
                nextText: 10
            },
            {
                text: 'Found a colony.',
                nextText: 11
            },
            {
                text: 'Set sail.',
                nextText: 12
            }
        ]
    },
    {
        //Scout the land
        id: 10,
        text: 'The captain sends one of his ships to scout the land.',
        quoteText: '',
        options: [
            {
                text: 'Found a colony.',
                nextText: 11
            },
            {
                text: 'Set sail.',
                nextText: 12
            }
        ]
    },
    {
        //Found a colony
        id: 11,
        text: 'You found a colony [PLACEHOLDER]',
        quoteText: '',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }
        ]

    },
    {
        //Scenario
        id: 12,
        text: 'Scenario text should be here',
        quoteText: 'Unique quote text should be here',
        options: [
            {
                text:'Option 1 should be here',
                id: 1,
                nextText: 13,
                nextText2: 14,
            },
            {
                text:'Option 2 should be here',
                id: 2,
                nextText: 13
            }
        ]
    },
        {
        //Scenario result
        id: 13,
        text: 'Scenario result text should be here',
        quoteText: '',
        options: [
            {
                text:'Set sail.',
                nextText: 8
            }
        ]
    },
    {
        //Gods offering
        id: 14,
        text: 'The ceremony is prepared. The sailors wait expectantly for the captain to name the god who will be receiving their prayers. \n \n Ceres, to conjure more ubiquitous vegetation? \n Jupiter, to gust the fleet to temperate lands? \n Neptune, to guide the fleet to wider, safer harbors?',
        quoteText: '',
        options: [
            {
                text:'Pray to the goddess of agriculture, Ceres',
                nextText: 15
            },
            {
                text:'Pray to the god of the skies, Jupiter',
                nextText: 16
            },
            {
                text:'Pray to the god of the seas, Neptune.',
                nextText: 17
            },
            
        ]
    },
    {
        //ceres
        id: 15,
        text: 'You dedicate the ceremony to the goddess Ceres, praying for her to grant the fleet lush lands and fertile fields.',
        quoteText: '"Then chosen young men, together with the altar priest, bring in - they rush in with eagerness - roast flesh of oxen; and they load the baskets with the gifts that Ceres grants to human labor." \n \n - Virgil, The Aeneid',
        options: [
            {
                text:'Set sail',
                nextText: 8
            }
        ]
    },
    {
        //jupiter
        id: 16,
        text: 'You dedicate the ceremony to the god Jupiter, praying for him to gust the fleet to temperate and comfortable lands.',
        quoteText: '"He prayed long - so they say - to Jupiter; he stood before the altars in the presence of gods, a suppliant with upraised hands." \n \n - Virgil, The Aeneid',
        options: [
            {
                text:'Set sail',
                nextText: 8
            }
        ]
    },
    {
        //neptune
        id: 17,
        text: 'You dedicate the ceremony to the god Neptune, praying for him to guide the fleet to greater harbors.',
        quoteText: '"So Neptune speaks and, quicker than his tongue, brings quiet to the swollen waters, sets the gathered clouds to flight, calls back the sun." \n \n - Virgil, The Aeneid',
        options: [
            {
                text:'Set sail',
                nextText: 8
            }
        ]
    }
]

startGame();