var hor = document.querySelector('#hor');
var vert = document.querySelector('#vert');
var highscore = document.querySelector('#highscore');
var chart = document.querySelector('.chart-js').getContext('2d');
var chartTitle = document.querySelector('#chart-title');

var dropDownMenu = document.querySelector('.dropdown-menu');
var dropDownToggle = document.querySelector('.dropdown-toggle');

var myChart;
//stats = JSON.parse('{"id":"DEBUG","totalRounds":90,"totalCorrectX":25,"totalCorrectY":43,"totalCorrects":14,"bestRound":7}');

currentPack = Object.entries(soundPackSet)[0][0];
displayStats();
dropDownToggle.innerHTML = Object.entries(soundPackSet)[0][1]
Object.entries(soundPackSet).forEach(e => {
	var c = document.createElement('a');
	c.innerHTML = e[1];
	c.classList.add('dropdown-item');
	c.href = '#';
	c.addEventListener('click', () => {
		myChart.destroy();
		currentPack = e[0];
		dropDownToggle.innerHTML = e[1];
		displayStats();
	})
	dropDownMenu.appendChild(c);
});

function displayStats(){
	console.log(stats[currentPack].totalRounds);
	if (stats[currentPack].totalRounds > 0){
		document.querySelectorAll('.stats').forEach(e => {
			e.style.display = 'block';
		})
		document.querySelector('#empty').innerHTML = '';

		hor.innerHTML = 'Horizontal: ' + (stats[currentPack].totalCorrectX * 100 /  stats[currentPack].totalRounds).toFixed(1) + '%'
		vert.innerHTML = 'Vertical: ' + (stats[currentPack].totalCorrectY * 100 /  stats[currentPack].totalRounds).toFixed(1) + '%'
		highscore.innerHTML = 'Top Score: ' + stats[currentPack].bestRound + ' Rounds!'
		chartTitle.innerHTML = 'Progression: ';
		getProgression(stats.id, currentPack, parseProgression);
	}
	else{
		document.querySelectorAll('.stats').forEach(e => {
			e.style.display = 'none';
		})
		document.querySelector('#empty').innerHTML = `Play atleast one game on ${soundPackSet[currentPack]} <a href="index.html?mode=${currentPack}" style="color: var(--mainColor)">here</a> to see your stats.`;
	
	}
}



//Draw graph, get's called by getMetric
function parseProgression(labels, values) {
	const data = {
		labels: labels,
		datasets: [{
			backgroundColor: '#9B50E2',
			borderColor: '#A25BE4',
			label: 'round',
			data: values,
			tension: 0,
			pointRadius: 4,
			hitRadius: 30,
			fill: {
				target: 'origin',
				above: 'rgba(155, 80, 226, 0.4)',   // Area will be red above the origin
				below: 'rgb(0, 0, 255)'    // And blue below the origin
            },
		}]
	};
	
	const config = {
		type: 'line',
		data,
		options: {
			elements:{
				line: {
					fill: true,
					below: '#A2FFE4',
				},
			},
			animation:true,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					enabled: true,
				}
			},
			scales: {
				y: {
					//type: 'logarithmic',
					min: 0,
				},
				x: {
					
				}
			  }
	   }
	};


	
	myChart = new Chart(
		chart,
		config
	);
}
