function TController( pData, pModel ) {
    var self = this;
    var D = pData || {};
    D.model = D.model || pModel || null;
    D.listenOn = true;

    D.initialPoint  = 0;
    D.finalPoint    = 0;
    D.gesuredZone   = document.getElementById('canvasContainer');

    self.Set = function( pKey, pValue ) {
        D[ pKey ] = pValue;
        return self;
    };

    self.Get = function( pKey ) {
        return D[ pKey ];
    };

    self.Init = function() {
        document.addEventListener('keyup', self.KeyUp, false);
        D.gesuredZone.addEventListener('touchstart', touchStart, false);
        D.gesuredZone.addEventListener('touchend', self.TouchEnd, false);
        document.getElementById('buttonMenu').addEventListener( 'mouseup', buttonMenuClick, false );
        document.getElementById('buttonResults').addEventListener( 'mouseup', buttonResultsClick, false );
        document.getElementById( 'buttonNewGame' ).addEventListener( 'mouseup', buttonNewGameClick, false );
        document.getElementById( 'buttonMusicOnOff' ).addEventListener( 'mouseup', buttonMusicOnOffClick, false );
        document.getElementById( 'buttonSoundOnOff' ).addEventListener( 'mouseup', buttonSoundOnOffClick, false );
        document.getElementById( 'buttonCellCountMinus' ).addEventListener( 'mouseup', buttonCellCountMinusClick, false );
        document.getElementById( 'buttonCellCountPlus' ).addEventListener( 'mouseup', buttonCellCountPlusClick, false );

        window.addEventListener( 'hashchange', changeListenStatus, false );
        //document.addEventListener( 'gameisover', self.StopListen, false );
        return self;
    };

    self.StopListen = function() {
        document.removeEventListener('keyup', self.KeyUp);
        D.gesuredZone.removeEventListener('touchstart', touchStart, false);
        D.gesuredZone.removeEventListener('touchend', self.TouchEnd, false);
        consoleLog ? console.log('%c%s', 'color: brown;', 'Controller.precaution: Listening was stopped...') : '';
        return self;
    };

    self.StartListen = function() {
        document.addEventListener('keyup', self.KeyUp, false);
        D.gesuredZone.addEventListener('touchstart', touchStart, false);
        D.gesuredZone.addEventListener('touchend', self.TouchEnd, false);
        consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Listening is active...') : '';
        return self;
    };

    self.KeyUp = function( EO ) {
        EO = EO || window.event;
        EO.preventDefault();
        EO.stopPropagation();
        //userIsActive = true;
        //document.removeEventListener('keyup', self.KeyUp);
        
        var result = null;
            if ( !D.model.Get( 'busy' ) ) {
                switch (EO.keyCode) {
                    case 37:
                        consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Arrow left was pressed...') : '';
                        result = cDirection.left;
                        //Model.LetsMove( cDirection.left );
                    break;

                    case 38:
                        consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Arrow up was pressed...') : '';
                        result = cDirection.up;
                        //Model.LetsMove( cDirection.up );
                    break;

                    case 39:
                        consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Arrow right was pressed...') : '';
                        result = cDirection.right;
                        //Model.LetsMove( cDirection.right );
                    break;

                    case 40:
                        consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Arrow down was pressed...') : '';
                        result = cDirection.down;
                        //Model.LetsMove( cDirection.down );
                    break;

                    default:
                        consoleLog ? console.log('%c%s', 'color: blue;', 'Controller.warning: Keyup event - Key code is: ', EO.keyCode) : '';
                        //D.model.NewCell();
                };
            };

            if ( result && D.model ) {
                Model.LetsMove( result );
            } else if ( result ) {
                consoleLog ? console.log('%c%s', 'color: blue;', 'Controller.warning: Model is not assigned... ') : '';
            };
    };

    self.TouchEnd = function( EO ) {
        EO = EO || window.event;
        EO.preventDefault();
        EO.stopPropagation();
        var result = null;
        //userIsActive = true;
        D.finalPoint = EO.changedTouches[ 0 ];
        var xAbs = Math.abs( D.initialPoint.pageX - D.finalPoint.pageX );
        var yAbs = Math.abs( D.initialPoint.pageY - D.finalPoint.pageY );
        if ( xAbs > 20 || yAbs > 20 ) {
            if ( xAbs > yAbs ) {
                if ( D.finalPoint.pageX < D.initialPoint.pageX ) {
                    /*swipe left*/
                    consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Swipe left...') : '';
                    result = cDirection.left;
                } else {
                    /*swipe right*/
                    consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Swipe right...') : '';
                    result = cDirection.right;
                };
            } else {
                if ( D.finalPoint.pageY < D.initialPoint.pageY ) {
                    /*swipe up*/
                    consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Swipe up...') : '';
                    result = cDirection.up;
                } else {
                    /*swipe down*/
                    consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Swipe down...') : '';
                    result = cDirection.down;
                };
            };
        };
        if ( result && D.model ) {
            Model.LetsMove( result );
        } else if ( result ) {
            consoleLog ? console.log('%c%s', 'color: blue;', 'Controller.warning: Model is not assigned... ') : '';
        };
    };

    function touchStart( EO ) {
        EO = EO || window.event;
        EO.preventDefault();
        EO.stopPropagation();
        D.initialPoint = EO.changedTouches[ 0 ];
    };

    function buttonMenuClick( EO ) {
        EO = EO || window.event;
        EO.preventDefault();
        EO.stopPropagation();
        //console.log( 'Menu...', EO, window.location.hash );
    };

    function buttonResultsClick( EO ) {
        EO = EO || window.event;
        EO.preventDefault();
        EO.stopPropagation();
        //console.log( 'Results... ', EO, window.location.hash );
    };

    function buttonNewGameClick( EO ) {
        EO = EO || window.event;
        consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Button new game click...') : '';
    };

    function buttonMusicOnOffClick( EO ) {
        EO = EO || window.event;
        consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Button music On / Off click...') : '';
        musicOn = !musicOn;
        var music = D.model.Get( 'audio' );
        if ( !musicOn ) {
            music.Get( 'audio' ).music.pause();
        } else {
            music.Get( 'audio' ).music.play();
        };
        
        return musicOn;
    };

    function buttonSoundOnOffClick( EO ) {
        EO = EO || window.event;
        consoleLog ? console.log('%c%s', 'color: green;', 'Controller.success: Button sound On / Off click...') : '';
        soundOn = !soundOn;
        return soundOn;
    };

    function buttonCellCountMinusClick( EO ) {
        EO = EO || window.event;
        var fCountElm = document.getElementById( 'cellCount' );
        var fCount = parseInt( fCountElm.textContent );
        if ( fCount > cellCount.min ) {
            fCount--;
            fCountElm.textContent = fCount;
        };
    };

    function buttonCellCountPlusClick( EO ) {
        EO = EO || window.event;
        var fCountElm = document.getElementById( 'cellCount' );
        var fCount = parseInt( fCountElm.textContent );
        if ( fCount < cellCount.max ) {
            fCount++;
            fCountElm.textContent = fCount;
        };
    };
    
    function changeListenStatus ( EO ) {
        EO = EO || window.event;
        var hashStr = EO.newURL.substr( EO.newURL.indexOf( '#' ) );
        if ( hashStr == '' || hashStr == '#' ) {
            self.StartListen();
        } else {
            self.StopListen();
        };
    };

};