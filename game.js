const textElement = document.getElementById('text');
const quoteElement = document.getElementById('quote');
const continueButtonElement = document.getElementById('continue-button');

const shipImageElement = document.getElementById('ascii-ship');

const goodLand1ImageElement = document.getElementById('ascii-good-land1');
const goodLand2ImageElement = document.getElementById('ascii-good-land2');
const mediumLand1ImageElement = document.getElementById('ascii-medium-land1');
const mediumLand2ImageElement = document.getElementById('ascii-medium-land2');
const badLand1ImageElement = document.getElementById('ascii-bad-land1');
const badLand2ImageElement = document.getElementById('ascii-bad-land2');


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

var completedUniqueScenarios = Array();
var scenarioId = 99;
var scenarioCount = 0;
var uniqueScenarioSwitch = false;



var dead = false;


let state = {};

//TODO:
    //Display status changes on screen
    //Make land improve over time
    //Add more cool Aeneid quotes
    //Complete colony screen 
    //Improve display look
    //Add more ascii images
        //Death
        //Egesta
        //Charybdis/Scylla
        //Something in the distance

//Start the game
function startGame(){
    shipImageElement.style.display = 'none';

    goodLand1ImageElement.style.display = 'none';
    goodLand2ImageElement.style.display = 'none';
    mediumLand1ImageElement.style.display = 'none';
    mediumLand2ImageElement.style.display = 'none';
    badLand1ImageElement.style.display = 'none';
    badLand2ImageElement.style.display = 'none';

    for (let i = 0; i < statusElements.length; i++) {
        statusElements[i].style.display = 'none';
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

    console.log(foodChange);
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
            waterChangeElement.innerText = "(+" + waterChange;
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
        var vegetation = Array('None', 'Sparse', 'Plentiful');
        var temperature = Array('Extreme', 'Fluctuating', 'Comfortable');
        var harbor = Array('Impassable', 'Tight', 'Spacious');

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
            var choice = Math.floor(Math.random() * 2 + 1)
            if (choice == 1){
                badLand1ImageElement.style.display = '';
            }
            else if (choice == 2){
                badLand2ImageElement.style.display = '';
            }
        }

        else if (vegetationTier == 'Sparse'){
            var choice = Math.floor(Math.random() * 2 + 1)
            if (choice == 1){
                mediumLand1ImageElement.style.display = '';
            }
            else if (choice == 2){
                mediumLand2ImageElement.style.display = '';
            }
        }

        else if (vegetationTier == 'Plentiful'){
            var choice = Math.floor(Math.random() * 2 + 1)
            if (choice == 1){
                goodLand1ImageElement.style.display = '';
            }
            else if (choice == 2){
                goodLand2ImageElement.style.display = '';
            }
        }
    }

    //Scouted
    else if (nextTextNodeId == 10 && ships > 1){
        var river = Array('Barren', 'Trickling', 'Flowing');
        var natives = Array('Hostile', 'Indifferent', 'Generous');
        var ruins = Array('Empty', 'Relics', 'Treasures');
        
        riverTier = river[Math.floor(Math.random()*river.length)];
        nativesTier = natives[Math.floor(Math.random()*natives.length)];
        ruinsTier = ruins[Math.floor(Math.random()*ruins.length)];

        shipsChange = -1
        inspectFleet();
    }

    //Colony founded
    else if (nextTextNodeId == 11){
        if (riverTier == 'Unknown' && nativesTier == 'Unknown' && ruinsTier == 'Unknown'){
            var river = Array('Barren', 'Trickling', 'Flowing');
            var natives = Array('Hostile', 'Indifferent', 'Generous');
            var ruins = Array('Empty', 'Relics', 'Treasures');
            
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
            '"Achates spread Extreme fuel about, and then he waved the tinder into flame. Tired of their trials, the Trojan crewmen carry out the tools and the sea-drenched corn of Ceres." \n \n - Virgil, The Aeneid',
            '"Aeneas climbs a crag to seek a prospect far and wide... there is no ship in sight. All he can see are three stags wandering along the shore, with whole herds following behind, a long line grazing through the valley." \n \n - Virgil, The Aeneid',
            '"There is a cove within a long, retiring bay; and there an island\'s jutting harbor where every breaker off the high sea shatters and parts into the shoreline\'s winding shelters." \n \n - Virgil, The Aeneid',
        )
        var uniqueScenarioText = Array(
            'The fleet sails on, passing between a narrow strait. A loud roaring is heard to the left - the monster Charybdis sucks vast waves into the abyss. A screeching is heard to the right - Scylla\'s mouths fly down from the cliffside. \n \n Will you go left to Charybdis\' vortex, or right to Scylla\'s cliff?',
            'The fleet slows to a stop, arriving in the allied Sicilian city of Egesta. The king Acestes offers the captain a choice of gift: food and water, or timber for ships? \n \n Will you take the food and water, or materials and ships?',
            'The fleet navigates along a rocky coastline, and a shout goes out: something has been spotted inland. It\'s too difficult to discern what the object is from the ships. \n \n Will you prepare a party to investigate or move on?',
        )
        var uniqueQuoteText = Array(
            '"Now Scylla holds the right; insatiable Charybdis keeps the left." \n \n "Three times [Charybdis] sucks the vast waves into her abyss, the deepest whirlpool within her vortex, then she hurls the waters high, lashing the stars with spray." \n \n "Scylla is confined to blind retreats, a cavern; and her mouths thrust out to drag ships toward the shoals." \n \n - Vergil, The Aeneid',
            '"They head for harbor; kind winds swell their sails; the fleet runs swift across the surge; at last, and glad, they reach familiar sands." \n \n - Virgil, The Aeneid',
            ''
        )
        var uniqueOption1Text = Array(
            'Go to the left, to Charybdis',
            'Accept the food and water',
            'Sail onward',

        )
        
        var uniqueOption2Text = Array(
            'Go to the right, to Scylla',
            'Accept the materials and ships',
            'Launch an expedition to investigate the sighting',
        )

        var scenarioText = Array(
            'The fleet sails on, passing under dark storm clouds. Wind lashes the ship, and lightning cracks in the distance. Salt water floods the cargo hold, threatening to spoil the water and food there. \n \n Will you send a group of sailors to try and rescue the supplies?',
            'The fleet sails on, moving slowly with the calm winds. One of the sailors reports that a ship in the fleet is beginning to fall apart with the wear of the sea. \n \n Will you abandon the ship and move the sailors onto the others, or hope it holds together?',
            'The fleet sails on, and night falls. One of the most trustworthy lieutenants reports that a mutiny is brewing among the crew, and points out a group of culprits. \n \n Will you have the suspected culprits thrown overboard?',
            'The fleet slows to a stop, anchoring off the coast of a small island. The sailors make camp on the white sand shore. \n \n Will you send them to gather food and water, or to chop down trees for materials and shipbuilding?',
        )
        var quoteText = Array(
            '"A blue-black cloud ran overhead; it brought the night and storm and breakers rough in darkness. The winds roll up the sea, great waters heave. And we are scattered, tossed upon the vast abyss." \n \n - Virgil, The Aeneid',
            '',
            '',
            islandQuotes[Math.floor(Math.random()*islandQuotes.length)],

        )
        var option1Text = Array(
            'Send the sailors',
            'Abandon the ship',
            'Throw them overboard',
            'Send them to gather food and water'
        )

        var option2Text = Array(
            'Leave the supplies',
            'Push onwards',
            'Take no action',
            'Send them to chop trees for materials and ships'
        )
        
        //Unique Scenario generator
        if (scenarioCount > 2 && completedUniqueScenarios.length < 3){
            var choice = Math.floor(Math.random() * 2 + 1)
            if (choice == 1){
                do { 
                    assignedScenario = uniqueScenarioText[Math.floor(Math.random()*uniqueScenarioText.length)];
                    scenarioId = uniqueScenarioText.indexOf(assignedScenario);
                } while (completedUniqueScenarios.includes(scenarioId));

                assignedQuote = uniqueQuoteText[scenarioId];
                assignedOption1 = uniqueOption1Text[scenarioId];
                assignedOption2 = uniqueOption2Text[scenarioId];

                scenarioCount = scenarioCount + 1;

                uniqueScenarioSwitch = true;

                completedUniqueScenarios.push(scenarioId);
                
                return;

                }
        }
        
        assignedScenario = scenarioText[Math.floor(Math.random()*scenarioText.length)];

        scenarioId = scenarioText.indexOf(assignedScenario);

        assignedQuote = quoteText[scenarioId];
        assignedOption1 = option1Text[scenarioId];
        assignedOption2 = option2Text[scenarioId];

        scenarioCount = scenarioCount + 1;


    }
    //Scenario result
    else if(nextTextNodeId == 13){

        var uniqueScenarioResultText = Array(
            'The fleet goes left, to Charybdis. A ship is sucked into the abyss, but the rest of the fleet escapes.',
            'The fleet goes right, to Scylla. Heads reach down and pluck sailors from the ships.',
            'The captain graciously accepts the food and water.',
            'The captain graciously accepts the materials and ships.',
            'The fleet sails onward, ignoring the sighting.',
            'The party is sent inland to investigate the sighting. Unfortunately, they return empty handed, the sighting nothing but a fiction of weary minds.',
            'The party is sent inland to investigate the sighting. They return with supplies, a gift from the native village they\'d come across.',
            'The party is sent inland to investigate the sighting. They return with more people than they\'d set out with, a group of travelers having agreed to join the fleet.'
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
            'The sailors spend the evening felling trees, constructing new ships and storing extra materials.'
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
                    }
                    else if (choice == 2){
                        var choice = Math.floor(Math.random() * 2 + 1)
                        if (choice == 1){
                            assignedScenarioResult = uniqueScenarioResultText[6];
                            foodChange = 15;
                            waterChange = 15;
                        }
                        else if (choice == 2){
                            assignedScenarioResult = uniqueScenarioResultText[7];
                            sailorsChange = (Math.floor(Math.random() * 10 + 5));
                            foodChange = -5;
                            waterChange = -5;
                        }
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
    }


}

