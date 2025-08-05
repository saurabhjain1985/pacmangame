console.log('Test script loaded');

function selectMode(mode) {
    console.log('selectMode called with:', mode);
    alert('Mode selected: ' + mode);
}

window.addEventListener('load', () => {
    console.log('Page loaded');
});
