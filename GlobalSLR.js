

//make rising water and walls work
function endTurn(click) {
	var water = document.querySelector("#water")
	var currWidth = water.clientWidth;
	var wall = document.querySelector("#wall")
	if (water.style.width != wall.style.left && water.style.height != wall.style.height) {  //this second expression does not work
		water.style.width = (currWidth + 50) +'px';
	}
}
	
var i = 0;
function bricks(click) {
	document.getElementById('brickAmount').value = ++i;
}

function wall(click) {  //look up how to place walls with mouse
	var bricks = document.querySelector("#brickAmount")
	bricks.value = bricks.value - 5;
	var makeWall = document.querySelector("#wall")
	makeWall.style.display="block"
	var currHeight = makeWall.clientHeight;
	makeWall.style.height = (currHeight + 50) +'px';


}




