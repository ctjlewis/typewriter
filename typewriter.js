/**
 * @name Typewriter.js
 * @description A Closure Compiler friendly, minimalist client-side rewrite of Matt Boldt's Typed.js.
 * @license
 *  Copyright (C) 2019 Herculean Inc, Christian Lewis
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

// Add CSS

var blinkCSS = `.typed-cursor::after{content:"|";animation:blink-animation 1s steps(5,start) infinite;-webkit-animation:blink-animation 1s steps(5,start) infinite}@keyframes blink-animation{to{visibility:hidden}}@-webkit-keyframes blink-animation{to{visibility:hidden}}`;
var styleTag = document.createElement("style");

styleTag.innerHTML = blinkCSS;
document.body.append(styleTag);

// Returns smallest string all arguments have in common
window.smallestCommonString = function(...strs){
    var arr= strs.concat().sort(),
    a1 = arr[0], a2 = arr[arr.length-1], L = a1.length, i = 0;
    while(i< L && a1.charAt(i)=== a2.charAt(i)) i++;
    return a1.substring(0, i);
}

// Extracts ^delay from string
window.decodeDelay = function(str) {
    var delayPattern = /\^\d+/;
    var match = str.match(delayPattern);
    var customDelay = 0;

    if (match) {
        customDelay = Number(str.substring(match.index + 1));
        str = str.substring(0, match.index);
    }

    return [str, customDelay];
}

// Waits until given condition is true
window.waitUntil = function (condition) {
    var poll = (resolve) => {
        if(condition()) resolve();
        else window.requestAnimationFrame(
            () => poll(resolve)
        );
    }

    return new Promise(poll);
}

// Check if overscrolled (Safari)
window.notOverscrolled =
    () => !(document.body.scrollTop < 0 || document.body.scrollTop + window.innerHeight > document.body.scrollHeight);

window.waitForOverscrollUnlock = 
    async () =>  await window.waitUntil(window.notOverscrolled);

class Typewriter {
    constructor(selector, strings, config = {}, startWith = config["default"]) {

        this.selector = selector;
        this.strings = strings;
        this.config = config;
        this.string = startWith;
        this.loop = true;
        this.element = true;

        this.init();
    }

    async init() {
        this.element = document.querySelector(this.selector);
        
        if(this.config["cursor"]) this.element.classList.add("typed-cursor"); 
        if(this.config["loop"] == false) this.loop = false;
        if(this.config["highlight"]) this.element.style.setProperty(
            "background-color", 
            this.config["highlightColor"] || "rgba(255,255,255,0.5)"
        );

        // if initial string doesn't exist, set it to element inner
        if(!this.string) this.string = this.element.innerHTML;

        this.log("[init] this.string:", this.string);

        if(this.string) await this.update(false);
        await this.startTransitions();
        
        return this;
    }

    async delay(ms) {
        this.log("[delay] Waiting", ms, "ms");
        return new Promise(resolve => window.setTimeout(resolve, ms));
    }

    async updateElement() {

        this.log("[updateElement] called");

        // update element
        window.requestAnimationFrame(
            () => this.element.innerHTML = this.string
        );

        this.log("[update] Delay finished.")
    }

    async update(delay) {

        this.log("Waiting for Overscroll Unlock...");
        await window.waitForOverscrollUnlock();

        this.log("Overscroll Lock released.");
        await this.updateElement();

        this.log("[update] Triggering delay.")
        if (delay) await this.delay(delay);

        return this;

    }

    async startTransitions() {

        if(!this.strings) return;

        var inBetweenPause = this.config["inBetweenPause"] || 1000;

        this.log("[startTransitions] got strings:", this.strings);
        for (var i = 0; i < this.strings.length; i++) {
            await this.delay(inBetweenPause);
            await this.transition(this.strings[i]);
        }

        if(this.loop) return await this.startTransitions();

        this.log("[startTransitions] Starting transitions...");
        return this;
    }

    async addCharacter(char) {
        this.string += char;
        this.log("[addCharacter] Character added. Now reads:", this.string);
        return await this.update(this.config["typeSpeed"] || 100);
    }

    async deleteCharacter() {
        this.string = this.string.substring(0, this.string.length - 1);
        
        this.log("[deleteCharacter] Character deleted. Now reads:", this.string);
        return await this.update(this.config["backSpeed"] || 50);
    }

    async addUntil(until) {
        if (until.indexOf(this.string) !== 0) 
            throw `[addUntil] ERROR! String '${this.string}' does not start with '${until}'`;

        this.log("[addUntil] Adding...");
        for (var i = 0; i < until.length; i++)
            if (until[i] != this.string[i])
                await this.addCharacter(until[i])

        this.log("[addUntil] Done. Now reads:", this.string);
        return this;
    }

    async deleteUntil(until) {
        if (until !== "" & this.string[0] !== until[0]) 
            throw `[deleteUntil] ERROR! '${this.string}' does not start any substring of '${until}'`;

        this.log("[deleteUntil] Deleting...");
        while(this.string !== until) await this.deleteCharacter();
        
        this.log("[deleteUntil] Done.");
        return this;
    }

    async transition(stringTo) {

        this.log(`[transition] this.string: '${this.string}', stringTo: '${stringTo}'`);

        // pull delay out
        var customDelay;
        [stringTo, customDelay] = window.decodeDelay(stringTo);
        
        // least common string is our end state
        var lcm_str = window.smallestCommonString(this.string, stringTo);

        await this.deleteUntil(lcm_str);
        await this.delay(300);
        await this.addUntil(stringTo);

        // custom delays, if applicable
        if(customDelay)
            await this.delay(customDelay);

        return this;
    }

    log(...strs) {
        if(window["TYPEWRITER_DEBUG"]) console.log(...strs);
        return this;
    }
}

// manual set on window for Closure Compiler export
window["Typewriter"] = Typewriter;