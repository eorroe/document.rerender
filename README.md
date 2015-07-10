# About
`document.rerender()` **RErenders/Updates** the `DOM` on call. Looping through the changes that have been made to the `DOM`.

# Usage

```JS
document.body.id = 'body'; // doesn't set the actual id attribute on the body element
document.body.innerHTML = '<h1>Hello World</h1>'; // doesn't change the actual inner HTML of the body element

document.rerender(); // now all the changes above actually change on the DOM
```

The properties are actually affecting the actual Element object just not changing the live `DOM`, therefore:

```JS
document.body.id = 'body';
document.body.id; // returns 'body'

document.body // still returns <body></body>

document.rerender(); // makes the changes to the live DOM

document.body // now returns <body id="body"></body>
```

# Future
- Perhaps change function name to `update()`
- Store `DOM` method changes like `Element#remove()`
- Specific `HTML` Element properties like `href` for `<a></a>` and `<link></link>` etc
