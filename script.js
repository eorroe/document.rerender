(function() {
	var elementSetters = {}, elementGetters = {}, methods = {}, changes = [];
	function magic(prop) {
		if( div[ prop ] instanceof Function ) {
			methods[ prop ] = div[ prop ];
			HTMLElement.prototype[ prop ] = function() {
				var change = { prop: prop, func: methods[ prop ], node: this, args: arguments };
				return new Promise( function( res ) {
					change.res = res;
					changes.push( change );
				});
			}
		} else {
			elementGetters[ prop ] = div.__lookupGetter__( prop );
			elementSetters[ prop ] = div.__lookupSetter__( prop );
			var change = { prop: prop, value: null }
			Object.defineProperty( HTMLElement.prototype, prop, {
				get: function() {
					if( change.value !== null ) {
						return change.value;
					} else {
						return change.value = elementGetters[ prop ].call( this );
					}
				},
				set: function( newVal ) {
					if( elementSetters[ prop ] !== undefined ) {
						change.node = this, change.value = newVal;
						for(var i = 0, l = changes.length; i < l; i++) {
							var c = changes[ i ];
							if( c.node === this && c.prop === prop ) return;
						}
						changes.push( change );
					}
				}
			});
		}
	}

	var div = document.createElement( 'div' );
	for( var prop in div ) magic( prop );
	div = prop = null;

	document.updateDOM = function() {
		var change;
		while( change = changes.shift() ) {
			if( change.node[ change.prop ] instanceof Function ) {
				change.res( change.func.apply( change.node, change.args ) );
			} else {
				elementSetters[ change.prop ].call( change.node, change.value );
				change.value = null;
			}
		}
	}
})();
