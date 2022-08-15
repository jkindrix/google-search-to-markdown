
// ==UserScript==
// @name         Copy links from google search to clipboard in markdown format
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy all google search result links on the current page into the clipboard in Markdown format
// @author       jkindrix
// @match        *://www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function getLinksAsMarkdown() {
        var markdown_links = "";
        var elements = document.querySelectorAll("h3");
        for (var element of elements) {
            var title = element.innerText ;
            try {
                var anchor_tag = element.closest("a");
                var url = element.closest("a").href;
            } catch (error) {
                continue;
            }
            var markdown_link = "[" + title + "](" + url + ")\n";
            markdown_links += markdown_link
        }
        GM_setClipboard(markdown_links);

    }

    function addButtonToPage() {
        /*--- Create a button in a container div.  It will be styled and
        positioned with CSS. ---*/
        var zNode = document.createElement ('div');
        zNode.innerHTML = '<button id="myButton" type="button">'
            + 'Copy links</button>';
        zNode.setAttribute ('id', 'myContainer');
        document.getElementById("before-appbar").append(zNode);
        //document.body.prepend (zNode);

        //--- Activate the newly added button.
        document.getElementById ("myButton").addEventListener (
            "click", ButtonClickAction, false
        );

        function fadeAndRemove(element, ms) {
            var fadeTarget = element;
            var fadeEffect = setInterval(function () {
                if (!fadeTarget.style.opacity) {
                    fadeTarget.style.opacity = 1;
                }
                if (fadeTarget.style.opacity > 0) {
                    fadeTarget.style.opacity -= 0.1;
                } else {
                    clearInterval(fadeEffect);
                }
            }, ms);

            setTimeout(() => { element.remove() }, ms * 10);
        }

        function ButtonClickAction (zEvent) {
            getLinksAsMarkdown();

            var zNode = document.createElement('p');
            zNode.innerHTML = 'Copied!';
            document.getElementById("myContainer").appendChild(zNode);
            fadeAndRemove(zNode, 100);
        }

        //--- Style our newly added elements using CSS.
        GM_addStyle ( `
            #myContainer {
                display: inline-block;
                font-size: 20px;
                margin: 5px;
                margin-left: var(--center-abs-margin);
                opacity: 0.9;
                z-index: 1100;
                padding: 5px 20px;
            }
            #myButton {
               cursor: pointer;
               background-color: #303134;
            }
            #myContainer p {
                display: inline-block;
                color: white;
                margin: 0px;
                margin-left: 10px;

            }
        `);
    }

    addButtonToPage();

})();
