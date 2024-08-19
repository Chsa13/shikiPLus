// ==UserScript==
// @name         shikiPlus
// @author       chsa13
// @description  script add viewer and playeer on shikimori
// @namespace    http://shikimori.me/
// @version      1.3
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @icon         https://www.google.com/s2/favicons?domain=shikimori.me
// @license      MIT
// @copyright    Copyright © 2024 chsa13. All rights reserved.
// @downloadURL  https://github.com/Chsa13/shikiPLus/raw/main/shikiPlus.user.js
// @updateURL    https://github.com/Chsa13/shikiPLus/raw/main/shikiPlus.user.js
// ==/UserScript==
let RonobeLibLink = "https://ranobelib.me/ru/"
let MangaLibLink = "https://test-front.mangalib.me/ru/"
let AnimeLibLink = "https://anilib.me/ru/anime/"
let LibSocialApiLink = 'https://api.lib.social/api'

function launchFullScreen(element) {
    if (element.requestFullScreen) {
        element.requestFullScreen();
    }
    else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
    else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
}

function ready(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") fn();
    else document.addEventListener('DOMContentLoaded', fn);
}
async function sleep(timeMs) {
    await new Promise(resolve => setTimeout(resolve, timeMs));
}
async function GetResourceAsync(uri, config = {}) {
    return await new Promise((resolve, reject) => {
        $.ajax(Object.assign({
            url: uri,
            dataType: 'json',
            async: true,
            cache: false,
            success: function(res) {
                resolve(res);
            },
            error: function(xhr) {
                reject(xhr);
            }
        }, config));
    });
}
async function ranobelib(hrefs, type) {
    let sets = document.createElement("div")
    sets.style.cssText = `
  margin-bottom: 10px;
    width: 100%;
    height: 50px;
    display: flex;
  `
    document.querySelector('.b-db_entry').appendChild(sets)
    let sweatcher = document.createElement("div")
    sweatcher.textContent = "Выбрать версию"
    sweatcher.style.cssText = `
      line-height: normal;
  padding-left: 5px;
      justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: 2px solid;
    font-size: 21px;
    height: 50px;
    display: flex;
  `
    if (hrefs.length >= 2) sets.appendChild(sweatcher)
    var fr = document.createElement("iframe");
    for (let i in hrefs) {
        let btm = document.createElement("div")
        btm.style.cssText = `
    cursor: pointer;
    margin: 5px 5px;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background-color: green;
    display: flex;
    `
        btm.textContent = (String(Number(i)+1))
        sweatcher.appendChild(btm)
        btm.addEventListener("click", () => {
            if (type == "manga") {
                fr.src = MangaLibLink + hrefs[i] + "/read/v01/c01"
            }
            else if (type == "ranobe") {
                fr.src = RonobeLibLink + hrefs[i] + "/read/v01/c01"
            }
        })
    }
    if (type == "manga") {
        fr.src = MangaLibLink + hrefs[0] + "/read/v01/c01"
    }
    else if (type == "ranobe") {
        fr.src = RonobeLibLink + hrefs[0] + "/read/v01/c01"
    }
    fr.setAttribute('allowFullScreen', 'allowfullscreen')
    fr.style.cssText = `
    width: 100%;
    height: unset;
    aspect-ratio: 1.36;
    min-height: 650px;
    border: none;
  `;
    let blackdiv = document.createElement("div")
    blackdiv.style.cssText = `
    position: absolute;
    background-color: black;
    width: 100%;
    height: unset;
    aspect-ratio: 1.36;
    min-height: 650px;
    border: none;
  `
    let e = document.createElement("div")
    e.style.cssText = `
    display: flex;
    flex-grow: 1;
    height: 40px;
    flex-direction: row-reverse;
  `
    sets.appendChild(e)
    let g = document.createElement("div")
    g.style.cssText = `
    height: 50px;
    line-height: normal;
    cursor: pointer;
    padding: 15px;
    border-radius: 10px;
    background-color: rgb(149, 201, 206);
    font-size: 20px;
    justify-content: center;
    align-items: center;
    display: flex;
  `
    g.textContent = "Полноэкранный режим"
    e.appendChild(g)
    g.addEventListener("click", () => {
            launchFullScreen(fr)
        })
        /*   document.querySelector('.b-db_entry').appendChild(blackdiv) */
    fr.onload = async function() {
        blackdiv.remove()
    }
    document.querySelector('.b-db_entry').appendChild(fr)
}
async function animelib(href) {
    var fr = document.createElement("iframe");
    fr.src = AnimeLibLink + href.split("?")[0] + "/watch";
    fr.setAttribute('allowFullScreen', 'allowfullscreen')
    fr.style.cssText = `
      width: 100%;
      height: unset;
      aspect-ratio: 1.36;
      min-height: 650px;
      border: none;
  `;
    let blackdiv = document.createElement("div")
    blackdiv.style.cssText = `
      position: absolute;
      background-color: black;
      width: 100%;
      height: unset;
      aspect-ratio: 1.36;
      min-height: 650px;
      border: none;
  `
    document.querySelector('.b-db_entry').appendChild(blackdiv)
    fr.onload = async function() {
        blackdiv.remove()
    }
    document.querySelector('.b-db_entry').appendChild(fr)
}
async function addBtn() {
    if (document.querySelector('.shikiPlus')) return
    let lic = false
    let btn = document.createElement("div")
    btn.classList.add("shikiPlus")
    let clickFunc = function() {
        1 == 1
    }
    let href = ""
    let type
    if (location.href.includes("/animes/")) {
        let id = document.querySelector('.b-user_rate').getAttribute('data-target_id')
        let title = document.querySelector("meta[property='og:title']").getAttribute('content')
        try {
            title = title.split(" ")[0]
        }
        catch {
            1 == 1
        }
        console.log(title)
        let response = await GetResourceAsync(LibSocialApiLink + "/anime?q=" + title)
        href = ""
        console.log(response)
        for (let i in response.data) {
            if (id == response.data[i].shikimori_href.split("/")[4]) {
                href = response.data[i].slug_url
            }
        }
        clickFunc = animelib
        console.log(href)
    }
    else if (location.href.includes("/mangas/")) {
        type = "manga"
        await a(type)
    }
    else if (location.href.includes("/ranobe/")) {
        type = "ranobe"
        await a(type)
    }
    async function a(type) {
        let as = []
        if (type =="ranobe") as = document.querySelectorAll(".ranobelib > a")
        if (type =="manga") as = document.querySelectorAll(".mangalib > a")
        href = []
        for (let i in as) {
            if (as[i].href) {
                i = (as[i].href.split("?")[0].replace("https://ranobelib.me/", "").replace("https://mangalib.me/", "").replace("ru/", "").replace("book/", "").replace("ranobes/", "").replace("ranobe/", "").replace("manga/", "").replace("mangas/", ""))
                console.log(i)
                let response = await GetResourceAsync(LibSocialApiLink + "/manga/" + i)
                lic = response.data.is_licensed
                href.push(response.data.slug_url)
            }
        }
        clickFunc = ranobelib
    }
    btn.addEventListener("click", async() => {
        btn.remove()
        console.log(href)
        clickFunc(href, type)
    })
    btn.style.cssText = `
        border-radius: 10px;
        opacity: 0.75;
        text-align: center;
        font-size: 25px;
        width: 100%;
        height: 40px;
        background-color: #e0ff9a;
        cursor: pointer;
    `
    if (!type) btn.textContent = "Просмотр"
    else btn.textContent = "Читать"
    if (!lic && (href || href.length)) document.querySelectorAll('.c-image').forEach(e => e.appendChild(btn))
}
ready(addBtn)
