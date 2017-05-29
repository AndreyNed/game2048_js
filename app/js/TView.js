function TView ( pData, pModel, pContainer ) {
    var self = this;
    var D = pData || {};
    D.model = pModel || null;
    D.container = pContainer || null;
    D.scoreView = null;
    D.bestResult = null;

    self.Set = function ( pKey, pValue ) {
        D[ pKey ] = pValue;
        return self;
    };

    self.Get = function ( pKey ) {
        return D[ pKey ];
    };

    self.Update = function() {
        
        D.fContext.clearRect( 0, 0, D.fCanvas.width, D.fCanvas.height );
        D.eContext.clearRect( 0, 0, D.eCanvas.width, D.eCanvas.height );
        if ( D.model ) {
            var cells = D.model.Get( 'field' );
            for ( var j = 0; j < cells.length; j++ ) {
                for ( i = 0; i < cells[ j ].length; i++ ) {
                    var cell = cells[ j ][ i ];
                    if ( cell.isScaling ) {//isRising or isMerging
                        drawScaledCell( D.eContext, cell.value, cell.x, cell.y, cell.scale );
                    } else {//isMoving or is staying
                        drawCell( D.fContext, cell.value, cell.x, cell.y, false );
                        if ( cell.needMerge ) {
                            drawCell( D.fContext, cell.value, cell.xMerge, cell.yMerge, false );
                        };
                    };
                };
            };
        } else {
            console.log( '%c%s', 'color: blue;', 'View.warning: model has not been assigned...' );
        };
        if ( D.model ) {
            D.scoreView.textContent = D.model.Get('score');
            D.bestResult.textContent = D.model.Get( 'bestResult' );
        };
        return self;
    };

    self.Init = function ( pContainer ) {
        pContainer = pContainer || D.container || null;
        if ( pContainer ) {
            //Find and define canvases
            D.container = pContainer;
            consoleLog ? console.log('%c%s', 'color: green;', 'View.success: Container for canvases is defined', D.container) : '';
            D.bCanvas = D.container.getElementsByTagName('canvas')[ 0 ];
            D.fCanvas = D.container.getElementsByTagName('canvas')[ 1 ];
            D.eCanvas = D.container.getElementsByTagName('canvas')[ 2 ];
           
            //Get context of canvases
            D.bContext = D.bCanvas.getContext( '2d' );
            D.fContext = D.fCanvas.getContext( '2d' );
            D.eContext = D.eCanvas.getContext( '2d' );
            //Define variables for calculations of positions and drawing
            D.radius   = D.bCanvas.width * 0.05;
            D.spaceX   = D.bCanvas.width * 0.02;
            D.spaceY   = D.bCanvas.height * 0.02;
            D.sizeX    = Math.round( ( D.bCanvas.width - D.spaceX ) / cellCount.x - D.spaceX );
            D.sizeY    = Math.round( ( D.bCanvas.height - D.spaceY ) / cellCount.y - D.spaceY );
        } else {
            console.log( '%c%s', 'color: red;', 'View.error: Container for canvases is not assigned...' );
        };
        D.scoreView = document.getElementById( 'score' );
        D.scoreView.textContent = ( D.model ) ? D.model.Get( 'score' ) : 0;
        D.bestResult = document.getElementById( 'bestResult' );
        D.bestResult.textContent = ( D.model ) ? D.model.Get( 'bestResult' ) : 0;
    };

    self.DrawField = function() {
        drawField( D.bContext, cellCount.x, cellCount.y, D.bCanvas.width, D.bCanvas.height );
        
        consoleLog ? console.log('%c%s', 'color: green;', 'View.success: The field has been drawn (' + cellCount.x + ' / ' + cellCount.y + ')') : '';
        
        return self;
    };

    self.DrawCell = function( pX, pY, pNumber, pIsCalculated ) {
        drawCell( D.fContext, pNumber, pX, pY, pIsCalculated );
        return self;
    };

    self.DrawScaledCell = function( pX, pY, pNumber, pScale ) {
        drawScaledCell( D.eContext, pNumber, pX, pY, pScale );
        return self;
    };

    function drawScaledCell ( pContext, pNumber, pX, pY, pScale ) {
        var posX = Math.round( D.spaceX + pX * ( D.sizeX + D.spaceX ) );
        var posY = Math.round( D.spaceY + pY * (D.sizeY + D.spaceY) );
        var i = pScale, NewX, NewY;
        NewX = pX * ( i + ( i - 1 ) / 4 * 1.1 );//Calculation of new coordinates according to scale / i value
        NewY = pY * ( i + ( i - 1 ) / 4 * 0.90 );//1.05 = additional correction for space between cells (+ 5%)
        pContext.save();
        pContext.clearRect( posX * ( 1 - i / 4 ), posY * ( 1 - i / 4 ), D.sizeX * ( 1 + i ), D.sizeY * ( 1 + i ) );
        pContext.scale( 1 / i, 1 / i );
        drawCell( pContext, pNumber, NewX, NewY );
        pContext.restore();
    };

    function drawCell( pContext, pNumber, pX, pY, pIsCalculated ) {
        if ( pNumber > 0 ) {
            var posX = pIsCalculated ? pX : Math.round( D.spaceX + pX * ( D.sizeX + D.spaceX ) );
            var posY = pIsCalculated ? pY : Math.round(D.spaceY + pY * (D.sizeY + D.spaceY) );
            pContext.strokeStyle = cellColor[pNumber];
            pContext.fillStyle = cellColor[pNumber];
            roundedRect( pContext, posX, posY, D.sizeX, D.sizeY, D.radius * 0.5 );
            pContext.fill();
            pContext.fillStyle = '#fff';
            pContext.textAlign = 'center';
            pContext.textBaseline = 'middle';
            pContext.font = 'normal bold ' + Math.round(D.sizeY / 3.5) + 'px Arial, sans-serif';
            pContext.fillText(pNumber, posX + D.sizeX / 2, posY + D.sizeY / 2);
        };
    };

    //draws game field
    function drawField( pContext, pCellsX, pCellsY, pFieldW, pFieldH ) {
        pContext.fillStyle      = fieldColor;
        pContext.strokeStyle    = fieldColor;
        roundedRect(pContext, 0, 0, pFieldW, pFieldH, D.radius);
        pContext.fill();
        pContext.strokeStyle    = cellColor.empty;
        pContext.fillStyle      = cellColor.empty;
        for (var j = 0; j < cellCount.y; j++) {
            var posY            = D.spaceY + j * (D.sizeY + D.spaceY);
            for (var i = 0; i < cellCount.x; i++) {
                var posX        = D.spaceX + i * (D.sizeX + D.spaceX);
                roundedRect(pContext, posX, posY, D.sizeX, D.sizeY, D.radius * 0.5);
                pContext.fill();
            };
        };
    };
    
    //draws roundedrect
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
};