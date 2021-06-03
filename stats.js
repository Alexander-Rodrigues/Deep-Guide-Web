var hor = document.querySelector('#hor');
var vert = document.querySelector('#vert');
var highscore = document.querySelector('#highscore');
var chart = document.querySelector('.chart-js').getContext('2d');
var chartTitle = document.querySelector('#chart-title');

//stats = JSON.parse('{"id":"DEBUG","totalRounds":90,"totalCorrectX":25,"totalCorrectY":43,"totalCorrects":14,"bestRound":7}');

if (stats.totalRounds > 0){
	hor.innerHTML = 'Horizontal: ' + (stats.totalCorrectX * 100 /  stats.totalRounds).toFixed(1) + '%'
	vert.innerHTML = 'Vertical: ' + (stats.totalCorrectY * 100 /  stats.totalRounds).toFixed(1) + '%'
	highscore.innerHTML = 'Top Score: ' + stats.bestRound + ' Rounds!'
	chartTitle.innerHTML = 'Progression: ';
	getProgression(stats.id, parseProgression);
}
else{
	document.querySelectorAll('.stats').forEach(e => {
		e.style.display = 'none';
	})
	document.querySelector('#empty').innerHTML = 'Play atleast one game <a href="play.html" style="color: var(--mainColor)">here</a> to see your stats.';

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
				}
			},
			scales: {
				y: {
					//type: 'logarithmic',
				}
			  }
	   }
	};


	
	myChart = new Chart(
		chart,
		config
	);
}
