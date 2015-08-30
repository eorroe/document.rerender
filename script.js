(function() {
	var elementSetters = {}, elementGetters = {}, changes = [];
	function magic(prop) {
		try {
			var oldFunc = HTMLElement.prototype[prop];
			if(oldFunc instanceof Function) {
				HTMLElement.prototype[prop] = function() {
					changes.push( { node: this, prop: prop, func: oldFunc, args: arguments} );
				}
			}
		} catch(e) {
			elementGetters[prop] = HTMLElement.prototype.__lookupGetter__(prop);
			elementSetters[prop] = HTMLElement.prototype.__lookupSetter__(prop);
			var propObj = { value: null }
			Object.defineProperty(HTMLElement.prototype, prop, {
				get: function() {
					if(propObj.value !== null) {
						return propObj.value;
					} else {
						return elementGetters[prop].call(this);
					}
				},
				set: function(newVal) {
					propObj.value = newVal;
					changes.push( { node: this, prop: prop, newVal: newVal, propObj: propObj } );
				}
			});
		}
	}

	for(var prop in HTMLElement.prototype) magic(prop);

	document.updateDOM = function() {
		var change;
		while(change = changes.shift()) {
			if(change.node[change.prop] instanceof Function) {
				change.func.apply(change.node, change.args);
			} else {
				elementSetters[change.prop].call(change.node, change.newVal);
				change.propObj.value = null;
			}
		}
	}
})();
