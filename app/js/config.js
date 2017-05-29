
//== DEVELOPER MODE == SHOWS ALL CONSOLE LOGS == ON || OFF
var consoleLog = false;

//== FIELD CONFIGURATION == COUNT OF HORIZONTAL AND VERTICAL CELLS ON
var cellCount = {
    x:      4,
    y:      4,
    max:    12,
    min:    4
};

//== HASH FOR MODEL DATA
var dModel = {};

//== COLORS OF CELLS
var cellColor = {
    2:      '#FFCC33',
    4:      '#CCCC33',
    8:      '#669933',
    16:     '#FF6600',
    32:     '#FF6666',
    64:     '#00CCFF',
    128:    '#9933CC',
    256:    '#666699',
    512:    '#FF0000',
    1024:   '#FFCC33',
    2048:   '#9900CC',
    4096:   '#FF0099',
    9128:   '#0000FF',
    empty:  '#D3D3D3'
};

var fieldColor = '#EEE9E9';
var newGameButtonColor = '#00BFFF';

//== ANIMATION SPEED
var speedMultiplier = 0.675 * Math.max( cellCount.x, cellCount.y );
var scaleMultiplier = 1.25 * Math.max( cellCount.x, cellCount.y );

//== CONSTANT OF DIRECTION
var cDirection = {
    left:       { x:  1,     y:  0 },
    up:         { x:  0,     y:  1 },
    right:      { x: -1,     y:  0 },
    down:       { x:  0,     y: -1 }
};


//== SOUND CONFIG ==

var soundOn = true;
var musicOn = true;

var soundsSrc = {
    swipe:       {
        mp3:    'sounds/mp3/swipe.mp3',
        ogg:    'sounds/ogg/swipe.ogg'
    },
    merge:      {
        mp3:    'sounds/mp3/merge.mp3',
        ogg:    'sounds/mp3/merge.ogg'
    },
    heart:      {
        mp3:    'sounds/mp3/heart.mp3',
        ogg:    'sounds/mp3/heart.ogg'
    },
    click:      {
        mp3:    'sounds/mp3/click.mp3',
        ogg:    'sounds/mp3/click.ogg'
    },
    music:      {
        mp3:    'sounds/mp3/music.mp3',
        ogg:    'sounds/mp3/music.ogg'
    }
};

var cSound = {
    click:  'click',
    merge:  'merge',
    swipe:  'swipe',
    heart:  'heart',
    music:  'music'
};

//== ROUTER`s constants ==
var cRouter = {
    menu:       '#menu',
    results:    '#results',
    gameisover: '#gameisover',
    newgame:    '#newgame'
};


var testData = [
    { name: 'Василий', result: 2000},
    { name: 'Чингачгук', result: 3500},
    { name: 'Федор Михайлович', result: 12000},
    { name: 'Василий', result: 22000},
    { name: 'Василий', result: 2300},
    { name: 'Василий', result: 1800},
    { name: 'Василий', result: 1000},
    { name: 'Василий', result: 530},
    { name: 'Василий', result: 8000},
    { name: 'Василий', result: 13200}
];