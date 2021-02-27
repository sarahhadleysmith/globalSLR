

//generate house and garden location
var houseOneLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
var houseTwoLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
var houseThreeLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
var houseFourLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
var houseFiveLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';

var houseOneLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';
var houseTwoLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';
var houseThreeLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';
var houseFourLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';
var houseFiveLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';

var gardenOneLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
var gardenTwoLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
var gardenThreeLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
var gardenFourLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
var gardenFiveLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';

var gardenOneLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';
var gardenTwoLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';
var gardenThreeLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';
var gardenFourLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';
var gardenFiveLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';

var houseOne = document.querySelector("#houseOne");
houseOne.style.left = houseOneLocationX;
houseOne.style.top = houseOneLocationY;

var houseTwo = document.querySelector("#houseTwo");
houseTwo.style.left = houseTwoLocationX;
houseTwo.style.top = houseTwoLocationY;

var houseThree = document.querySelector("#houseThree");
houseThree.style.left = houseThreeLocationX;
houseThree.style.top = houseThreeLocationY;

var houseFour = document.querySelector("#houseFour");
houseFour.style.left = houseFourLocationX;
houseFour.style.top = houseFourLocationY;

var houseFive = document.querySelector("#houseFive");
houseFive.style.left = houseFiveLocationX;
houseFive.style.top = houseFiveLocationY;

var gardenOne = document.querySelector("#gardenOne");
gardenOne.style.left = gardenOneLocationX;
gardenOne.style.top = gardenOneLocationY;

var gardenTwo = document.querySelector("#gardenTwo");
gardenTwo.style.left = gardenTwoLocationX;
gardenTwo.style.top = gardenTwoLocationY;

var gardenThree = document.querySelector("#gardenThree");
gardenThree.style.left = gardenThreeLocationX;
gardenThree.style.top = gardenThreeLocationY;

var gardenFour = document.querySelector("#gardenFour");
gardenFour.style.left = gardenFourLocationX;
gardenFour.style.top = gardenFourLocationY;

var gardenFive = document.querySelector("#gardenFive");
gardenFive.style.left = gardenFiveLocationX;
gardenFive.style.top = gardenFiveLocationY;

//make rising water and walls work. Need to make it so user can choose where to place wall
var speed = parseInt(document.querySelector("#speed").value);

function endTurn(click) {
	var water = document.querySelector("#water");
	var currWidth = water.clientWidth;
	var wall = document.querySelector("#wall");
	
	if ((water.style.width != wall.style.left)
			|| ((water.style.width >= wall.style.left) && (water.style.height >= wall.style.height))) { 
		water.style.width = (currWidth + speed) +'px';
	}
	else {
		window.prompt("you win");
	}

	if ((water.style.width > houseOneLocationX) && (water.style.width > houseTwoLocationX) && (water.style.width > houseThreeLocationX) && (water.style.width > houseFourLocationX) && (water.style.width > houseFiveLocationX)) {
		window.prompt("you lose");
		location.reload();
	}
	
	
	//reshowing all of the villager buttons
	var bricksOne = document.querySelector("#oneBricks");
	bricksOne.style.display = "block";

	var bricksTwo = document.querySelector("#twoBricks");
	bricksTwo.style.display = "block";

	var bricksThree = document.querySelector("#threeBricks");
	bricksThree.style.display = "block";

	var bricksFour = document.querySelector("#fourBricks");
	bricksFour.style.display = "block";

	var bricksFive = document.querySelector("#fiveBricks");
	bricksFive.style.display = "block";

	var foodOne = document.querySelector("#oneFood");
	foodOne.style.display = "block";

	var foodTwo = document.querySelector("#twoFood");
	foodTwo.style.display = "block";

	var foodThree = document.querySelector("#threeFood");
	foodThree.style.display = "block";

	var foodFour = document.querySelector("#fourFood");
	foodFour.style.display = "block";

	var foodFive = document.querySelector("#fiveFood");
	foodFive.style.display = "block";


	document.getElementById('foodAmount').value -=1; 

	//chance of a random event occuring this turn:
	var chance = Math.floor(Math.random() * 50);
	randomEvent(chance);

	//Losing conditions:
	var int = parseInt(document.getElementById('foodAmount').value);
	if (int < 1) {
		window.prompt("you lose");
		location.reload();
	}
	if (water.style.width > houseOneLocationX) {
		var houseOne = document.querySelector("#houseOne");
		houseOne.style.display = 'none';
		firstDeath();
	}
	if (water.style.width > houseTwoLocationX) {
		var houseOne = document.querySelector("#houseTwo");
		houseOne.style.display = 'none';
		secondDeath();
	}
	if (water.style.width > houseThreeLocationX) {
		var houseOne = document.querySelector("#houseThree");
		houseOne.style.display = 'none';
		thirdDeath();
	}
	if (water.style.width > houseFourLocationX) {
		var houseOne = document.querySelector("#houseFour");
		houseOne.style.display = 'none';
		fourthDeath();
	}
	if (water.style.width > houseFiveLocationX) {
		var houseOne = document.querySelector("#houseFive");
		houseOne.style.display = 'none';
		fifthDeath();
	}
	if (water.style.width > gardenOneLocationX) {
		var houseOne = document.querySelector("#gardenOne");
		houseOne.style.display = 'none';
	}
	if (water.style.width > gardenTwoLocationX) {
		var houseOne = document.querySelector("#gardenTwo");
		houseOne.style.display = 'none';
	}
	if (water.style.width > gardenThreeLocationX) {
		var houseOne = document.querySelector("#gardenThree");
		houseOne.style.display = 'none';
	} 
	if (water.style.width > gardenFourLocationX) {
		var houseOne = document.querySelector("#gardenFour");
		houseOne.style.display = 'none';
	}
	if (water.style.width > gardenFiveLocationX) {
		var houseOne = document.querySelector("#gardenFive");
		houseOne.style.display = 'none';
	}
	
}

