
# Typewriter

A minimalist rewrite of Matt Boldt's [Typed.js](https://github.com/mattboldt/typed.js/).

[View the demo on GitHub Pages](https://teleworkinc.github.io/typewriter/).

---

## React
```
<h1>
    <Typewriter strings={['My first string', 'My second string']} default="Prefill goes here" />
</h1>
```
or
```
<h1>
    <Typewriter strings={['My first string', 'My second string']}>
        My prefill text
    </Typewriter>
</h1>
```

**Traditional usage:**
1. Include with `<script src="typewriter.min.js"></script>`.
2. Call with `new Typed(selector, strings, config)`.

`selector` should be a CSS selector (will only select first match) for the element to bind to, `strings` should be an array containing the strings to transition to, and `config` is an optional argument that should be an object of form:
```
{
    "default": "This is my default string.",
    "typeSpeed": 100, // default: "natural" 
    "backSpeed": 75, // default: "natural"
    "cursor": false,
    "highlight": true,
    "loop": false,
}
```
i.e., `new Typewriter("#typed-text", ["My first string", "My second string"])`.


# Notes

- Unlike Typed.js, `loop` is true by default and starts automatically. The `default` string is set immediately, and then the strings are cycled through. Transitioning between two strings like `This is my first string` and `This is my second string` will type naturally, backspacing only to `This is my` and then typing out the rest of the string.

Client-side standalone (closure compiled) is in `dist/browser.js`.