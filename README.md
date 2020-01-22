
# Typewriter

A Closure Compiler friendly, minimalist client-side rewrite of Matt Boldt's [Typed.js](https://github.com/mattboldt/typed.js/).

**Traditional usage:**
1. Include with `<script src="typewriter.min.js"></script>`.
2. Call with `new Typed(selector, config)`.


`selector` should be a CSS selector (will only select first match) and `config` should be an object of form:
```
{
    "default": "This is my default string.",
    "strings": [
        "This is my first string.",
        "This is my second string.",
        "This is my third string.",
        "This is my fourth string.^2000"
    ],
    "typeSpeed": 100, // default
    "backSpeed": 75, // default
    "cursor": false, // default
    "highlight": false, // default
    "loop": true, // default
}
```
i.e., `new Typewriter("#typed-text", myConfig)`.

# Notes

- Unlike Typed.js, `cursor` is false and `loop` is true by default. The `default` string is set immediately, and then the strings are cycled through. 
- Includes a patch for Safari where no DOM updates are made while a user is in the middle of a scroll bounce.

## Closure Compiler

1. Include in the pipeline with `--js typewriter.js` before any scripts that depend on the Typewriter class.
2. Explicitly reference the class with `new window.Typewriter()`. 

Explicitly referencing as a property of `window` will prevent Closure Compiler from throwing error flags. Additionally, you can configure an `externs.js` script and pass it with `--externs externs.js`, and include  `function Typewriter(selector,config) {}` in the externs file. (If you get a warning about `Typewriter` not being a constructor, add the `@constructor` JSDoc flag.)