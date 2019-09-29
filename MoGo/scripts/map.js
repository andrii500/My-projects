var mapTape = document.getElementById('mapZone');
var mapBlock = document.getElementById('mapBlock');
var curtain = document.getElementById('curtain');

mapTape.addEventListener('click', function () {
    mapBlock.classList.remove('hidden');
});

curtain.addEventListener('click', function () {
    mapBlock.classList.add('hidden');
});