//villager make bricks buttons


function bricksOne(click) {
	var int = parseInt(document.getElementById('brickAmount').value) + 1;
	document.getElementById('brickAmount').value = int;
	var bricksOne = document.querySelector("#oneBricks");
	bricksOne.style.display = "none";
	var foodOne = document.querySelector("#oneFood");
	foodOne.style.display = "none";
}

function bricksTwo(click) {
	var int = parseInt(document.getElementById('brickAmount').value) + 1;
	document.getElementById('brickAmount').value = int;
	var bricksOne = document.querySelector("#twoBricks");
	bricksOne.style.display = "none";
	var foodTwo = document.querySelector("#twoFood");
	foodTwo.style.display = "none";
}

function bricksThree(click) {
	var int = parseInt(document.getElementById('brickAmount').value) + 1;
	document.getElementById('brickAmount').value = int;
	var bricksOne = document.querySelector("#threeBricks");
	bricksOne.style.display = "none";
	var foodThree = document.querySelector("#threeFood");
	foodThree.style.display = "none";
}

function bricksFour(click) {
	var int = parseInt(document.getElementById('brickAmount').value) + 1;
	document.getElementById('brickAmount').value = int;
	var bricksOne = document.querySelector("#fourBricks");
	bricksOne.style.display = "none";
	var foodOne = document.querySelector("#fourFood");
	foodOne.style.display = "none";
}

function bricksFive(click) {
	var int = parseInt(document.getElementById('brickAmount').value) + 1;
	document.getElementById('brickAmount').value = int;
	var bricksOne = document.querySelector("#fiveBricks");
	bricksOne.style.display = "none";
	var foodOne = document.querySelector("#fiveFood");
	foodOne.style.display = "none";
}

//villager make wall buttons:
function wall(click) {  
	var bricks = document.querySelector("#brickAmount");
	if (bricks.value > 2) {
		bricks.value = bricks.value - 3;
	
	

//	if (walls.value == 1) {
//		firstWallPlace();
		
//	}
//	if (bricks.value >= 0) {
		var makeWall = document.querySelector("#wall");
		makeWall.style.display="block";
		var currHeight = makeWall.clientHeight;
		makeWall.style.height = (currHeight + 50) +'px'; //if I put a global variable here instead of 50, maybe I could make a plantMangrove function that decreases this value as more mangroves are planted.
//	}
	}
	

}