function Death(){
    showTextNode(5);
    dead = true;
    shipImageElement.style.display = '';
    goodLand1ImageElement.style.display = 'none';
    goodLand2ImageElement.style.display = 'none';
    mediumLand1ImageElement.style.display = 'none';
    mediumLand2ImageElement.style.display = 'none';
    badLand1ImageElement.style.display = 'none';
    badLand2ImageElement.style.display = 'none';

    for (let i = 0; i < landElements.length; i++) {
        landElements[i].style.display = 'none';
    }
    
}


//Show new description and quote
function showTextNode(textNodeIndex){

    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);

    

    if(textNodeIndex != 12 && textNodeIndex != 13){
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
        if(textNodeIndex == 11){
            textElement.innerText = "The fleet comes to a rest at its new home. The weary sailors are the first generation of a new civilization.\n \n This new civilization would go on to last " + totalScore + " years.";
        }
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
    }
    //Land
    else if (textNodeIndex == 9){
        quoteElement.innerText = landQuote;
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
        mediumLand1ImageElement.style.display = 'none';
        mediumLand2ImageElement.style.display = 'none';
        badLand1ImageElement.style.display = 'none';
        badLand2ImageElement.style.display = 'none';
    }

    //Inspect land and scout
    else if (nextTextNodeId == 9 || nextTextNodeId == 10) {
        generateLand(nextTextNodeId);
        shipImageElement.style.display = 'none';
        for (let i = 0; i < landElements.length; i++) {
            landElements[i].style.display = '';
        }
    }
    //Found a colony
    else if (nextTextNodeId == 11)
    {
        shipImageElement.style.display = 'none';
        for (let i = 0; i < landElements.length; i++) {
            landElements[i].style.display = '';
        }
        generateLand(nextTextNodeId);
    }

    //Scenario
    else if (nextTextNodeId == 12)
    {
        shipImageElement.style.display = '';
        goodLand1ImageElement.style.display = 'none';
        goodLand2ImageElement.style.display = 'none';
        mediumLand1ImageElement.style.display = 'none';
        mediumLand2ImageElement.style.display = 'none';
        badLand1ImageElement.style.display = 'none';
        badLand2ImageElement.style.display = 'none';
        for (let i = 0; i < landElements.length; i++) {
            landElements[i].style.display = 'none';
        }
        generateScenario(nextTextNodeId, optionId);
    }

    else if (nextTextNodeId == 13)
    {
        generateScenario(nextTextNodeId, optionId);
    }
    
    showTextNode(nextTextNodeId);
    state = Object.assign(state, option.setState);

    
}


