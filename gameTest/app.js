//The 3 screens
var start = document.querySelector('#start');
var mid = document.querySelector('#mid');
var end = document.querySelector('#end');



//for testing
var bt = document.querySelector('#bt');
var slid = document.querySelector('#slid');

//Start Screen
var startBt = document.querySelector('#start-button');
var retryBt = document.querySelector('#retry-button');

slid.addEventListener('change', () => {
	e = [start, mid, end][slid.value]
	swapFocus4(e);
})
slid.focus();

bt.addEventListener('click', () => {
	console.log('Button clicked');
})

//Main Screen ---> Game
startBt.addEventListener('click', () => {
	swapFocus4(mid);
	init('3_3_DU_irc_1037');
})

//End Screen ---> Main Screen
retryBt.addEventListener('click', () => {
	swapFocus4(start);
})

//making other elements non opaque/non displaying
var active = start;
var id;
active.style.opacity = 1;
active.style.display = 'block';

mid.style.opacity = 0;
end.style.opacity = 0;

mid.style.display = 'none';
end.style.display = 'none';


//pop in start menu first
swapFocus4(start);

//assumes all elements start with opacity: 0; & display: 'none';
//Transition from one element to the other by hiding the currently active one and fading-in the next
function swapFocus4(element){
	clearInterval(id);
	let ac = active;
	active = element;
	ac.style.opacity = 0;
	ac.style.display = 'none';
	element.style.display = 'block';	
	id = setInterval(() => {
		element.style.opacity = Number(element.style.opacity) + 0.05;
		if (element.style.opacity >= 1) {
			clearInterval(id);
		}
	}, 5);
}

//Game Itself

//choosen b4
var soundPack;
var info = {
	distance: -1,
	radius: -1,
	axis: '',
	hrtf: ''
}

var hearts = 3;
var round = 1;
var state = 'start'

var buttons = document.querySelectorAll('.sound-button');
var heart = document.querySelectorAll('.heart');
var audios = []

var soundPackRoot = 'soundPacks/'

buttons.forEach(e => {
	e.addEventListener('click', () => {
		action(Number(e.value));
	});
})

var playing = 0;
function play(i){
	audios[playing].pause();
	audios[playing].currentTime = 0;
	playing = i;
	audios[playing].play();
}

function stop(){
	audios[playing].pause();
	audios[playing].currentTime = 0;
}

function init(packName){
	hearts = 3;
	round = 1;
	gameState = 'midGame';
	audios = [];
	soundPack = packName;

	for(let i = 0; i < 9; i++){
		let path = soundPackRoot + packName + '/' + i + '.wav'
		audios.push(new Audio(path))
		audios[i].loop = true;
	}

	for(let i = 0; i < 3; i++){
		heart[i].innerHTML = '<i class="bi bi-suit-heart-fill">';
	}

	//set info from folder name
	let reg = /(\d+)_(\d+)_(\w{2})_(.*)/;
	let cap = packName.match(reg);
	info.distance = cap[1];
	info.radius = cap[2];
	info.axis = cap[3];
	info.hrtf = cap[4];


	//setGraphics, button text and/or svg background
	//setGraphics()

	play(Math.floor(Math.random() * 9));

	startTime();
}

function action(btn){
	if (gameState != 'midGame') return null;
	//✓check if button was right
	let b = btn;
	let p = playing;

	correctX = Math.floor(b/3) === Math.floor(p/3);
	correctY = b%3 === p%3;

	//✓record data
	record(btn, correctX, correctY);

	if (correctX && correctY){
		round++;
		play(Math.floor(Math.random() * 9));
	}
	else {
		hearts--;
		removeHeart(hearts);
		if (hearts <= 0) {
			gameState = 'finished';
			stop();
			setTimeout(() => {
				swapFocus4(end);
			}, 300);
		}
		else {
			round++;
			play(Math.floor(Math.random() * 9));
		}
	}
	//✓right
		//next round
		//rounds +1
	//✓wrong
		//less heart
		//check if hearts are 0
			//yes
				//change game gameState to finished
				//go to endcard
			//no
				//rounds +1
				
}

function removeHeart(h){
	//animation
	heart[h].innerHTML = '<i class="bi bi-suit-heart">';
	let i = 0;
	let id = setInterval(() => {
		i += Math.PI / 4;
		position = Math.sin(i) * 2;
		heart[h].style.transform = `translate(${position}px, 0px)`;
		if (i > 4*Math.PI) clearInterval(id);
	}, 1)
}

function record(btn, correctX, correctY){

	let e = timeElapsed();
	// add ✓button clicked, ✓sound location, ✓rest of info from pack
	stats.totalRounds++;
	if (correctX) stats.totalCorrectX++;
	if (correctY) stats.totalCorrectY++;
	if (correctX && correctY) stats.totalCorrects++;

	let record = {
		packName: soundPack,
		distance: info.distance,
		radius: info.radius,
		axis: info.axis,
		hrtf: info.hrtf,

		deviceType: settings.deviceType,
		deviceName: settings.deviceName,

		round: round,
		buttonPressed: btn,
		soundPlaying: playing,

		correctX: correctX,
		correctY: correctY,
		correct: correctX && correctY,

		totalCorrectX: stats.totalCorrectX,
		totalCorrectY: stats.totalCorrectY,
		totalCorrects: stats.totalCorrects, 

		elapsed: e
	}

	saveStats();

	pushBoth(stats.id, stats.totalRounds, record);
}

var tstart;
var cur;
function startTime(){
	tstart = new Date();
}

function timeElapsed(){
	cur = new Date();
	let elapsed = cur - tstart;
	tstart = cur;
	return elapsed / 1000;
}

//dummy setting/stats
var settings = {
	deviceType: 'a',
	deviceName: 'fe'
}

var stats = {
	totalCorrectX: 420,
	totalCorrectY: 420,
	totalCorrects: 420
}

function saveStats(){

}

function pushBoth(a,b,c){

}