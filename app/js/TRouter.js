function TRouter( pData, pModel ) {
    var self = this;
    var D = pData || {};
    D.model = pModel || pData || null;

    self.Set = function( pKey, pValue ) {
        D[ pKey ] = pValue;
        return self;
    };

    self.Get = function( pKey ) {
        return D[ pKey ];
    };

    self.Init = function() {
        window.addEventListener( 'hashchange', changeLocation, false );
    };

    function changeLocation( EO ) {
        EO = EO || window.event;
        var hashStr = EO.newURL.substr( EO.newURL.indexOf( '#' ) );
        consoleLog ? console.log('%c%s', 'color: green;', 'Router.success: location is changed: ', hashStr) : '';
        if ( D.model ) {
            D.model.ChangeLocation ( hashStr );
        };
    };
};