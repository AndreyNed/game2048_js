function TModel ( pData, pView ) {
    var self                    = this;
    var D                       = pData || {};
    D.view                      = D.view || null;
    D.field                     = D.field || buildField( cellCount.x, cellCount.y );
    //creates initial D.field;
    consoleLog ? console.log('%c%s', 'color: green;', 'Model.success: Field is initialized...', D.field) : '';
    //D.merge                     = [];//for cells with needMerge = true
    D.readyToNew                = false;//indicates if model is ready for new cell
    D.busy                      = false;//isMoving + isScaling
    D.needNew                   = true;
    D.score                     = 0;
    D.audio                     = D.audio || null;
    D.musicCurrentTime          = 0;
    D.gameIsGoOn                = true;
    D.results                   = [];
    D.ajaxHandlerScript         = "http://fe.it-academy.by/AjaxStringStorage2.php";
    D.stringName                = "Nedaseikin_2048";
    D.updatePassword            = 0;
    D.bestResult                = 0;
    D.currentUser               = 'User';
    D.currentUserBeforeChanges  = 'User';

    //storeInfo();
    restoreInfo();

    //===================================================
        /*D.cells[ x ] = 
            {
                value:      2,
                x:          0,
                y:          0,
                isMoving:   false,
                speedX:     0,
                speedY:     0,
                xEnd:       0,
                yEnd:       0,
                needMerge:  false,
                isMerging:  false,
                xMerge:     0,
                yMerge:     0,
                isScaling:  false,
                scale:      1,
                speedScale: 0,
                isRising:   false 
            }*/
    //===================================================

    self.Set = function ( pKey, pValue ) {
        D[ pKey ] = pValue;
        return self;
    };

    self.Get = function ( pKey ) {
        return D[ pKey ];
    };

    self.Update = function() {
        //updates model`s status and calls D.view.Update()
        //is called in renderAll() in main.js
        if ( D.gameIsGoOn ) {
            D.busy = false;
            for ( var j = 0; j < cellCount.y; j++ ) {
                for ( var i = 0; i < cellCount.x; i++ ) {
                    if ( D.field[ j ][ i ].isScaling ) {//isRising || isMerging
                        newScale = D.field[ j ][ i ].scale + D.field[ j ][ i ].speedScale;
                        D.busy = true;
                        //consoleLog ? console.log('%c%s', 'color: blue;', 'Model.warning: D.field[ ' + j + ' ][ ' + i + ' ] = ' + newScale) : '';
                        if ( D.field[ j ][ i ].isRising && newScale <=1 ) {
                            stopScaling( i, j );
                        } else if ( D.field[ j ][ i ].isMerging &&
                                    Math.abs(D.field[ j ][ i ].speedScale) / D.field[ j ][ i ].speedScale < 0 &&
                                    newScale <= 0.8 ) {
                            D.field[ j ][ i ].speedScale *= -1;
                        } else if ( D.field[ j ][ i ].isMerging &&
                                    Math.abs(D.field[ j ][ i ].speedScale) / D.field[ j ][ i ].speedScale > 0 &&
                                    newScale >= 1 ) {
                            stopScaling( i, j );
                        } else {
                            D.field[ j ][ i ].scale = newScale;
                        };
                    } else if ( D.field[ j ][ i ].isMoving ) {
                        newX = D.field[ j ][ i ].x + D.field[ j ][ i ].speedX;
                        newY = D.field[ j ][ i ].y + D.field[ j ][ i ].speedY;
                        D.busy = true;
                        if ( D.field[ j ][ i ].speedX > 0 && newX >= D.field[ j ][ i ].xEnd ) {
                            stopMoving( i, j );
                            checkAndStartMerge( i, j );
                        } else if ( D.field[ j ][ i ].speedX < 0 && newX <= D.field[ j ][ i ].xEnd ) {
                            stopMoving( i, j );
                            checkAndStartMerge( i, j );
                        } else if ( D.field[ j ][ i ].speedY > 0 && newY >= D.field[ j ][ i ].yEnd ) {
                            stopMoving( i, j );
                            checkAndStartMerge( i, j );
                        } else if ( D.field[ j ][ i ].speedY < 0 && newY <= D.field[ j ][ i ].yEnd ) {
                            stopMoving( i, j );
                            checkAndStartMerge( i, j );
                        } else {
                            D.field[ j ][ i ].x = newX;
                            D.field[ j ][ i ].y = newY;
                        };
                    } else if ( !D.field[ j ][ i ].isMoving && !D.field[ j ][ i ].isScaling && D.field[ j ][ i ].needMerge ) {
                        checkAndStartMerge( i, j );
                        D.busy = true; 
                    } else { 
                        //Actions if there are not any animations
                    };
                };
            };
            if ( D.needNew && !D.busy ) {
                D.needNew = false;
                var newCellCount = cellCount.x * cellCount.y;
                newCellCount = ( newCellCount % 16 > 0 ) ? Math.floor( newCellCount / 16 ) + 1 : newCellCount / 16;
                for ( var k = 1; k <= newCellCount; k++ ){
                    self.NewCell();
                };
            };
            if ( D.view ) {
                D.view.Update();
            };
        };
        return self;
    };

    self.SoundInit = function() {
        if ( D.audio ) {
            D.audio.Init();
        };
        return self;
    };

    self.LetsMove = function( pDirection ) {
        consoleLog ? console.log('%c%s', 'color: blue;', 'Model.warning: Lets move...', pDirection) : '';

        switch ( pDirection ) {
            case cDirection.left:
                moveLeft( );
            break;

            case cDirection.right:
                moveRight( );
            break;

            case cDirection.up:
                moveUp( );
            break;

            case cDirection.down:
                moveDown( );
            break;

            default:
                consoleLog ? console.log('%c%s', 'color: red;', 'Model.error: Lets move: Wrong direction` parameter: ', pDirection) : '';
        };
        return self;
    };

    self.NewCell = function() {//checks if empty cell exists calculates random value, x, y and switches on rising animation of new cell
        consoleLog ? console.log('%c%s', 'color: green;', 'Model.success: D.field: ', D.field) : '';
        var Value = ( randomNumber( 2, 40 ) % 4 == 0 ? 4 : 2 );
        var EmptyCells = [];
        EmptyCells = arrayOfEmptyCells();//[ { x:.., y:.. }, .. ]
        if (EmptyCells.length > 0) {
            var newXY = EmptyCells[ randomNumber( 0, EmptyCells.length - 1 ) ];//{ x:.., y.. }
            D.field[ newXY.y ][ newXY.x ].value         = Value; 
            D.field[ newXY.y ][ newXY.x ].isMoving      = false;
            D.field[ newXY.y ][ newXY.x ].speedX        = 0;
            D.field[ newXY.y ][ newXY.x ].speedY        = 0;
            D.field[ newXY.y ][ newXY.x ].needMerge     = false;
            D.field[ newXY.y ][ newXY.x ].isMerging     = false;
            D.field[ newXY.y ][ newXY.x ].isScaling     = true;
            D.field[ newXY.y ][ newXY.x ].scale         = 8;
            D.field[ newXY.y ][ newXY.x ].speedScale    = -0.1 * scaleMultiplier;
            D.field[ newXY.y ][ newXY.x ].isRising      = true;
            D.needNew = false;
            if ( D.audio && EmptyCells.length < 3 && soundOn && musicOn ) {
                D.audio.PlaySound( cSound.heart );
                D.audio.Get( 'audio' ).heart.volume = 1;
                //D.musicCurrentTime = D.audio.Get( 'audio' ).music.currentTime;
                D.audio.Get( 'audio' ).music.volume = 0.5;
            } else if ( D.audio && soundOn && musicOn ) {
                D.audio.Get( 'audio' ).music.volume = 1;
                D.audio.Get( 'audio' ).heart.volume = 0.5;
            };
            consoleLog ? console.log('%c%s', 'color: green;', 'Model.success: empty cells: ', EmptyCells, EmptyCells.length) : '';
            //check if the game is over
            if ( EmptyCells.length < 2 && checkIfTheGameIsOver() && !D.busy ) {
                gameIsOver();
            };
        } else {
            //The game is over
            gameIsOver();
        };
        return self;
    };

    self.ChangeLocation = function( pHash ) {
        var newHash = null;
        if ( D.audio ) {
            D.audio.PlaySound( cSound.click );
        };

        if ( pHash.indexOf( cRouter.resultsfield ) > -1 && pHash.length > cRouter.resultsfield.length ) {
            newHash = pHash.substr( 0, cRouter.resultsfield.length );
            var rowIndex = parseInt( pHash.substr( cRouter.resultsfield.length ) );
        } else {
            newHash = pHash;
        };
                
        //console.log( pHash, ' : ', newHash, ' : ', rowIndex );
        switch ( newHash ) {
            case cRouter.menu:
                showMenuPage();
            break;
            case cRouter.results:
                showResultsPage();
            break;
            case cRouter.gameisover:
                showGameIsOverPage();
            break;
            case cRouter.newgame:
                startNewGame();
            break;
            case cRouter.resultsfield:
                showResultsFieldPage( rowIndex );
            break;
            default:
                showGamePage();
                D.gameIsGoOn = true;
        };


    };

    //=== Local functions ===

    function moveLeft () {
        //analyses of moving left
        var result = false;//true == will be moving || merging
        var fTargetNumber, fNumber;
        for ( j = 0; j < cellCount.y; j++ ) {
            for ( i = 0; i < cellCount.x - 1; i++ ) {
                fTargetNumber = D.field[ j ][ i ].value;
                var h = i + 1;
                while ( h < cellCount.x ) {
                    fNumber = D.field[ j ][ h ].value;
                    if ( fNumber > 0 && fTargetNumber > 0 && fNumber == fTargetNumber ) {
                        result = true;
                        D.needNew = true;
                        //moving and prepare for merge                        
                        if ( h > i + 1 ) {
                            //=== for animation ===
                            /*D.field[ j ][ i ].isMoving = true;
                            D.field[ j ][ i ].x = h;
                            D.field[ j ][ i ].y = i;
                            D.field[ j ][ i ].xEnd = i + 1;
                            D.field[ j ][ i ].yEnd = j;
                            D.field[ j ][ i ].speedX = -0.1 * speedMultiplier;
                            D.field[ j ][ i ].speedY = 0;*/
                        };
                        //=== for analyses ===
                        D.field[ j ][ i ].needMerge = true;
                        D.field[ j ][ i ].xMerge = i;
                        D.field[ j ][ i ].yMerge = j;
                        D.field[ j ][ h ] = initCell( D.field, h, j );
                        h = cellCount.x;
                        if ( !D.field[ j ][ i ].needMerge ) {
                            i--;
                        };
                    } else if ( fNumber > 0 && fTargetNumber > 0 && fNumber != fTargetNumber ) {
                        if ( h > i + 1 ) {
                            D.needNew = true;
                            result = true;
                            //=== for animation ===
                            D.field[ j ][ h ].isMoving = true;
                            D.field[ j ][ h ].xEnd = i + 1;
                            D.field[ j ][ h ].yEnd = j;
                            D.field[ j ][ h ].speedX = -0.1 * speedMultiplier;
                            D.field[ j ][ h ].speedY = 0;
                            //=== for analyses ===
                            moveValues( h, j, i + 1, j );
                            D.field[ j ][ h ] = initCell( D.field, h, j );
                        };
                        h = cellCount.x;
                        //i--;
                    } else if ( fNumber > 0 && fTargetNumber == 0 ) {
                        D.needNew = true;
                        result = true;
                        //=== for animation === 
                        D.field[ j ][ h ].isMoving = true;
                        D.field[ j ][ h ].xEnd = i;
                        D.field[ j ][ h ].yEnd = j;
                        D.field[ j ][ h ].speedX = -0.1 * speedMultiplier;
                        D.field[ j ][ h ].speedY = 0;
                        //=== for analyses ===
                        moveValues( h, j, i, j );
                        D.field[ j ][ h ] = initCell( D.field, h, j );
                        h = cellCount.x;
                        i--;
                    } else {
                        h++;
                    };
                };
            };
        };
        if ( result && D.audio ) {
            D.audio.PlaySound( cSound.swipe );
        };
        return result;
    };

    function moveRight () {
        //analyses of moving right
        var result = false;//true == will be moving || merging
        var fTargetNumber, fNumber;
        for ( j = 0; j < cellCount.y; j++ ) {
            for ( i = cellCount.x - 1; i > 0; i-- ) {
                fTargetNumber = D.field[ j ][ i ].value;
                var h = i - 1;
                while ( h >= 0 ) {
                    fNumber = D.field[ j ][ h ].value;
                    if ( fNumber > 0 && fTargetNumber > 0 && fNumber == fTargetNumber ) {
                        D.needNew = true;
                        result = true;
                        //moving and prepare for merge
                        if ( h < i - 1 ) {
                            //=== for animation ===
                            /*D.field[ j ][ i ].isMoving = true;
                            D.field[ j ][ i ].x = h;
                            D.field[ j ][ i ].y = j;
                            D.field[ j ][ i ].xEnd = i - 1;
                            D.field[ j ][ i ].yEnd = j;
                            D.field[ j ][ i ].speedX = 0.1 * speedMultiplier;
                            D.field[ j ][ i ].speedY = 0;*/
                        };
                        //=== for analyses ===
                        D.field[ j ][ i ].needMerge = true;
                        D.field[ j ][ i ].xMerge = i;
                        D.field[ j ][ i ].yMerge = j;
                        D.field[ j ][ h ] = initCell( D.field, h, j );
                        h = -1;
                        if ( !D.field[ j ][ i ].needMerge ) {
                            i++;
                        };
                    } else if ( fNumber > 0 && fTargetNumber > 0 && fNumber != fTargetNumber ) {
                        if ( h < i - 1 ) {
                            D.needNew = true;
                            result = true;
                            //=== for animation ===
                            D.field[ j ][ h ].isMoving = true;
                            D.field[ j ][ h ].xEnd = i - 1;
                            D.field[ j ][ h ].yEnd = j;
                            D.field[ j ][ h ].speedX = 0.1 * speedMultiplier;
                            D.field[ j ][ h ].speedY = 0;
                            //=== for analyses ===
                            moveValues( h, j, i - 1, j );
                            D.field[ j ][ h ] = initCell( D.field, h, j );
                        };
                        h = -1;
                        //i++;
                    } else if ( fNumber > 0 && fTargetNumber == 0 ) {
                        D.needNew = true;
                        result = true;
                        //=== for animation === 
                        D.field[ j ][ h ].isMoving = true;
                        D.field[ j ][ h ].xEnd = i;
                        D.field[ j ][ h ].yEnd = j;
                        D.field[ j ][ h ].speedX = 0.1 * speedMultiplier;
                        D.field[ j ][ h ].speedY = 0;
                        //=== for analyses ===
                        moveValues( h, j, i, j );
                        D.field[ j ][ h ] = initCell( D.field, h, j );
                        h = -1;
                        i++;
                    } else {
                        h--;
                    };
                };
            };
        };
        if ( result && D.audio ) {
            D.audio.PlaySound( cSound.swipe );
        };
        return result;
    };

    function moveUp () {
        //analyses of moving up
        var result = false;//true == will be moving || merging
        var fTargetNumber, fNumber;
        for ( var i = 0; i < cellCount.x; i++ ) {
            for ( var j = 0; j < cellCount.y - 1; j++ ) {
                fTargetNumber = D.field[ j ][ i ].value;
                var h = j + 1;
                while ( h < cellCount.y ) {
                    fNumber = D.field[ h ][ i ].value;
                    if ( fNumber > 0 && fTargetNumber > 0 && fNumber == fTargetNumber) {
                        D.needNew = true;
                        result = true;
                        //move and merge
                        if ( h > j + 1 ) {
                            //move
                            /*D.field[ j ][ i ].isMoving  = true;
                            D.field[ j ][ i ].y         = h;
                            D.field[ j ][ i ].x         = i;
                            D.field[ j ][ i ].yEnd      = j + 1;
                            D.field[ j ][ i ].xEnd      = i;
                            D.field[ j ][ i ].speedY    = -0.1 * speedMultiplier;
                            D.field[ j ][ i ].speedX    = 0;*/
                        };
                        //merge
                        D.field[ j ][ i ].needMerge     = true;
                        D.field[ j ][ i ].yMerge        = j;
                        D.field[ j ][ i ].xMerge        = i;
                        D.field[ h ][ i ] = initCell( D.field, i, h );
                        h = cellCount.y;
                        if ( !D.field[ j ][ i ].needMerge ) {
                            j--;
                        };
                    } else if ( fNumber > 0 && fTargetNumber > 0 && fNumber != fTargetNumber ) {
                        //move near
                        if ( h > j + 1 ) {
                            D.needNew = true;
                            result = true;
                            //move == for animation
                            D.field[ h ][ i ].isMoving  = true;
                            D.field[ h ][ i ].yEnd      = j + 1;
                            D.field[ h ][ i ].xEnd      = i;
                            D.field[ h ][ i ].speedY    = -0.1 * speedMultiplier;
                            D.field[ h ][ i ].speedX    = 0;
                            //move == for logic
                            moveValues( i, h, i, j + 1 );
                            D.field[ h ][ i ] = initCell( D.field, i, h );
                        };
                        h = cellCount.y;
                    } else if ( fNumber > 0 && fTargetNumber == 0 ) {
                        D.needNew = true;
                        result = true;
                        //move == for animation ==
                        D.field[ h ][ i ].isMoving = true;
                        D.field[ h ][ i ].yEnd = j;
                        D.field[ h ][ i ].xEnd = i;
                        D.field[ h ][ i ].speedY = -0.1 * speedMultiplier;
                        D.field[ h ][ i ].speedX = 0;
                        //== for logic ==
                        moveValues( i, h, i, j );
                        D.field[ h ][ i ] = initCell( D.field, i, h );
                        h = cellCount.y;
                        j--;
                    } else {
                        h++;
                    }
                };
            };
        };
        if ( result && D.audio ) {
            D.audio.PlaySound( cSound.swipe );
        };
        return result;
    };

    function moveDown () {
        //analyses of moving down
        var result = false;//true == will be moving || merging
        var fTargetNumber, fNumber;
        for ( var i = 0; i < cellCount.x; i++ ) {
            for ( var j = cellCount.y - 1; j > 0; j-- ) {
                fTargetNumber = D.field[ j ][ i ].value;
                var h = j - 1;
                while ( h > -1 ) {
                    fNumber = D.field[ h ][ i ].value;
                    if ( fNumber > 0 && fTargetNumber > 0 && fNumber == fTargetNumber) {
                        D.needNew = true;
                        result = true;
                        //move and merge
                        if ( h < j - 1 ) {
                            //move
                            /*D.field[ j ][ i ].isMoving  = true;
                            D.field[ j ][ i ].y         = h;
                            D.field[ j ][ i ].x         = i;
                            D.field[ j ][ i ].yEnd      = j - 1;
                            D.field[ j ][ i ].xEnd      = i;
                            D.field[ j ][ i ].speedY    = 0.1 * speedMultiplier;
                            D.field[ j ][ i ].speedX    = 0;*/
                        };
                        //merge
                        D.field[ j ][ i ].needMerge     = true;
                        D.field[ j ][ i ].yMerge        = j;
                        D.field[ j ][ i ].xMerge        = i;
                        D.field[ h ][ i ] = initCell( D.field, i, h );
                        h = -1;
                        if ( !D.field[ j ][ i ].needMerge ) {
                            i++;
                        };
                    } else if ( fNumber > 0 && fTargetNumber > 0 && fNumber != fTargetNumber ) {
                        //move near
                        if ( h < j - 1 ) {
                            D.needNew = true;
                            result = true;
                            //move == for animation
                            D.field[ h ][ i ].isMoving  = true;
                            D.field[ h ][ i ].yEnd      = j - 1;
                            D.field[ h ][ i ].xEnd      = i;
                            D.field[ h ][ i ].speedY    = 0.1 * speedMultiplier;
                            D.field[ h ][ i ].speedX    = 0;
                            //move == for logic
                            moveValues( i, h, i, j - 1 );
                            D.field[ h ][ i ] = initCell( D.field, i, h );
                        };
                        h = -1;
                    } else if ( fNumber > 0 && fTargetNumber == 0 ) {
                        D.needNew = true;
                        result = true;
                        //move == for animation ==
                        D.field[ h ][ i ].isMoving = true;
                        D.field[ h ][ i ].yEnd = j;
                        D.field[ h ][ i ].xEnd = i;
                        D.field[ h ][ i ].speedY = 0.1 * speedMultiplier;
                        D.field[ h ][ i ].speedX = 0;
                        //== for logic ==
                        moveValues( i, h, i, j );
                        D.field[ h ][ i ] = initCell( D.field, i, h );
                        h = -1;
                        j++;
                    } else {
                        h--;
                    }
                };
            };
        };
        if ( result && D.audio ) {
            D.audio.PlaySound( cSound.swipe );
        };
        return result;
    };

    function stopMoving( pXindex, pYindex ) {//stops moving`s animation
        D.field[ pYindex ][ pXindex ].speedX    = 0;
        D.field[ pYindex ][ pXindex ].speedY    = 0;
        D.field[ pYindex ][ pXindex ].isMoving  = false;
        D.field[ pYindex ][ pXindex ].x = D.field[ pYindex ][ pXindex ].xEnd;
        D.field[ pYindex ][ pXindex ].y = D.field[ pYindex ][ pXindex ].yEnd;
    };

    function stopScaling( pXindex, pYindex ) {//stops scaling`s animation
        D.field[ pYindex ][ pXindex ].isScaling     = false;
        D.field[ pYindex ][ pXindex ].isRising      = false;
        D.field[ pYindex ][ pXindex ].isMerging     = false;
        D.field[ pYindex ][ pXindex ].scale         = 1;
        D.field[ pYindex ][ pXindex ].speedScale    = 0;
    };

    function randomNumber( pMin, pMax ) {
        return Math.floor( Math.random() * ( pMax - pMin + 1 ) ) + pMin;
    };

    function checkAndStartMerge( pStartX, pStartY ) {
        //checks if needMerge and does one
        //( D.field[ pStartY ][ pStartX ].needMerge ) ? console.log('MERGE!!!') : console.log( 'Merge is not needed...' );
        if ( D.field[ pStartY ][ pStartX ].needMerge ) {
            var xMerge = D.field[ pStartY ][ pStartX ].xMerge;
            var yMerge = D.field[ pStartY ][ pStartX ].yMerge;
            D.field[ pStartY ][ pStartX ].needMerge = false;
            D.field[ pStartY ][ pStartX ].y = yMerge;
            D.field[ pStartY ][ pStartX ].x = xMerge;
            D.field[ pStartY ][ pStartX ].xEnd = xMerge;
            D.field[ pStartY ][ pStartX ].yEnd = yMerge;
            D.field[ yMerge ][ xMerge ].value *= 2;
            D.field[ yMerge ][ xMerge ].isMerging = true;
            D.field[ yMerge ][ xMerge ].isScaling = true;
            D.field[ yMerge ][ xMerge ].scale = 1;
            D.field[ yMerge ][ xMerge ].speedScale = -0.01 * scaleMultiplier;
            D.score += D.field[ yMerge ][ xMerge ].value;
            if ( D.audio ) {
                D.audio.PlaySound( cSound.merge );
            };
        };


    };
    
    function arrayOfEmptyCells() {//returns array [ { x:.., y:.. }, .. ] of empty cells
        var fEmptyCells = [];
        for ( j = 0; j < cellCount.y; j++ ) {
            for ( i = 0; i < cellCount.x; i++ ) {
                if ( D.field[ j ][ i ].value == 0 || D.field[ j ][ i ].needMerge ) {
                    fEmptyCells.push( { x: i, y: j } );
                };
            };
        };
        return fEmptyCells;
    };

    function moveValues( pXstart, pYstart, pXend, pYend ) {
        D.field[ pYend ][ pXend ].value         = D.field[ pYstart ][ pXstart ].value;
        D.field[ pYend ][ pXend ].x             = D.field[ pYstart ][ pXstart ].x;
        D.field[ pYend ][ pXend ].y             = D.field[ pYstart ][ pXstart ].y;
        D.field[ pYend ][ pXend ].isMoving      = D.field[ pYstart ][ pXstart ].isMoving;
        D.field[ pYend ][ pXend ].speedX        = D.field[ pYstart ][ pXstart ].speedX;
        D.field[ pYend ][ pXend ].speedY        = D.field[ pYstart ][ pXstart ].speedY;
        D.field[ pYend ][ pXend ].xEnd          = D.field[ pYstart ][ pXstart ].xEnd;
        D.field[ pYend ][ pXend ].yEnd          = D.field[ pYstart ][ pXstart ].yEnd;
        D.field[ pYend ][ pXend ].needMerge     = D.field[ pYstart ][ pXstart ].needMerge;
        D.field[ pYend ][ pXend ].isMerging     = D.field[ pYstart ][ pXstart ].isMerging;
        D.field[ pYend ][ pXend ].xMerge        = D.field[ pYstart ][ pXstart ].xMerge;
        D.field[ pYend ][ pXend ].yMerge        = D.field[ pYstart ][ pXstart ].yMerge;
        D.field[ pYend ][ pXend ].isScaling     = D.field[ pYstart ][ pXstart ].isScaling;
        D.field[ pYend ][ pXend ].scale         = D.field[ pYstart ][ pXstart ].scale;
        D.field[ pYend ][ pXend ].speedScale    = D.field[ pYstart ][ pXstart ].speedScale;
        D.field[ pYend ][ pXend ].isRising      = D.field[ pYstart ][ pXstart ].isRising;
    };

    function initCell( pField, pXindex, pYindex ) {
        //initiates D.field[ pYindex ][ pXindex ]
        var fCell = pField[ pYindex ][ pXindex ];
        fCell.value         = 0;
        fCell.x             = pXindex;
        fCell.y             = pYindex;
        fCell.isMoving      = false;
        fCell.speedX        = 0;
        fCell.speedY        = 0;
        fCell.xEnd          = pXindex;
        fCell.yEnd          = pYindex;
        fCell.needMerge     = false;
        fCell.xMerge        = pXindex;
        fCell.yMerge        = pYindex;
        fCell.isMerging     = false;
        fCell.isRising      = false;
        fCell.isScaling     = false;
        return fCell;
    };

    function buildField ( pCellCountX, pCellCountY ) {
        //builds initial field
        var Field = [];
        for ( var j = 0; j < pCellCountY; j++ ) {
            Field[ j ] = [];
            for ( var i = 0; i < pCellCountX; i++ ) {
                Field[ j ][ i ] = {};
                Field[ j ][ i ] = initCell( Field, i, j );
            };
        };
        return Field;
    };

    function showGamePage() {
        D.viewUI.HidePageElements();
    };

    function showResultsPage() {
        D.gameIsGoOn = false;
        D.viewUI.ShowResults();
    };

    function showGameIsOverPage() {
        D.gameIsGoOn = false;
        D.viewUI.ShowGameIsOver();
    };

    function showMenuPage() {
        D.gameIsGoOn = false;
        D.viewUI.HideField();
        D.viewUI.ShowMenu();
    };

    function showResultsFieldPage( pResultIndex ) {
        D.gameIsGoOn = false;
        D.viewUI.ShowResultsFieldPage(pResultIndex);
    };

    function startNewGame() {
        D.score = 0;
        var fCount = parseInt( document.getElementById( 'cellCount' ).textContent );
        cellCount.x = fCount;
        cellCount.y = fCount;
        if ( D.viewUI ) {
            D.viewUI.HidePageElements().HideField();
        };
        if ( D.view ) {
            D.view.Init();
            D.view.DrawField();
        };
        D.field = buildField( cellCount.x, cellCount.y );
        D.readyToNew = true;
        D.needNew = true;
        window.location.hash = "#";
        D.gameIsGoOn = true;
    };

    function gameIsOver() {
        consoleLog ? console.log('%c%s', 'color: green;', 'Model.success: The game is over...') : '';
        var currField = [];
        for ( var j = 0; j < cellCount.y; j++ ) {
            currField[ j ] = [];
            for ( var i = 0; i < cellCount.x; i++ ) {
                currField[ j ][ i ] = D.field[ j ][ i ].value;
            };
        };
        //console.log( currField );
        D.results.push( { name: D.currentUser, result: D.score, field: currField } );
        D.results.sort( hashItemsCompare );
        D.results.splice( 10, D.results.length - 10 );
        storeInfo();
        D.gameIsGoOn = false;
        window.location.hash = '#gameisover';
        return self;
    };

    function checkIfTheGameIsOver() {//checks if there is at least one possible movement
        var isOver = true;
        for ( var j = 0; j < cellCount.y; j++ ) {
            for ( var i = 0; i < cellCount.x; i++ ) {
                if ( j > 0 && D.field[ j ][ i ].value == D.field[ j - 1 ][ i ].value ||
                     j > 0 && D.field[ j - 1 ][ i ].value == 0 ) {
                     isOver = false;
                     break;
                };
                if ( j < cellCount.y - 1 && D.field[ j ][ i ].value == D.field[ j + 1 ][ i ].value ||
                     j > 0 && D.field[ j - 1 ][ i ].value == 0 ) {
                     isOver = false;
                     break;
                };
                if ( i > 0 && D.field[ j ][ i ].value == D.field[ j ][ i - 1 ].value ||
                     j > 0 && D.field[ j - 1 ][ i ].value == 0 ) {
                     isOver = false;
                     break;
                };
                if ( i < cellCount.x - 1 && D.field[ j ][ i ].value == D.field[ j ][ i + 1 ].value ||
                     j > 0 && D.field[ j - 1 ][ i ].value == 0 ) {
                     isOver = false;
                     break;
                };
            };
            if ( !isOver ) { break; };
        };
        return isOver;
    };

    function hashItemsCompare( pA, pB ) {
        pA.result = pA.result || 0;
        pB.result = pB.result || 0;
        pA.result = parseInt( pA.result );
        pB.result = parseInt( pB.result );
        return (pA.result - pB.result) * -1; 
    };

    
//=== AJAX ===

function restoreInfo() {
    $.ajax(
        {
            url : D.ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'READ', n : D.stringName },
            success : readReady, error : errorHandler
        }
    );
};

