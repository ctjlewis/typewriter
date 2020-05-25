
# Typewriter

A Closure Compiler friendly, minimalist client-side rewrite of Matt Boldt's [Typed.js](https://github.com/mattboldt/typed.js/).

[View the demo on GitHub Pages](https://teleworkinc.github.io/typewriter/).

---

## React
```
<h1><Typewriter strings={['My first string', 'My second string']} default="Prefill goes here"></h1>
```

**Traditional usage:**
1. Include with `<script src="typewriter.min.js"></script>`.
2. Call with `new Typed(selector, strings, config)`.

`selector` should be a CSS selector (will only select first match) for the element to bind to, `strings` should be an array containing the strings to transition to, and `config` is an optional argument that should be an object of form:
```
{
    "default": "This is my default string.", // optional, set element innerHTML immediately
    "typeSpeed": 100, // default
    "backSpeed": 75, // default
    "cursor": false, // default
    "highlight": false, // default
    "loop": true, // default
}
```
i.e., `new Typewriter("#typed-text", ["My first string", "My second string"])`.


# Notes

- Unlike Typed.js, `cursor` is false and `loop` is true by default. The `default` string is set immediately, and then the strings are cycled through. 
- Includes a patch for Safari where no DOM updates are made while a user is in the middle of a scroll bounce.

## Closure Compiler

1. Include in the pipeline with `--js typewriter.js` before any scripts that depend on the Typewriter class.
2. Explicitly reference the class with `new window.Typewriter()`. 

Explicitly referencing as a property of `window` will prevent Closure Compiler from throwing error flags. Additionally, you can configure an `externs.js` script and pass it with `--externs externs.js`, and include  `function Typewriter(selector,config) {}` in the externs file. (If you get a warning about `Typewriter` not being a constructor, add the `@constructor` JSDoc flag.)