//Allowing player to choose wall location:
/*
function firstWallPlace() {
	window.addEventListener('keydown', function (event) {
		var playerImage = document.getElementById('wall');
		var valueToMoveBy = 5;
		switch (event.keyCode) {
			case 65:
				playerImage.style.left = parseInt(playerImage.style.left, 10) - valueToMoveBy + 'px';
				break;
			case 68:
				playerImage.style.left = parseInt(playerImage.style.left, 10) + valueToMoveBy + 'px';
				break;
			default:
				break;
		}
	});
}
*/
/*
function firstWallPlace() {
window.addEventListener('keydown', function (event) {
  switch (event.keyCode) {
    case 65:
      playerImage.style.left = parseInt(playerImage.style.left, 10) - valueToMoveBy + 'px';
      break;
    case 68:
      playerImage.style.left = parseInt(playerImage.style.left, 10) + valueToMoveBy + 'px';
      break;
    default:
      break;
  }
});
}
*/

function moveWallRight(test){
	var wall = document.getElementById("wall");
	var lbStyle = window.getComputedStyle(wall);
	var leftValue = lbStyle.getPropertyValue("left").replace("px", "");

	var bricks = document.querySelector("#brickAmount");
	if (bricks.value > 0) {

	wall.style.left = (Number(leftValue) + 50) + "px";
	document.getElementById('brickAmount').value -= 1;

	}
}


function moveWallLeft(test){
	var wall = document.getElementById("wall");
	var lbStyle = window.getComputedStyle(wall);
	var leftValue = lbStyle.getPropertyValue("left").replace("px", "");

	var bricks = document.querySelector("#brickAmount");
	if (bricks.value > 0) {

	wall.style.left = (Number(leftValue) - 50) + "px";
	document.getElementById('brickAmount').value -= 1;
	}

}

//village people. For now I am going to make it simpler and only have 3 villagers total
//actually probabily only want like 5 or 6 villagers total so it isn't complicated
/*
let HouseOnePeople = ['Oishika', 'Provakar', 'Naisha', 'Joti', 'Pitam'];
let HouseTwoPeople = ['Gajamati', 'Bapti', 'Monohar', 'Mishita', 'Nayyaab'];
let HouseThreePeople = ['Omio', 'Purnava', 'Pakhi', 'Debesh', 'Minati'];
*/
var HouseOnePeople = 'Provakar';
var HouseTwoPeople = 'Gajamati';
var HouseThreePeople = 'Naisha';
var HouseFourPeople = 'Debesh';
var HouseFivePeople = 'Nayyaab';
peopleListOne.innerHTML = HouseOnePeople;
peopleListTwo.innerHTML = HouseTwoPeople;
peopleListThree.innerHTML = HouseThreePeople;
peopleListFour.innerHTML = HouseFourPeople;
peopleListFive.innerHTML = HouseFivePeople;


//fun random events:
function randomEvent(number) {
	if (number == 0 || number == 1 || number == 2 || number == 4) {
		window.prompt("Monsoon!");
		monsoon();
	}
	else if (number == 5 || number == 6 || number == 7) {
		window.prompt("Flooding!");
		flooding();
	}
	else if (number == 13) {
		window.prompt("Resource Donation!");
		resourceDonation();
	}
	else if (number == 14 || number == 15) {
		window.prompt("Food Donation!");
		foodDonation();
	}
	else if (number == 8) {
		window.prompt("A combination of factors related to the country’s geography, population, and economy make Bangladesh one of the countries most prone to the effects of SLR.");
	}
	else if (number == 9) {
		window.prompt("The combination of the thermal expansion of the oceans and sea ice melt is expected to cause a SLR of 0.3 m to 1 m by the end of the century. More than 70% of the land area of Bangladesh is less than 1 meter above sea level.");
	}
	else if (number == 10) {
		window.prompt("Bangladesh is more at risk to flooding because the country experiences a monsoon season and SLR exacerbates the flood risks already associated with the heavy rainfall and cyclonic storm surges caused by monsoons.");
	}
	else if (number == 11 || number == 12) {
		window.prompt("Salt Water Intrustion Effects Your Crops!")
		saltWater();
	}
}

function monsoon() {
	endTurn();
	endTurn();
	endTurn();
}

function flooding() {
	endTurn();
}

function saltWater() {
	document.getElementById('foodAmount').value -=3;
}

