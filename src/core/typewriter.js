/**
 * @name Typewriter
 * @description A Closure Compiler friendly, minimalist client-side rewrite of Matt Boldt's Typed.js.
 * @license SEE LICENSE @ https://raw.githubusercontent.com/TeleworkInc/.LICENSE/master/LICENSE
 */

import '@babel/polyfill';

class Typewriter {

    constructor(selector, strings = [], config = {}) {

        if (config["dev"])
            window["TYPEWRITER_DEBUG"] = true;

        this.selector = selector;
        this.strings = strings;
        this.config = config;

        this.string = config.default || "";
        this.loop = config.loop || true;

        this.element = typeof selector == "string"
            ? document.querySelector(selector)
            : selector;

        if (!this.element)
            throw new Error("TYPEWRITER_ERROR: Selected element not found. Please check your selector or provide an element.");

        window.requestAnimationFrame(() => {
            this.init();
        });
    }

    setTextContent(txt) {

        this.element.textContent = '';

        for (let char of txt)
            this.element.appendChild(
                document.createTextNode(char)
            );

        return this;
    }

    // Waits until given condition is true
    waitUntil(condition) {
        var poll = (resolve) => {
            if (condition()) resolve();
            else window.requestAnimationFrame(
                () => poll(resolve)
            );
        }
        return new Promise(poll);
    }

    // Check if overscrolled (Safari)
    overscrollCheck() {
        return !(
            document.body.scrollTop < 0 ||
            document.body.scrollTop + window.innerHeight > document.body.scrollHeight
        );
    }

    isSafari() {
        return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    }

    async waitForOverscrollUnlock() {
        await this.waitUntil(this.overscrollCheck);
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    async init() {

        this.setTextContent(this.string || this.element.textContent);

        if (this.isSafari())
            this.log("[init] Safari detected. Will use overscroll lock.");

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

    async pause(ms) {
        this.log("[delay] Waiting", ms, "ms");
        return new Promise(resolve => window.setTimeout(resolve, ms));
    }

    async start() {
        this.halt = false;
        return await this.run();
    }

    async stop() {
        this.halt = true;
        await window.cancelAnimationFrame(window.PENDING_FRAME);
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

        // if (this.halt) return this;
        this.string += char;
        if (!this.halt) 
            window.PENDING_FRAME = await window.requestAnimationFrame(() => {
                this.element.appendChild(document.createTextNode(char));
            });

        this.log("[addCharacter] Character added. Now reads:", this.string);
        return await this.pause(this.config.typeSpeed || this.randomInt(80,160));
    
    }

    async deleteCharacter() {

        // if (this.halt) return this;
        const lastChild = this.element.lastChild;
        this.string = this.string.substring(0, this.string.length - 1);
        if(!this.halt)
        window.PENDING_FRAME = await window.requestAnimationFrame(() => {
                if (lastChild) lastChild.remove();
            });

        this.log("[deleteCharacter] Character deleted. Now reads:", this.string);
        return await this.pause(this.config.deleteSpeed || this.randomInt(60, 120));
    
    }

    async addUntil(stringTo) {

        let i = 0;
        this.log("[addUntil] Adding until:", stringTo);
        for (let char of stringTo)
            if (char !== this.string[i++] && !this.halt)
                await this.addCharacter(char);

        this.log("[addUntil] Done. Now reads:", this.string);
        return this;
    }

    async deleteUntil(stringTo) {

        this.log("[deleteUntilLcm] Deleting until equal to lcm");
        while (stringTo.indexOf(this.string) === -1 && !this.halt)
            await this.deleteCharacter();

        return this;
    }

    async transition(stringTo) {

        this.log(`[transition] this.string: '${this.string}', stringTo: '${stringTo}'`);
        
        await this.waitForOverscrollUnlock();
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
// window["Typewriter"] = Typewriter;

export default Typewriter;