import $ from 'jquery';
import './style.css';
import './landscape';
import viewStep from '@zonesoundcreative/view-step';
import {questions} from './question';
import {collectionRef} from './firebase';
import {autoplay, intervalTime, autoplayNum} from './const';

var viewstep = new viewStep('.step', 1, 2, {
    2: initquestion,
}, 500);

var questionId = -1;
var lastTime = new Date();
var json;
var playing = false;
var first = false;
var latest;

const synth = window.speechSynthesis;
const voiceList = synth.getVoices();
const twvoice = voiceList.find((voice) => voice.lang === 'zh-TW');


//TODO: start button press
$(()=>{
    $("#start").on('click', ()=> {
        viewstep.showNext();
        $('#answer').attr('disabled', true);
        speakout('');
    });

    $("#answer").on("click", () => {
        $("#input").prop('disabled', true);
        $('#answer').attr('disabled', true);
        $("#answer").css('visibility', 'hidden');
        speak();
        changeVisibilitys(["#replay", "#intro"], ["#answer"]);
        //$("#intro").css('display', 'inline');
        //$(selhide).css('display', 'none');
    });

    $("#replay").on("click", ()=>{
        replay();
    });

    $("#intro").on("click", ()=>{
        viewstep.showNext();
    });

    $("#previmg").on("click", ()=>{
        replay();
        viewstep.showPrev();
    });

    $('#input').on('keyup', function(){
        if($(this).val().length !=0)
            $('#answer').attr('disabled', false);            
        else
            $('#answer').attr('disabled', true);
    })
});

function replay() {
    initquestion();
    $("#input").val("");
    setTimeout(() => {
        changeVisibilitys(["#answer"], ["#replay","#intro"]);
        //changeVisibility("#answer", "#replay");
        //$("#intro").css('display', 'none');
    }, 0);
    $("#input").prop('disabled', false);
}

function initquestion() {
    let randomId = questionId;
    while (questionId == randomId) {
        randomId = Math.floor(Math.random() * questions.length);
    }
    questionId = randomId;
    $('#question').fadeOut(500, function() {
        $(this).text(questions[questionId]).fadeIn(500);
    });
}

function speak() {
    var input = $("#input").val();

    var newChildRef = collectionRef.push(input);
    newChildRef.set({ 'text': input, 'date': new Date().toString() , 'question': questionId});
}

function speakout(input) {
    synth.cancel();
    playing = true;
    var msg = new SpeechSynthesisUtterance(input);
    msg.lang = "zh-TW";
    msg.text = input;
    msg.rate = 0.6;
    msg.pitch = 0.3;    
    msg.voice = twvoice;
    //window.speechSynthesis.speak(msg);
    synth.speak(msg);
    msg.onend = function(event) {
        playing = false;
    }
    lastTime = new Date();
}

setInterval(function () {
    checkTime();
}, intervalTime*1000);


function toggleAutoPlay() {
    autoplay = !autoplay;
    console.log(autoplay);
}

function setplayNumber(num) {
    autoplayNum = num;
    console.log("set num: ", num);
}

function setAutoPlayInterval(time) {
    intervalTime = time;
    console.log("set interval ", intervalTime);
    
}

function checkTime() {
    if (!autoplay) return;
    var newTime = new Date();
    if ((newTime - lastTime) / 1000 > intervalTime) {
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

collectionRef.on('value', function (snapshot) {
    
    
    json = snapshot.val();
    
    var last = json[Object.keys(json).pop()]
    //alert(last['text']);
    if (last['text'] == undefined) return;
    if (first) speakout(last['text']);
    latest = last;
    first = true;
})

function changeVisibility(selshow, selhide) {
    $(selshow).css('visibility', 'hidden');
    $(selshow).css('display', 'inline');
    $(selhide).css('display', 'none');
    $(selshow).css('visibility', 'visible');
}

function changeVisibilitys(selshow, selhide) {
    for (let i=0; i<selshow.length; i++) {
        $(selshow[i]).css('visibility', 'hidden');
        $(selshow[i]).css('display', 'inline');
    }
    for (let i=0; i<selhide.length; i++) {
        $(selhide[i]).css('display', 'none');
    }
    for (let i=0; i<selshow.length; i++) {
        $(selshow[i]).css('display', 'none');
        $(selshow[i]).css('visibility', 'visible');
        $(selshow[i]).css('display', 'inline');
    }
}