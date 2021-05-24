buttons = document.querySelectorAll('.kekers')
rad = '12%';
soundPackPath = 'soundPacks/'
soundPacks = [
	'2_3_DU',
	'1_1_FB',
]
sounds = [];

function open(val = rad){
	console.log(val);
	buttons.forEach(e => {
		e.style['border-radius'] = val;
		console.log(e.style['border-radius']);
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
	round = 5;
	loadSounds(p);
	
	play(Math.floor(Math.random() * 9));
	
}

function endGame(){
	stop();
	setMargin2(0);
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
	if (round < 0){
		console.log('ended');
		if (pressed == 4) {
			location.reload();
		}
	}
	else {
		play(Math.floor(Math.random() * 9));
		round--;
		if (round < 0){
			console.log('end-game');
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
	let record = {
		name: packName,
		round: round,
		totalRounds: stats.totalRounds,
		deviceType: settings.deviceType,
		deviceName: settings.deviceName,
		correctX: correctX,//check
		correctY: correctY,//check
		correct: correctX && correctY,
		elapsed: 1.2//timer
	}
}

newGame('1_1_FB');