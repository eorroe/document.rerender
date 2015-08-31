# About
`document.updateDOM()` **Updates** the `DOM` on **CALL**. Looping through the changes that have been made to the `DOM`.
So that you don't have to worry about the browser touching the DOM unexpectedly.

**I haven't actually built anything with this yet. I want to try making something with this however, it'd be interesting to play with.**

# Usage

## Properties

```JS
document.body.id = 'body'; // doesn't set the actual id attribute on the body element
document.body.innerHTML = '<h1>Hello World</h1>'; // doesn't change the actual inner HTML of the body element

document.updateDOM(); // now all the changes above actually change on the DOM
```

The properties are actually affecting the actual Element object just not changing the **live** `DOM`, therefore:

```JS
document.body.id = 'body';
document.body.id; // returns 'body'

document.body // still returns <body></body>

document.updateDOM(); // makes the changes to the live DOM

document.body // now returns <body id="body"></body>
```

## Methods
Methods return a Promise:

```JS
var div = document.createElement('div'); // this methods isn't altered since its not part of HTMLElement.prototype (something to change in the future)
document.body.appendChild(div).then(function(div) {
  div.textContent = 'Hello World'; // set the textContent which won't actually change till updateDOM() is called
  document.updateDOM(); // call it to change the textContent
});
document.updateDOM(); // this causes the appendChild method to resolve and actually append the child element which returns the div
```

Let's create an `h1` element, query it, and style it:
```JS
document.body.innerHTML = '<h1>Hello</h1>'; // not yet changed
document.body.querySelector('h1').then(function(h1) {
  h1.style.color = 'red';
});
document.updateDOM();
```

# Future
- Specific `HTML` Element properties like `href` for `<a></a>` and `<link></link>` etc

There is so much to the `DOM APIs` to make everything like this, it'd take me a long time to basically rewrite the whole `DOM APIs`. For example the last example `h1.style.color = 'red';` will make the change right away and no need to call `document.updateDOM()` which is bad for the point of this. Still interesting to play with IMO.


# Wish/Want
A native way of letting the `DOM` know not to update the **live** `DOM` when editing a node's property, method calling until `document.updateDOM()` is called. 

# Other words
I really really don't think we need a **Virtual DOM** if you can keep track of all the changes correctly. Which will still require some complicated algorithm, but will skip a step:

To put it in code of how I see the virtual DOM:

```
var diffs = vDOM.map(diff(realDOM));
realDOM.apply(diffs);
```

The `Virtual DOM` is being diffed from the `Real Live DOM` which is basically "mapping" the changes.

If you could just collect the changes you'd skip the whole diffing process.

I'll say this is a naive perspective, but will keep thinking this until I learn more about the virtual DOM and see if this is still true :)