function resourceDonation() {
	var int = parseInt(document.getElementById('brickAmount').value) + 15;
	document.getElementById('brickAmount').value = int;}

function foodDonation() {
	var int = parseInt(document.getElementById('foodAmount').value) + 10;
	document.getElementById('foodAmount').value = int;
}

//Food bars:

function foodBarOne(click){
	var int = parseInt(document.getElementById('foodAmount').value) + 1;
	document.getElementById('foodAmount').value = int;
	var foodOne = document.querySelector("#oneFood");
	foodOne.style.display = "none";
	var bricksOne = document.querySelector("#oneBricks");
	bricksOne.style.display = "none";
}

function foodBarTwo(click){
	var int = parseInt(document.getElementById('foodAmount').value) + 1;
	document.getElementById('foodAmount').value = int;
	var foodTwo = document.querySelector("#twoFood");
	foodTwo.style.display = "none";
	var bricksOne = document.querySelector("#twoBricks");
	bricksOne.style.display = "none";
}

function foodBarThree(click){
	var int = parseInt(document.getElementById('foodAmount').value) + 1;
	document.getElementById('foodAmount').value = int;
	var foodThree = document.querySelector("#threeFood");
	foodThree.style.display = "none";
	var bricksOne = document.querySelector("#threeBricks");
	bricksOne.style.display = "none";

}

function foodBarFour(click){
	var int = parseInt(document.getElementById('foodAmount').value) + 1;
	document.getElementById('foodAmount').value = int;
	var foodFour = document.querySelector("#fourFood");
	foodFour.style.display = "none";
	var bricksOne = document.querySelector("#fourBricks");
	bricksOne.style.display = "none";

}

function foodBarFive(click){
	var int = parseInt(document.getElementById('foodAmount').value) + 1;
	document.getElementById('foodAmount').value = int;
	var foodFive = document.querySelector("#fiveFood");
	foodFive.style.display = "none";
	var bricksOne = document.querySelector("#fiveBricks");
	bricksOne.style.display = "none";

}

//planting mangroves:

function plantMangroveOne(click) {
	var mangroveOneLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
	var mangroveOneLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';

	var mangroveOne = document.querySelector("#oneMangrove");
	var mangroveImageOne = document.querySelector("#mangroveImageOne");
	mangroveImageOne.style.left = mangroveOneLocationX;
	mangroveImageOne.style.top = mangroveOneLocationY;

	mangroveOne.style.display = "none";
	mangroveImageOne.style.display = "block";

	var foodOne = document.querySelector("#oneFood");
	foodOne.style.display = "none";
	var bricksOne = document.querySelector("#oneBricks");
	bricksOne.style.display = "none";

	document.getElementById('foodAmount').value -=2;

	speed = parseInt(document.querySelector("#speed").value) - 9;
}

function plantMangroveTwo(click) {
	var mangroveTwoLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
	var mangroveTwoLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';

	var mangroveTwo = document.querySelector("#twoMangrove");
	var mangroveImageTwo = document.querySelector("#mangroveImageTwo");
	mangroveImageTwo.style.left = mangroveTwoLocationX;
	mangroveImageTwo.style.top = mangroveTwoLocationY;

	mangroveTwo.style.display = "none";
	mangroveImageTwo.style.display = "block";

	var foodTwo = document.querySelector("#twoFood");
	foodTwo.style.display = "none";
	var bricksOne = document.querySelector("#twoBricks");
	bricksOne.style.display = "none";

	document.getElementById('foodAmount').value -=2;

	speed = parseInt(document.querySelector("#speed").value) - 9;
}

function plantMangroveThree(click) {
	var mangroveThreeLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
	var mangroveThreeLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';

	var mangroveThree = document.querySelector("#threeMangrove");
	var mangroveImageThree = document.querySelector("#mangroveImageThree");
	mangroveImageThree.style.left = mangroveThreeLocationX;
	mangroveImageThree.style.top = mangroveThreeLocationY;

	mangroveThree.style.display = "none";
	mangroveImageThree.style.display = "block";

	var foodThree = document.querySelector("#threeFood");
	foodThree.style.display = "none";
	var bricksOne = document.querySelector("#threeBricks");
	bricksOne.style.display = "none";

	document.getElementById('foodAmount').value -=2;

	speed = parseInt(document.querySelector("#speed").value) - 9;
}

