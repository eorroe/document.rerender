# About
`document.updateDOM()` **Updates** the `DOM` on call. Looping through the changes that have been made to the `DOM`.

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

document.rerender(); // makes the changes to the live DOM

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

# Future
- Specific `HTML` Element properties like `href` for `<a></a>` and `<link></link>` etc


# Wish/Want
A native way of letting the `DOM` know not to update/rerender the **live** `DOM` when editing a node's property until `document.updateDOM()` is called.