//End Game
function endGame(sailors, ships, food, water, materials, vegetationTier, temperatureTier, harborTier, riverTier, nativesTier, ruinsTier){
    for (let i = 0; i < allScoreElements.length; i++) {
        allScoreElements[i].style.display = '';
    }

    var population = sailors;
    var temperatureScore = 0;
    var ruinsScore = 0;
    var constructionScore = 0;
    var populationScore;

    totalScore = 0;

    if (vegetationTier == 'None'){
        food = food - 25;
    }
    else if (vegetationTier == 'Plentiful'){
        food = food + 25;
    }

    if(riverTier == 'Barren'){
        water = water - 25;
    }
    else if (riverTier = 'Flowing'){
        water = water + 25;
    }

    if(nativesTier == 'Hostile')
    {
        population = population - 50;
    }
    else if (nativesTier == 'Generous')
    {
        food = food + 25;
        water = water + 25;
    }

    materials = materials + (ships * 5);
    constructionScore = constructionScore + materials;
    

    if(food < 50){
        population = population - (50 - food);
    }
    else if (food > 50){
        population = population + (food - 50);
    }

    if(water < 50){
        population = population - (50 - water);
    }
    else if (water > 50){
        population = population + (water - 50);
    }


    if(ruinsTier == 'Relics'){
        ruinsScore = 50;
    }
    else if(ruinsTier == 'Treasures'){
        ruinsScore = 100;
        constructionScore = constructionScore + 10;
    }

    if(harborTier == 'Impassable'){
        constructionScore = constructionScore - 25;
    }
    else if(harborTier == 'Spacious'){
        constructionScore = constructionScore + 25;
    }

    populationScore = population * 2;
    if(populationScore < 0){
        selectOption(5);
    }

    if(temperatureTier == 'Extreme'){
        temperatureScore = -120;
    }
    else if (temperatureTier == 'Comfortable'){
        temperatureScore = 120;
    }
    


    totalScore = populationScore + temperatureScore + constructionScore + ruinsScore;
    

    //Display final screen
    scoreElement.innerText = totalScore;
    populationScoreElement.innerText = populationScore;
    temperatureScoreElement.innerText = temperatureScore;
    constructionScoreElement.innerText = constructionScore;
    ruinsScoreElement.innerText = ruinsScore;

    


    for (let i = 0; i < statusElements.length; i++) {
        statusElements[i].style.display = '';
    }
    for (let i = 0; i < landElements.length; i++) {
        landElements[i].style.display = '';
    }
    
    shipImageElement.style.display = 'none';
    goodLand1ImageElement.style.display = 'none';
    goodLand2ImageElement.style.display = 'none';
    mediumLand1ImageElement.style.display = 'none';
    mediumLand2ImageElement.style.display = 'none';
    badLand1ImageElement.style.display = 'none';
    badLand2ImageElement.style.display = 'none';
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
)

var deathQuote = deathQuotes[Math.floor(Math.random()*deathQuotes.length)];
var landQuote = landQuotes[Math.floor(Math.random()*landQuotes.length)];
var arrivalText = arrivalTexts[Math.floor(Math.random()*arrivalTexts.length)];

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
        text: 'But one by one, they turned to the sea.',
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
        text: 'The journey of the exiles ends here, its final crewmates perishing at sea.',
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
        text: 'The captain inspects the land',
        quoteText: 'Variable land quote here',
        options: [
            {
                text: 'Restart',
                nextText: -1
            },
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
                text: 'Restart',
                nextText: -1
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
        //Found a colony
        id: 11,
        text: 'You found a colony [PLACEHOLDER]',
        quoteText: '',
        options: [
            {
                text:'Restart',
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
                nextText: 13
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
]

startGame()