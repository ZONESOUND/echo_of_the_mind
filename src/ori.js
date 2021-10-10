var config = {
    apiKey: "AIzaSyDYwS8sV2bVq0hcXxw3gNHHmwF6go2pGF4",
    authDomain: "speak-something.firebaseapp.com",
    databaseURL: "https://speak-something.firebaseio.com",
    projectId: "speak-something",
    storageBucket: "speak-something.appspot.com",
    messagingSenderId: "508186378893"
};

firebase.initializeApp(config);

var lastTime = new Date();
var json;
var playing = false;
var autoplay = false;
var autoplayNum = 5;
var intTime = 60;
var latest;

const database = firebase.database();
const collection = database.ref('textcollection');

$('.speak').on('click',speak)

var SW9 = new SiriWave({
    style: "ios9",
    container: document.getElementById("container-9"),
    autostart: true
});

SW9.setAmplitude(1)

collection.on('value', function (snapshot) {
    window.speechSynthesis.cancel();
    console.log(latest)
    playing = true;
    json = snapshot.val();

    if (typeof latest === "undefined") {
        SW9.setAmplitude(1)
    } else {
        SW9.setAmplitude(10)
    }

    var last = json[Object.keys(json).pop()]
    // SW9.setAmplitude(10)
    
    speakout(last['text']);
    latest = last

    playing = false;
})

setInterval(function () {
    checkTime();
}, intTime);


function toggleAutoPlay() {

    autoplay = !autoplay;
    console.log(autoplay);
}

function setplayNumber(num) {
    autoplayNum = num;
    console.log("set num: ", num);
}

function setAutoPlayInterval(time) {
    intTime = time;
    console.log("set interval ", intTime);
}

function checkTime() {
    if (!autoplay) return;
    var newTime = new Date();
    if ((newTime - lastTime) / 1000 > intTime) {
        console.log("gogo!");
        var ind = 0;
        var len = Object.keys(json).length;
        console.log("len ", len);
        var index = [];

        // build the index
        for (var x in json) {
            index.push(x);
        }
        shuffle(index);

        for (var i = 0; i < autoplayNum && !playing; i++) {

            console.log(playing, json[index[i]]);
            speakout(json[index[i]]['text']);

        }
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


function speakout(input) {
    var msg = new SpeechSynthesisUtterance(input)
    msg.lang = "zh-TW"
    window.speechSynthesis.speak(msg)
    
    lastTime = new Date();
    msg.onend = function (event) {
        SW9.setAmplitude(1)
        console.log('Utterance has finished being spoken after ' + event.elapsedTime + ' milliseconds.');
    }
}

function speak() {
    console.log('test')
    var input = $("#input").val()
    var newChildRef = collection.push(input);
    console.log(new Date().toString())
    console.log(input)
    newChildRef.set({ 'text': input, 'date': new Date().toString() });
}

//Declare three.js variables
var camera, scene, renderer, stars = [];

//assign three.js objects to each variable
function init() {

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 0;

    //scene
    scene = new THREE.Scene();

    //renderer
    renderer = new THREE.WebGLRenderer();
    //set the size of the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);

    //add the renderer to the html document body
    $('.bg').append(renderer.domElement).addClass('three');
    

}


function addSphere() {

    // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
    for (var z = -1000; z < 1000; z += 10) {

        // Make a sphere (exactly the same as before). 
        var geometry = new THREE.SphereGeometry(0.5, 32, 32)
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var sphere = new THREE.Mesh(geometry, material)

        // This time we give the sphere random x and y positions between -500 and 500
        sphere.position.x = Math.random() * 1000 - 500;
        sphere.position.y = Math.random() * 1000 - 500;

        // Then set the z position to where it is in the loop (distance of camera)
        sphere.position.z = z;

        // scale it up a bit
        sphere.scale.x = sphere.scale.y = 2;

        //add the sphere to the scene
        scene.add(sphere);

        //finally push it to the stars array 
        stars.push(sphere);
    }
}

function animateStars() {

    // loop through each star
    for (var i = 0; i < stars.length; i++) {

        star = stars[i];

        // and move it forward dependent on the mouseY position. 
        star.position.z += i / 10;

        // if the particle is too close move it to the back
        if (star.position.z > 1000) star.position.z -= 2000;

    }

}

function render() {
    //get the frame
    requestAnimationFrame(render);

    //render the scene
    renderer.render(scene, camera);
    animateStars();

}

init();
addSphere();
render();