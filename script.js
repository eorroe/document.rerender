(function() {
	var elementSetters = {}, elementGetters = {}, changes = [];
	function magic(prop) {
		try {
			var change = { prop: prop, func: HTMLElement.prototype[prop] }
			if(change.func instanceof Function) {
				HTMLElement.prototype[prop] = function() {
					change.node = this, change.args = arguments;
					return new Promise(function(res) {
						change.res = res;
						changes.push(change);
					});
				}
			}
		} catch(e) {
			elementGetters[prop] = HTMLElement.prototype.__lookupGetter__(prop);
			elementSetters[prop] = HTMLElement.prototype.__lookupSetter__(prop);
			var change = { prop: prop, value: null }
			Object.defineProperty(HTMLElement.prototype, prop, {
				get: function() {
					if(change.value !== null) {
						return change.value;
					} else {
						return elementGetters[prop].call(this);
					}
				},
				set: function(newVal) {
					if(elementSetters[prop] !== undefined) {
						change.node = this, change.value = newVal;
						for(var i = 0, l = changes.length; i < l; i++) {
							var c = changes[i];
							if(c.node === this && c.prop === prop) return;
						}
						changes.push(change);
					}
				}
			});
		}
	}

	for(var prop in HTMLElement.prototype) magic(prop);

	document.updateDOM = function() {
		var change;
		while(change = changes.shift()) {
			if(change.node[change.prop] instanceof Function) {
				change.res( change.func.apply(change.node, change.args) );
			} else {
				elementSetters[change.prop].call(change.node, change.value);
				change.value = null;
			}
		}
	}
})();
