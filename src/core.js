/**
 * @name Typewriter
 * @description A Closure Compiler friendly, minimalist client-side rewrite of Matt Boldt's Typed.js.
 * @license SEE LICENSE @ https://raw.githubusercontent.com/TeleworkInc/.LICENSE/master/LICENSE
 */


// uncomment below imports, run `yarn build:prod`
// to get working react.js dist

// PS: this ecosystem is garbage and NodeJS maintainers
// should feel bad. with the fucking ESlint, and the
// polyfills, and the babel bullshit, and the regenerator-runtimes
// and the "window not defined :-(" errors, and the
// "module not defined" errors, and the erosion
// of Javascript's "write once, run anywhere" principle

// MAKE CODE RELIABLE AGAIN
// MAKE DEVELOPERS WRITE ACTUAL CODE INSTEAD OF DEBUGGING THEIR WORKFLOW AGAIN

// UNCOMMENT FOR BUILD:PROD, COMMENT FOR BUILD:CORE (hilarious)
// import "core-js";
// import "regenerator-runtime/runtime";

class Typewriter {

    constructor(selector, strings = [], config = {}) {

        if (window && config.dev)
            window.TYPEWRITER_DEBUG = true;

        this.selector = selector;
        this.strings = strings;
        this.config = config;

        this.string = config.default || "";
        this.loop = config.loop || true;
        this.halt = false;

        this.element = typeof selector == "string"
            ? document.querySelector(selector)
            : selector;

        if (!this.element)
            throw new Error("TYPEWRITER_ERROR: Selected element not found. Please check your selector or provide an element.");

        this.init();
    }

    async init() {

        this.setTextContent(this.string || this.element.textContent);

        if (this.config.cursor !== false)
            this.element.classList.add("typed-content");

        if (this.config.highlight)
            this.element.style.setProperty(
                "background-color",
                this.config.highlightColor || "rgba(255,255,255,0.5)"
            );

        this.string = this.element.textContent;
        return await this.setStyles().run();
    }

    setTextContent(txt) {

        this.element.textContent = '';

        for (let char of txt)
            this.element.appendChild(
                document.createTextNode(char)
            );

        return this;
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    update() {
        this.log("[update] Updating string.");
        this.string = this.element.textContent;
        return this;
    }

    async clear() {
        this.element.textContent = "";
        return this;
    }

    async pause(ms) {
        this.log("[delay] Waiting", ms, "ms");
        return new Promise(resolve => window.setTimeout(resolve, ms));
    }

    async start() {
        this.log("[start] Starting...");
        this.halt = false;
        return await this.run();
    }

    async stop() {
        this.log("[stop] Stopping...");
        this.halt = true;
        return this;
    }

    async run() {

        if (this.halt || !this.strings.length) return this;
        this.log("[startTransitions] Starting transitions...");

        this.log("[startTransitions] got strings:", this.strings);
        for (let string of this.strings) {
            await this.pause(this.config.transitionSpeed || 1300);
            await this.transition(string);
        }

        return this.loop 
            ? await this.run() 
            : this;
    }

    async addCharacter(char) {

        if (!this.halt) 
            this.element.appendChild(document.createTextNode(char));

        await this
                .update()
                .log("[addCharacter] Character added. Now reads:", this.string);

        return await this.pause(this.config.typeSpeed || this.randomInt(100,200));
    
    }

    async deleteCharacter() {

        // if (this.halt) return this;
        const lastChild = this.element.lastChild;
        if(!this.halt && lastChild)
            lastChild.remove();

        await this
                .update()
                .log("[deleteCharacter] Character deleted. Now reads:", this.string);

        return await this.pause(this.config.deleteSpeed || this.randomInt(60, 120));
    
    }

    async addUntil(stringTo) {

        let i = 0;
        await this.update();
        this.log("[addUntil] Adding until:", stringTo);
        for (let char of stringTo)
            if (char !== this.string[i++] && !this.halt)
                await this.addCharacter(char);

        this.log("[addUntil] Done. Now reads:", this.string);
        return this;
    }

    async deleteUntil(stringTo) {
        await this.update();

        this.log("[deleteUntilLcm] Deleting until equal to lcm");
        while (stringTo.indexOf(this.string) === -1 && !this.halt)
            await this.deleteCharacter();

        return this;
    }

    async transition(stringTo) {

        this.log(`[transition] this.string: '${this.string}', stringTo: '${stringTo}'`);
        
        await this.deleteUntil(stringTo);
        await this.pause(500);
        await this.addUntil(stringTo);

        return this;
    }

    setStyles() {

        if (window.SET_TYPEWRITER_STYLES)
            return this;

        const blinkCSS = `.typed-content::after{content:"|";-webkit-animation:typed-cursor-blink 1s infinite;animation:typed-cursor-blink 1s infinite;margin-left:2px}@-webkit-keyframes typed-cursor-blink{0%{opacity:0}50%{opacity:1}100%{opacity:0}}@keyframes typed-cursor-blink{0%{opacity:0}50%{opacity:1}100%{opacity:0}}`;

        const styleTag = document.createElement("style");
        styleTag.innerHTML = blinkCSS;
        document.body.append(styleTag);

        window.SET_TYPEWRITER_STYLES = true;
        return this;
    }

    log(...strs) {
        if (window["TYPEWRITER_DEBUG"]) console.log(...strs);
        return this;
    }
}

// manual set on window for Closure Compiler export
window["Typewriter"] = Typewriter;

export default Typewriter;