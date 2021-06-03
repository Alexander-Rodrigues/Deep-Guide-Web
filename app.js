const version = 20;
var store = new Persist.Store('deepguide');
loadPersist();

function load_data() {
    //new persist store goes here suposedly but we're ignoring it
    //just leaving it here for remembering what this is about
}

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
	saveAll();
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

function saveMeta(){
    store.set('meta', JSON.stringify(meta));
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
var meta;

function newSettings(){
    settings = {
        volume: 0.5,
        deviceType: 'default',
        deviceName: '',
        mode:'Light'
    };
}

function newStats(){
    stats = {
        id: myHash(Math.random()),
        totalGames: 0,
        totalRounds: 0,
        totalCorrectX: 0,
        totalCorrectY: 0,
        totalCorrects: 0,
        bestRound: 0
    };
}

function newMeta(){
    meta = {
        version: version,
    };
}

function saveAll(){
    saveSettings();
    saveStats();
    saveMeta();
}

function loadPersist(){
    let obj = store.get('settings');
    if (obj != null) {
        settings = JSON.parse(obj);
    }
    else {
        newSettings();
        saveSettings();
    }

    obj = store.get('stats');
    if (obj != null) {
        stats = JSON.parse(obj);
    }
    else {
        newStats();
        saveStats();
    }

    obj = store.get('meta');
    if (obj != null) {
        meta = JSON.parse(obj);
        if (meta.version != version){
            newSettings();
            newStats();
            newMeta();
            saveAll();
        } 
    }
    else {
        newSettings();
        newStats();
        newMeta();
        saveAll();
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



