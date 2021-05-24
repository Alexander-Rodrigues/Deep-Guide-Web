var select = document.querySelector('#myselect')
var frame = document.querySelector('#frame')
var random = document.querySelector('#Random')
//folder for soundpacks
var soundPacks = '../soundPacks'
//distance_radius_axis
var folders = [
	'2_3_DU',
	'1_1_FB',
]

var sounds = []
var buttons = []


//make select list
folders.forEach(e => {
	var opt = document.createElement('option');
	opt.value = e;
	opt.innerHTML = e;
	select.appendChild(opt)
});


var playing = 0;
function play(i){
	sounds[playing].pause();
	sounds[playing].currentTime = 0;
	playing = i;
	sounds[playing].play();
}


function loadAudio(pack){
	for(let i = 0; i < 9; i++){
		var name = soundPacks + "/" + pack + "/" + i + ".wav"
		sounds[i].setAttribute('src',name);
	}
}

//load audio when selecting new pack
select.addEventListener('change', () => {
	loadAudio(select.value);
	console.log(select.value);
})

random.addEventListener('click', () => {
	play(Math.floor(Math.random() * 9))
})

//create buttons
for(let i = 0; i < 9; i++){
	var button = document.createElement('button');
	button.setAttribute('class', 'butt');
	button.setAttribute('id', i);
	button.style.backgroundImage = `url('${'../imgs/arrows/' + i + '.png'}')`
	buttons.push(button);
	frame.appendChild(button);
}

//create 9 dummy audios
for(let i = 0; i < 9; i++){
		sounds.push(new Audio('0.wav'))
		console.log(i);
	}

//assign each button to an audio
for(let i = 0; i < 9; i++){
	buttons[i].addEventListener('click', () => {
		play(i);
	})
}

//load values before selection
if (select.value) {
	loadAudio(select.value)
	console.log(select.value);
}


