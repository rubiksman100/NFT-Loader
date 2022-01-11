const axios = require('axios');
export function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}
export function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
export function addItem(elementName, elementDescription, uri, table, glightbox_str, is_video = false) {
    var figure = document.createElement("figure");
    var figureCaption = document.createElement("figcaption");
    figureCaption.style.textAlign = "center";
    figureCaption.innerHTML = elementName
    var link = document.createElement("a");
    link.href = uri;
    let img
    if (uri.toLowerCase().endsWith(".mp3") || uri.toLowerCase().endsWith(".wav")) {
        img = document.createElement("audio");
        img.setAttribute("controls", "controls");
    }
    else {
        link.classList.add(glightbox_str);
        link.setAttribute("data-desc-position", "right");
        elementDescription = "<h6>NFT Description</h6>" + elementDescription;
        if (elementDescription != undefined && elementDescription != "undefined" && elementDescription != null) {
            link.setAttribute("data-description", elementDescription);
        } else {
            link.setAttribute("data-description", "");
        }
        if (elementName != undefined && elementName != "undefined" && elementName != null) {
            link.setAttribute("data-title", elementName);
        }
        if (uri.toLowerCase().endsWith(".mp4") || is_video) {
            img = document.createElement("video");
            img.setAttribute('autoplay', true);
            img.setAttribute('controls', "controls");
            img.setAttribute('loop', true);
            img.setAttribute('oncanplay', "this.muted=true");
            img.alt = "video";
            img.setAttribute("playsinline", true)
            img.setAttribute("type", "video/mp4")
            link.setAttribute('data-type', "video");
        } else {
            img = document.createElement("img");
            img.alt = "image"
            link.setAttribute('data-type', "image");
        }
    }
    img.src = uri;
    img.style.display = "inline";
    img.style.width = "100%";
    link.appendChild(img);
    figure.appendChild(link);
    figure.appendChild(figureCaption);
    table.appendChild(figure);
    return link
}

export function fetchRetry(url, delay, tries, fetchOptions = {}) {
    function onError(err) {
        var triesLeft = tries - 1;
        if (!triesLeft) {
            throw err;
        }
        return wait(delay).then(() => fetchRetry(url, delay, triesLeft, fetchOptions));
    }
    return axios.get(url, fetchOptions).catch(onError);
}