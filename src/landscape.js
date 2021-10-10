import $ from 'jquery';

window.onorientationchange = function () {
    var orientation = window.orientation;
    // Look at the value of window.orientation:
    if (orientation === 90) {
        // device is in Landscape mode. The screen is turned to the left.
        
        console.log('scroll?');
        $('body').animate({
            scrollTop: '0'
        }, 0);

    } else if (orientation === -90) {
        // device is in Landscape mode. The screen is turned to the right.
        $('body').animate({
            scrollTop: '0'
        }, 0);
    }
};