function plantMangroveFour(click) {
	var mangroveTwoLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
	var mangroveTwoLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';

	var mangroveTwo = document.querySelector("#fourMangrove");
	var mangroveImageTwo = document.querySelector("#mangroveImageFour");
	mangroveImageTwo.style.left = mangroveTwoLocationX;
	mangroveImageTwo.style.top = mangroveTwoLocationY;

	mangroveTwo.style.display = "none";
	mangroveImageTwo.style.display = "block";

	var foodTwo = document.querySelector("#fourFood");
	foodTwo.style.display = "none";
	var bricksOne = document.querySelector("#fourBricks");
	bricksOne.style.display = "none";

	document.getElementById('foodAmount').value -=2;

	speed = parseInt(document.querySelector("#speed").value) - 9;
}

function plantMangroveFive(click) {
	var mangroveTwoLocationX = (Math.floor(Math.random() * 850) + 200) + 'px';
	var mangroveTwoLocationY = (Math.floor(Math.random() * 500) + 20) + 'px';

	var mangroveTwo = document.querySelector("#fiveMangrove");
	var mangroveImageTwo = document.querySelector("#mangroveImageFive");
	mangroveImageTwo.style.left = mangroveTwoLocationX;
	mangroveImageTwo.style.top = mangroveTwoLocationY;

	mangroveTwo.style.display = "none";
	mangroveImageTwo.style.display = "block";

	var foodTwo = document.querySelector("#fiveFood");
	foodTwo.style.display = "none";
	var bricksOne = document.querySelector("#fiveBricks");
	bricksOne.style.display = "none";

	document.getElementById('foodAmount').value -=2;

	speed = parseInt(document.querySelector("#speed").value) - 9;
}

//getting rid of villagers with flooded houses:
function firstDeath() {
	var personOne = document.getElementById('peopleListOne');
	personOne.style.display = "none";

	var foodTwo = document.querySelector("#oneFood");
	foodTwo.style.display = "none";
	var bricksOne = document.querySelector("#oneBricks");
	bricksOne.style.display = "none";
	var mangroveOne = document.querySelector("#oneMangrove");
	mangroveOne.style.display = "none";

}

function secondDeath() {
	var personOne = document.getElementById('peopleListTwo');
	personOne.style.display = "none";

	var foodTwo = document.querySelector("#twoFood");
	foodTwo.style.display = "none";
	var bricksOne = document.querySelector("#twoBricks");
	bricksOne.style.display = "none";
	var mangroveOne = document.querySelector("#twoMangrove");
	mangroveOne.style.display = "none";

}

function thirdDeath() {
	var personOne = document.getElementById('peopleListThree');
	personOne.style.display = "none";

	var foodTwo = document.querySelector("#threeFood");
	foodTwo.style.display = "none";
	var bricksOne = document.querySelector("#threeBricks");
	bricksOne.style.display = "none";
	var mangroveOne = document.querySelector("#threeMangrove");
	mangroveOne.style.display = "none";

}

function fourthDeath() {
	var personOne = document.getElementById('peopleListFour');
	personOne.style.display = "none";

	var foodTwo = document.querySelector("#fourFood");
	foodTwo.style.display = "none";
	var bricksOne = document.querySelector("#fourBricks");
	bricksOne.style.display = "none";
	var mangroveOne = document.querySelector("#fourMangrove");
	mangroveOne.style.display = "none";

}

function fifthDeath() {
	var personOne = document.getElementById('peopleListFive');
	personOne.style.display = "none";

	var foodTwo = document.querySelector("#fiveFood");
	foodTwo.style.display = "none";
	var bricksOne = document.querySelector("#fiveBricks");
	bricksOne.style.display = "none";
	var mangroveOne = document.querySelector("#fiveMangrove");
	mangroveOne.style.display = "none";

}

//instructions stuff:
function instruct() {
	var black = document.querySelector('#black');
	var instructions = document.querySelector('#instructions');
	var button = document.querySelector('#instructButt');
	black.style.display = 'none';
	instructions.style.display = 'none';
	button.style.display = 'none';
}
