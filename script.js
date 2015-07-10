(function() {
	var elementSetters = {}, elementGetters = {}, changes = [];
	for(var prop in HTMLElement.prototype) {
		try {
			HTMLElement.prototype[prop];
		} catch(e) {
			elementGetters[prop] = HTMLElement.prototype.__lookupGetter__(prop);
			elementSetters[prop] = HTMLElement.prototype.__lookupSetter__(prop);
			(function() {
				var prop2 = prop;
				Object.defineProperty(HTMLElement.prototype, prop2, {
					get() {
						if(this["_" + prop2] !== undefined) {
							return this["_" + prop2];
						} else {
							return elementGetters[prop2].call(this);
						}
					},
					set(newVal) {
						this["_" + prop2] = newVal;
						changes.push({node: this, prop: prop2, newVal});
					}
				});
			})();
		}
	}

	document.rerender = function() {
		var change;
		while(change = changes.shift()) {
			elementSetters[change.prop].call(change.node, change.newVal);
			delete change.node["_" + change.prop];
		}
	}
})();
