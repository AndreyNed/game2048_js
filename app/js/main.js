//== MAIN MODULE ==
var RequestAnimationFrame=
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback)
        { window.setTimeout(callback, 1000 / 60); }

var eventGameIsOver = new Event( 'gameisover', { bubbles: true, cancelable: false } );

var View        = new TView();
var ViewUI      = new TViewUI();
var Audition    = new TAudio();
var Model       = new TModel();
var Controller  = new TController();
var Router      = new TRouter();

View.Set( 'model', Model );
View.Init( document.getElementById('canvasContainer') );
View.DrawField();

ViewUI.Init();
ViewUI.Set( 'model', Model );

Audition.Set( 'model', Model );
Audition.Init();

Model.Set( 'view', View );
Model.Set( 'audio', Audition );
Model.Set( 'viewUI', ViewUI );

Controller.Set( 'model', Model );
Controller.Init();

Router.Set( 'model', Model );
Router.Init();


//===============================TEST===================
Model.NewCell();
Model.Get( 'audio' ).PlaySound( cSound.music );


//======================================================


RequestAnimationFrame( renderAll );

function renderAll () {
    Model.Update();
    RequestAnimationFrame( renderAll );
};

document.addEventListener('DOMContentLoaded', startSettings, false);

function startSettings( EO ) {
    EO = EO || window.event;
    window.location = 'index.html#';
};