function readReady( ResultH )
{
    if ( ResultH.error != undefined )
        consoleLog ? console.log('%c%s', 'color: red;', 'Model.error: Ajax...', ResultH.error) : '';
    else if ( ResultH.result != "" ) {
        var InfoH = JSON.parse( ResultH.result ); 
        consoleLog ? console.log('%c%s', 'color: green;', 'Model.success: Receiving data: ', InfoH) : '';
        //console.log( 'InfoH: ', InfoH );
        InfoH.sort( hashItemsCompare );
        //console.log( 'InfoH.sort: ', InfoH );
        D.results = InfoH;
        consoleLog ? console.log('%c%s', 'color: green;', 'Model.success: D.results: ', D.results) : '';
        D.bestResult = ( D.results[0].result ) ? D.results[ 0 ].result : 0;
        //console.log( D.results );

    };
};

function storeInfo() 
{
    D.updatePassword = Math.random();
    $.ajax(
        {
            url : D.ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'LOCKGET', n : D.stringName, p : D.updatePassword },
            success : lockGetReady, error : errorHandler
        }
    );
};

function lockGetReady( ResultH ) {
    if ( ResultH.error!=undefined )
        console.log( 'Model.error: Ajax: ', ResultH.error ); 
    else {
        var InfoH = D.results;

        $.ajax(
            {
                url : D.ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'UPDATE', n : D.stringName, v : JSON.stringify(InfoH), p : D.updatePassword },
                success : updateReady, error : errorHandler
            }
        );
    };
};

function updateReady( ResultH ) 
{
    if ( ResultH.error != undefined )
        consoleLog ? console.log('%c%s', 'color: red;', 'Model.error: Ajax', ResultH.error) : '';
};

function errorHandler( jqXHR, StatusStr, ErrorStr) {
    console.log( 'Model.error: Ajax', StatusStr, ' ', ErrorStr );
    //alert( StatusStr + ' ' + ErrorStr );
};

self.ResetResults = function () {
    for ( var t = 0; t < 10; t++ ) {
        var currField = [];
        for ( var j = 0; j < cellCount.y; j++ ) {
            currField[ j ] = [];
            for ( var i = 0; i < cellCount.x; i++ ) {
                currField[ j ][ i ] = 0;
            };
        };
        //console.log( currField );
        D.results[ t ] = { name: '', result: 0, field: currField };
    };
    storeInfo();
};



};


