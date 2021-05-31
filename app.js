var store = new Persist.Store('deepguide');
loadPersist();


//fix navbar bug
$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});

//moon button swap modes
document.querySelector('#toggle').addEventListener('click', () => {
    toggleMode();
})

//save changes on page exit
window.onbeforeunload = function (e) {
	saveSettings();
    saveStats();
};


//Light/Dark Mode

var styleProperties = [
    '--mainColor',
    '--offColor',
    '--contrast',
    '--background'
]

var moon = document.querySelector('#toggle').firstElementChild;
applyMode();

function saveSettings(){
    store.set('settings', JSON.stringify(settings));
}

function saveStats(){
    store.set('stats', JSON.stringify(stats));
}

function applyMode(){
    styleProperties.forEach(e => {
        swap(e);
    })
    if (settings.mode == 'Light'){
        moon.setAttribute('class', 'bi bi-moon');
    }
    else {
        moon.setAttribute('class', 'bi bi-moon-fill');
    }
    saveSettings();
}

//Swaps mode from Light to Dark and vice versa
function toggleMode(){
    settings.mode = (settings.mode == 'Light') ? 'Dark' : 'Light';
    applyMode();
}

//swaps every item in styleProperties with it's light/dark counterpart
function swap(name){
    document.documentElement.style.setProperty(name, 'var(' + name + settings.mode + ')');
}


var settings;
var stats;

function loadPersist(){
    let obj = store.get('settings');
    if (obj != null) {
        console.log('existing settings');
        settings = JSON.parse(obj);
    }
    else {
        console.log('no settings');
        settings = {
            volume: 1,
            deviceType: 'earbuds',
            deviceName: '',
            mode:'Light'
        };
        saveSettings();
    }

    obj = store.get('stats');
    if (obj != null) {
        stats = JSON.parse(obj);
    }
    else {
        console.log('new stats');
        stats = {
            id: myHash(Math.random()),
            totalRounds: 0,
            totalCorrectX: 0,
            totalCorrectY: 0,
            totalCorrects: 0,
            bestRound: 0
        };
        saveStats();
    }
}

//makes a 5 letter hash from a float
function myHash(num) {
    num = num * Math.pow(10,8);
    num = Math.floor(num);
    num = num + '';
    num = String.fromCharCode(
        65 + (Number(num.substring(0,2))%26),
        65 + (Number(num.substring(2,4))%26),
        65 + (Number(num.substring(4,6))%26),
        65 + (Number(num.substring(6,8))%26),
        65 + (Number(num.substring(8,10))%26),
    )
    return num;
}



