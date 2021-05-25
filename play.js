buttons = document.querySelectorAll('.kekers')
rad = '12%';
soundPackPath = 'soundPacks/'
soundPacks = [
	'2_3_DU',
	'1_1_FB',
	'3_3_FB',
]
sounds = [];

function open(val = rad){
	buttons.forEach(e => {
		e.style['border-radius'] = val;
	})
}

function close(){
	cur = buttons[0].style['border-radius']
	buttons.forEach(e => {
		e.style['border-radius'] = 0;
	})
	buttons[0].style['border-top-left-radius'] = rad;
	buttons[2].style['border-top-right-radius'] = rad;
	buttons[6].style['border-bottom-left-radius'] = rad;
	buttons[8].style['border-bottom-right-radius'] = rad;
}


function setMargin(val){
	buttons.forEach(e => {
		e.style.margin = val;
	})
}


function setMargin2(val){
	if (val < 1) {
		setMargin(val)
		close();
	}
	else {
		open();
		setMargin(val)
	}
}

function loadSounds(pack){
	sounds = [];
	for(i = 0; i < 9; i++){
		let audio = new Audio(soundPackPath + pack + '/' + i + '.wav');
		audio.loop = false;
		sounds.push(audio);
	}
}

var packName;
function newGame(p){
	packName = p;
	setMargin2(3);
	round = 4;
	loadSounds(p);
	
	play(Math.floor(Math.random() * 9));
	startTime();
}

function endGame(){
	stop();
	setMargin2(0);
	buttons.forEach(b => {
		b.innerHTML = '';
	})
	buttons[6].innerHTML = 'Play Again';
	buttons[7].innerHTML = 'Settings';
	buttons[8].innerHTML = 'Help';
}

var playing = 0;
function play(i){
	sounds[playing].pause();
	sounds[playing].currentTime = 0;
	playing = i;
	sounds[playing].play();
}

function stop(){
	sounds[playing].pause();
	sounds[playing].currentTime = 0;
}



var round;
var correctX;
var correctY;
function pressButton(pressed){	
	//game already ended
	if (round < 0){
		
		if (pressed == 6) {
			location.reload();
		}
	}
	//game is going
	else {
		round--;
		let b = pressed;
		let p = playing;

		correctX = Math.floor(b/3) === Math.floor(p/3);
		correctY = b%3 === p%3

		record();

		play(Math.floor(Math.random() * 9));
		//game just ended
		if (round < 0){
			endGame();
		}
	}
	
}

for(let i = 0; i < 9; i++){
	buttons[i].addEventListener('click', () => {
		pressButton(i)
	});
}

records = []

function record(){
	let e = timeElapsed();
	let record = {
		packName: packName,
		deviceType: settings.deviceType,
		deviceName: settings.deviceName,
		round: 4 - round,
		correctX: correctX,
		correctY: correctY,
		correct: correctX && correctY,
		totalCorrectX: stats.totalCorrectX,
		totalCorrectY: stats.totalCorrectY,
		elapsed: e
	}

	stats.totalRounds++;
	if (correctX) stats.totalCorrectX++;
	if (correctY) stats.totalCorrectY++;
	if (correctX && correctY) stats.totalCorrects++;

	saveStats();

	console.log(record);

	pushBoth(stats.id, stats.totalRounds, record);

	//records.push(record);
}

function sendRecord(){
	//store in firebase
	console.log(records);
}

var start;
var cur;
function startTime(){
	start = new Date();
}

function timeElapsed(){
	cur = new Date();
	let elapsed = cur - start;
	start = cur;
	return elapsed / 1000;
}

newGame('3_3_DU');
