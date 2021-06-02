var hor = document.querySelector('#hor');
var vert = document.querySelector('#vert');
var highscore = document.querySelector('#highscore');

//stats = JSON.parse('{"id":"DEBUG","totalRounds":90,"totalCorrectX":25,"totalCorrectY":43,"totalCorrects":14,"bestRound":7}');

if (stats.totalRounds > 0){
	hor.innerHTML = 'Horizontal: ' + (stats.totalCorrectX * 100 /  stats.totalRounds).toFixed(1) + '%'
	vert.innerHTML = 'Vertical: ' + (stats.totalCorrectY * 100 /  stats.totalRounds).toFixed(1) + '%'
	highscore.innerHTML = 'Top Score: ' + stats.bestRound + ' Rounds!'
}
else{
	hor.innerHTML = 'Horizontal: None'
	vert.innerHTML = 'Vertical: None'
	highscore.innerHTML = 'No games played'
}