// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/video/**
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function toAv(x) {
        var table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
        var tr = {};
        for (var i = 0; i < 58; ++i) {
            tr[table[i]] = i;
        }

        var s = [11, 10, 3, 8, 4, 6];
        var xor = 177451812;
        var add = 8728348608;

        function decode(x) {
            var r = 0;
            for (var i = 0; i < 6; ++i) {
                r += tr[x[s[i]]] * (58 ** i);
            }
            return 'av' + String((r - add) ^ xor);
        }

        var bvs = x.match(/[bB][vV][fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10}/g);
        if (bvs) {
            for (let bv of bvs) {
                return [bv, decode(bv)];
            }
        }
        return [null, null];
    };

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return null;
    };

    let url = window.location.href;
    let bvAv = toAv(url);
    let time = null;

    try {
        time = parseFloat(getQueryVariable('peach'));
    } catch (err) {
    }

    let o = null;
    document.onkeydown = function (e) {
        if (e.ctrlKey && e.keyCode == 67) { // ctrl+C
            function handler(event) {
                let text = 'https://www.bilibili.com/video/' + bvAv[0] + '?peach=' + video.currentTime;
                event.clipboardData.setData('text/plain', text);
                document.removeEventListener('copy', handler, true);
                event.preventDefault();
            }
            document.addEventListener('copy', handler, true);
            document.execCommand('copy');
        } else if (e.ctrlKey) {
            if (!o && bvAv[1]) {
                let t = document.querySelector('.tr-fix');
                o = t.innerHTML;
                t.innerHTML = o + ' <span>  【' + bvAv[1] + '】</span>';
            }
        }
    };

    let video = document.querySelector('video');

    if (time) {
        video.currentTime = time;
    }

})();