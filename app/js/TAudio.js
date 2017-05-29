function TAudio ( pData, pModel ) {
    var self = this;
    var D = pData || {};
    D.model = D.model || pModel || null;
    D.audio = {};
    D.audio.click = new Audio;
    D.audio.swipe = new Audio;
    D.audio.merge = new Audio;
    D.audio.heart = new Audio;
    D.audio.music = new Audio;

    self.Set = function( pKey, pValue ) {
        D[ pKey ] = pValue;
        return self;
    };

    self.Get = function( pKey ) {
        return D[ pKey ];
    };

    self.Init = function(  ) {
        consoleLog ? console.log('%c%s', 'color: blue;', 'Audio.warning: Can play audio/ogg: ', D.audio.click.canPlayType( "audio/ogg; codecs=vorbis" ) ) : '';
        consoleLog ? console.log('%c%s', 'color: blue;', 'Audio.warning: Can play audio/mpeg: ', D.audio.click.canPlayType( "audio/mpeg" ) ) : '';
        if ( D.audio.click.canPlayType( "audio/mpeg" ) == "probably" ) {
            D.audio.click.src = soundsSrc.click.mp3;
            D.audio.swipe.src = soundsSrc.swipe.mp3;
            D.audio.merge.src = soundsSrc.merge.mp3;
            D.audio.heart.src = soundsSrc.heart.mp3;
            D.audio.music.src = soundsSrc.music.mp3;
        } else {
            D.audio.click.src = soundsSrc.click.ogg;
            D.audio.swipe.src = soundsSrc.swipe.ogg;
            D.audio.merge.src = soundsSrc.merge.ogg;
            D.audio.heart.src = soundsSrc.heart.ogg;
            D.audio.music.src = soundsSrc.music.ogg;
        };
        D.audio.click.pause();
        D.audio.swipe.pause();
        D.audio.merge.pause();
        D.audio.heart.pause();
        D.audio.music.pause();

        consoleLog ? console.log('%c%s', 'color: green;', 'Audio.success: Audio is initialized...') : '';
        return self;
    };

    self.PlaySound = function( pSound ) {
        switch ( pSound ) {
            case cSound.click:
                if ( soundOn ) {
                    D.audio.click.currentTime = 0;
                    D.audio.click.play();
                };
            break;
            case cSound.swipe:
                if ( soundOn ) {
                    //D.audio.swipe.currentTime = 0;
                    D.audio.swipe.play();
                };
            break;
            case cSound.merge:
                if ( soundOn ) {
                    //D.audio.merge.currentTime = 0;
                    D.audio.merge.play();
                };
            break;
            case cSound.heart:
                if ( soundOn ) {
                    //D.audio.heart.currentTime = 0;
                    D.audio.heart.play();
                };
            break;
            case cSound.music:
                if ( musicOn ) {
                    //D.audio.music.currentTime = 0;
                    D.audio.music.play();
                };
            break;
        };
        
        return self;
    };


};