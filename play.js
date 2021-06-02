//The 3 screens
var start = document.querySelector('#start');
var mid = document.querySelector('#mid');
var end = document.querySelector('#end');

var debug = true;

//Start Screen
var startBt = document.querySelector('#start-button');
var retryBt = document.querySelector('#retry-button');

//chart
var chart = document.querySelector('.chart-js').getContext('2d');

//Main Screen ---> Game
startBt.addEventListener('click', () => {
	swapFocus4(mid);
	init('2_8_DU_phone3shorter_irc_1037');
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

var soundPack;
var info = {
	distance: -1,
	radius: -1,
	axis: '',
	soundName: '',
	hrtf: ''
}

var hearts = 3;
var state = 'start'

var gameRound = 1;
var trueRound = 1;

var buttons = document.querySelectorAll('.sound-button');
var heart = document.querySelectorAll('.heart');

//Text elements that display rounds
var rounds = document.querySelectorAll('.round');
var audios = []

var soundPackRoot = 'soundPacks/'

rightSound = new Audio('sounds/right.wav');
rightSound.volume = settings.volume;

wrongSound = new Audio('sounds/wrong.wav');
wrongSound.volume = settings.volume;

var myChart;

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
	gameRound = 1;
	trueRound = 1;
	gameState = 'midGame';
	audios = [];
	soundPack = packName;

	for(let i = 0; i < 9; i++){
		let path = soundPackRoot + packName + '/' + i + '.wav'
		audios.push(new Audio(path))
		audios[i].loop = true;
		audios[i].volume = settings.volume;
	}

	for(let i = 0; i < 3; i++){
		heart[i].innerHTML = '<i class="bi bi-suit-heart-fill">';
	}

	//✓set info from folder name
	//  reg = distance_radius_axis_sound_hrtf
	let reg = /(\d+)_(\d+)_(\w{2})_([a-z0-9A-Z]+)_(.+)/;
	let cap = packName.match(reg);
	info.distance = cap[1];
	info.radius = cap[2];
	info.axis = cap[3];
	info.soundName = cap[4];
	info.hrtf = cap[5];

	rounds[0].innerHTML = 'Round 1';

	//set graph
	//fix second graph not apearing
	var tfix = true; //not showing second graph for now cuz only one game mode
	if (!debug && !tfix) {
		try{
			myChart.destroy();
			getMetrics(soundPack, parseMetrics);
		}
		catch(e){
			console.log(e);
		}
		
	}

	play(Math.floor(Math.random() * 9));

	startTime();
}

//Gets called on button press
function action(btn){
	if (gameState != 'midGame') return null;
	//✓check if button was right
	let b = btn;
	let p = playing;

	correctX = b%3 === p%3;
	correctY = Math.floor(b/3) === Math.floor(p/3);

	//✓record data
	record(btn, correctX, correctY);


	//right button
	if (correctX && correctY){
		gameRound++;
		trueRound++;
		play(Math.floor(Math.random() * 9));
		rightButtonAnim(btn);
	}
	else {
		hearts--;
		removeHeart(hearts);
		wrongButtonAnim(btn);
		//no hearts left
		if (hearts <= 0) {
			gameState = 'finished';
			stop();
			incMetric(soundPack, gameRound);
			if (stats.bestRound < gameRound) stats.bestRound = gameRound;
			saveStats();
			setTimeout(() => {
				swapFocus4(end);
			}, 300);
		}
		else {
			trueRound++;
		}
	}

	//update the round h1 texts
	rounds.forEach(e => {
		e.innerHTML = 'Round ' + gameRound;
	})
	
	console.log('True: ' + trueRound + ' Game: ' + gameRound);
}

function rightButtonAnim(b){
	rightSound.play();
	rightSound.currentTime = 0;
}

function wrongButtonAnim(b){
	wrongSound.play();
	let button = buttons[b];
	let i = 0;
	let id = setInterval(() => {
		i += Math.PI / 2;
		position = Math.sin(i) * 2 + 2;
		button.style.transform = `translate(0px, ${position}px)`;
		if (i > 2*Math.PI) {
			button.style.transform = '';
			clearInterval(id);
		}
	}, 3)
	wrongSound.currentTime = 0;
}

//Changes hearts to empty visually and shakes them
function removeHeart(h){
	heart[h].innerHTML = '<i class="bi bi-suit-heart">';
	let i = 0;
	let id = setInterval(() => {
		i += Math.PI / 4;
		position = Math.sin(i) * 2;
		heart[h].style.transform = `translate(${position}px, 0px)`;
		if (i > 4*Math.PI) clearInterval(id);
	}, 1)
}

//Records and sends stats, updates stats like total rounds,
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
		soundName: info.soundName,
		hrtf: info.hrtf,

		deviceType: settings.deviceType,
		deviceName: settings.deviceName,

		trueRound: trueRound,
		gameRound: gameRound,

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

//For measuring time between rounds
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

//Draw graph, get's called by getMetric
function parseMetrics(arr) {
	arr = arr.slice(1,21);
	var max = arr.reduce((a,b) => {
		return Math.max(a,b);
	})
	var sum = arr.reduce((a,b) => {
		return a + b;
	})
	console.log(max, sum , arr);

    var lab = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
	


	const labels = lab;
	const data = {
		labels: labels,
		datasets: [{
			backgroundColor: '#9B50E2',
			borderColor: '#A25BE4',
			label: 'Rounds',
			data: arr,
			tension: 0.3,
			pointRadius: 4,
			hitRadius: 50,
		}]
	};
	
	const config = {
		type: 'line',
		data,
		options: {
			animation:false,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					enabled: true,
					callbacks: {
						label: function(context) {
							var label = '';
	
							
							if (context.parsed.y !== null) {
								label += (Number(context.parsed.y)*100/sum).toFixed(1) + '%' ;
							}
							return label;
						},
						title: function() {},
					},
					displayColors: false,
					padding: 5,
				}
			},
			scales: {
				y: {
					display: false,
					min: 0,
					font: {
						size: 20,
					},
				},
				x: {
					display: true,
					text: 'hallo',
					step: 1,
					ticks: {
						autoSkip: false,
						maxRotation: 0,
                    	minRotation: 0,
					},
				},
			}
	   }
	};

	myChart = new Chart(
		chart,
		config
	);
}

//Gets the values and calls parseMetrics on them
if (debug){
	var testArr = [0,88,60,30,12,3,4,6,7,4,2,14,28,14,45,23,13,8,7,6,10];
	parseMetrics(testArr);
} 
else {
	getMetrics('all', parseMetrics);
}
