var tCanvas = document.getElementById('extraCanvas');
var tContext = tCanvas.getContext('2d');

var fRadius             = tCanvas.width * 0.05;
var spaceX              = tCanvas.width * 0.02;
var spaceY              = tCanvas.height * 0.02;
var sizeX               = Math.round( (tCanvas.width - spaceX) / 4 - spaceX );
var sizeY               = Math.round( (tCanvas.height - spaceY) / 4 - spaceY );


function testScale() {
    var tCanvas = document.getElementById('extraCanvas');
    var tContext = tCanvas.getContext('2d');
    var Scale = 1 / 5;
    
    tContext.save();
    tContext.scale(Scale, Scale);

    for (var j = 0; j < cellCount.y; j++) {
        for (var i = 0; i < cellCount.x; i++) {

            var NewX = i * ( 1 / Scale ) + 1 / Scale / 2 - 0.5 + 0.02; // + 1 / Scale - 0.5;
            var NewY = j * ( 1 / Scale ) + 1 / Scale / 2 - 0.5 + 0.02;

            drawCell(tContext, 8, NewX, NewY);
        };
    };
    tContext.restore;
};

function roundedRect( pContext, pX, pY, pWidth, pHeight, pRadius ) {
    pContext.beginPath();
    pContext.moveTo( pX, pY + pRadius );
    pContext.lineTo( pX, pY + pHeight - pRadius );
    pContext.quadraticCurveTo( pX, pY + pHeight, pX + pRadius, pY + pHeight );
    pContext.lineTo( pX + pWidth - pRadius, pY + pHeight );
    pContext.quadraticCurveTo( pX + pWidth, pY + pHeight, pX + pWidth, pY + pHeight - pRadius );
    pContext.lineTo( pX + pWidth, pY + pRadius );
    pContext.quadraticCurveTo( pX + pWidth, pY, pX + pWidth - pRadius, pY );
    pContext.lineTo( pX + pRadius, pY );
    pContext.quadraticCurveTo( pX, pY, pX, pY + pRadius );
    pContext.stroke();
};

function drawCell( pContext, pNumber, pX, pY ) {
    if ( pNumber > 0 ) {
        var posX            = Math.round( spaceX + pX * ( sizeX + spaceX ) );
        var posY            = Math.round(spaceY + pY * (sizeY + spaceY) );
        pContext.strokeStyle = cellColor[pNumber];
        pContext.fillStyle = cellColor[pNumber];
        roundedRect( pContext, posX, posY, sizeX, sizeY, fRadius * 0.5 );
        pContext.fill();
        pContext.fillStyle = '#fff';
        pContext.textAlign = 'center';
        pContext.textBaseline = 'middle';
        pContext.font = 'normal bold ' + Math.round(sizeY / 3.5) + 'px Arial, sans-serif';
        pContext.fillText(pNumber, posX + sizeX / 2, posY + sizeY / 2);
    };
};

//testScale();