document.addEventListener("DOMContentLoaded", function(event) {
	console.log('loaded');
  });

window.onbeforeunload = function (e) {
	settings.volume = document.querySelector('#volume').value;
	settings.deviceType = document.querySelector('#option1').checked ? 'earbuds' : 'headphones'
	settings.deviceName = document.querySelector('#devicename').value;
	saveSettings();
	saveStats();
};

//set volume
document.querySelector('#volume').value = settings.volume;

//set device type
if (settings.deviceType == 'earbuds') {
	document.querySelector('#option1').click();
}
else document.querySelector('#option2').click();

//set device name
document.querySelector('#devicename').value = settings.deviceName;
