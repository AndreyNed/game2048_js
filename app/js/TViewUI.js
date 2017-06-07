function TViewUI( pData, pModel ) {
var self = this;
    var D = pData || {};
    D.model = pModel || pData || null;
    D.pageContainer             = document.getElementById( 'pagesContainer' );
    D.fieldButtonContainer      = document.getElementById( 'fieldButtonsContainer' );
    D.buttonNewGame             = document.getElementById( 'buttonNewGame' );
    D.buttonBackToGame          = document.getElementById( 'buttonBackToGame' );
    D.buttonMusicOnOff          = document.getElementById( 'buttonMusicOnOff' );
    D.buttonSoundOnOff          = document.getElementById( 'buttonSoundOnOff' );
    D.resultsContainer          = document.getElementById( 'resultsContainer' );
    D.buttonCellCountContainer  = document.getElementById( 'buttonCellCountContainer' );
    D.cellCount                 = document.getElementById( 'cellCount' );
    D.inputUserName             = document.getElementById( 'inputUserName' );
    D.scoreValue                = document.getElementById( 'score' );

    self.Set = function( pKey, pValue ) {
        D[ pKey ] = pValue;
        return self;
    };

    self.Get = function( pKey ) {
        return D[ pKey ];
    };

    self.Init = function( pElementID ) {
        D.canvasContainer = document.getElementById( 'canvasContainer' );
        D.canvas = document.getElementById( 'extraCanvas' );
        D.context = D.canvas.getContext( '2d' );
        return self;
    };

    self.HideField = function() {
        D.context.fillStyle = fieldColor;
        D.context.strokeStyle = fieldColor;
        roundedRect( D.context, 0, 0, D.canvas.width, D.canvas.height, D.canvas.width * 0.05 );
        D.context.fill();
        D.context.fillStyle = cellColor.empty;
        D.context.strokeStyle = cellColor.empty;
        roundedRect( D.context, 15, 15, D.canvas.width - 30, D.canvas.height - 30, 20 );
        D.context.fill();
        consoleLog ? console.log('%c%s', 'color: green;', 'ViewUI.success: Hide field...') : '';
        return self;
    };

    self.HidePageElements = function() {
        hidePageElements();  
        return self;
    };

    self.ShowGameIsOver = function() {
        var score = ( D.model ) ? D.model.Get( 'score' ) : 0;
        self.HideField();
        hidePageElements();
        drawText( 'Игра окончена', 400, 220, 'bold 60px Arial, sans-serif', '#999999', 'center', 'top' );
        drawText( 'Ваш результат:', 400, 300, 'bold 60px Arial, sans-serif', '#999999', 'center', 'top' );
        drawText( score, 400, 400, 'bold 80px Arial, sans-serif', '#FF0000', 'center', 'top' );
        consoleLog ? console.log('%c%s', 'color: green;', 'ViewUI.success: The game is over. Your score is ', score) : '';
        D.pageContainer.style.display = 'block';
        D.fieldButtonContainer.style.display = 'block';
        D.buttonNewGame.style.display = 'block';
        return self;
    };

    self.ShowMenu = function() {
        var fCount = cellCount.x;
        self.HideField();
        hidePageElements();
        D.inputUserName.style.display               = 'block';
        D.inputUserName.value                       = D.model.Get( 'currentUser' );
        D.pageContainer.style.display               = 'block';
        D.fieldButtonContainer.style.display        = 'block';
        D.buttonNewGame.style.display               = 'block';
        D.buttonBackToGame.style.display            = 'block';
        D.buttonMusicOnOff.style.display            = 'block';
        D.buttonSoundOnOff.style.display            = 'block';
        D.buttonCellCountContainer.style.display    = 'block';
        D.cellCount.textContent                     = fCount;
        return self;
    };

    self.ShowResults = function() {
        self.HideField();
        hidePageElements();
        D.pageContainer.style.display = 'block';
        D.resultsContainer.style.display = 'block';
        var results = D.model.Get( 'results' );
        consoleLog ? console.log('%c%s', 'color: green;', 'ViewUI.success: Results: ', results) : '';
        for ( var i = 0; i < results.length; i++ ){
            document.querySelector('#resultsTable>tbody>tr:nth-of-type(' + ( i + 1 ) + ')>td:nth-of-type(2)').textContent = results[ i ].name;
            document.querySelector('#resultsTable>tbody>tr:nth-of-type(' + ( i + 1 ) + ')>td:nth-of-type(3)').textContent = results[ i ].result;
        };

        return self;
    };

    self.ShowResultsFieldPage = function( pResultIndex ) {
        D.context.fillStyle = fieldColor;
        D.context.strokeStyle = fieldColor;
        roundedRect( D.context, 0, 0, D.canvas.width, D.canvas.height, D.canvas.width * 0.05 );
        D.context.fill();
        hidePageElements();
        var fieldResult = D.model.Get( 'results' )[ pResultIndex ].field;
        var fieldCountY = fieldResult.length;
        var fieldCountX = fieldResult[ 0 ].length;
        for ( var j = 0; j < fieldCountY; j++ ) {
            for ( var i = 0; i < fieldCountX; i++ ) {
                drawCell( D.context, fieldResult[ j ][ i ], i, j, false );
            };
        };
        var scoreResult = D.model.Get( 'results' )[ pResultIndex ].result;
        D.scoreValue.textContent = scoreResult;
    };

    function drawText( pText, pX, pY, pFont, pColor, pAlign, pBaseline ) {
        D.context.font = pFont;
        D.context.fillStyle = pColor;
        D.context.textAlign = pAlign;
        D.context.textBaseline = pBaseline; 
        D.context.fillText( pText, pX, pY ); 
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

    function drawCell( pContext, pNumber, pX, pY, pIsCalculated ) {
        var radius   = D.canvas.width * 0.05;
        var spaceX   = D.canvas.width * 0.02;
        var spaceY   = D.canvas.height * 0.02;
        var sizeX    = Math.round( ( D.canvas.width - spaceX ) / cellCount.x - spaceX );
        var sizeY    = Math.round( ( D.canvas.height - spaceY ) / cellCount.y - spaceY );

        if ( pNumber > 0 ) {
            var posX = pIsCalculated ? pX : Math.round( spaceX + pX * ( sizeX + spaceX ) );
            var posY = pIsCalculated ? pY : Math.round( spaceY + pY * ( sizeY + spaceY ) );
            pContext.strokeStyle = cellColor[pNumber];
            pContext.fillStyle = cellColor[pNumber];
            roundedRect( pContext, posX, posY, sizeX, sizeY, radius * 0.5 );
            pContext.fill();
            pContext.fillStyle = '#fff';
            pContext.textAlign = 'center';
            pContext.textBaseline = 'middle';
            pContext.font = 'normal bold ' + Math.round(sizeY / 3.5) + 'px Arial, sans-serif';
            pContext.fillText(pNumber, posX + sizeX / 2, posY + sizeY / 2);
        };
    };

    function hidePageElements() {
        D.pageContainer.style.display               = 'none';
        D.fieldButtonContainer.style.display        = 'none';
        D.buttonNewGame.style.display               = 'none';
        D.buttonBackToGame.style.display            = 'none';
        D.buttonMusicOnOff.style.display            = 'none';
        D.buttonSoundOnOff.style.display            = 'none';
        D.resultsContainer.style.display            = 'none';
        D.buttonCellCountContainer.style.display    = 'none';
        D.inputUserName.style.display               = 'none';
    };

};