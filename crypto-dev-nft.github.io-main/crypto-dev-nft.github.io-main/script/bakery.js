import { addItem } from './utils';
import { getAddress } from "./bakery_constants"

const options = { method: 'GET' };
const limit = 20;

async function parseJsonBakery(response, table, address, begin) {
    const bakery_assets = response.data.list;
    const promises = bakery_assets.map(async (element) => {
        var uri = element.imageUrl;
        if (uri == "")
            uri = element.fileUrl
        const elementName = element.name;
        const elementDescription = "<ul> <li>Description : " + element.description;
        var nftAddress = getAddress(element.nftType);
        // Other types must be dealt with.
        // https://www.bakeryswap.org/static/js/components/nftInfo/TradingList.tsx
        var link = addItem(elementName, elementDescription, uri, table, 'glightbox-bakery');
        await callAssetEvents(nftAddress, element.nftId, link);
    })
    await Promise.all(promises);
    if (bakery_assets.length == limit) {
        await loadJSONBakery(address, table, begin + limit)
    }
}

async function callAssetEvents(address, id, link) {
    await fetch('https://www.bakeryswap.org/api/v1/nfts/events?sortName=time&nftAddress=' + address + '&nftId=' + id + '&limit=100&offset=0', options)
        .then(response => response.json())
        .then(response => addMoreDescription(response, link))
        .catch(err => console.error(err));
}

function BakeImg() {
    return '<img src="https://www.bakeryswap.org/images/bakery/icon_bake.svg" width="13px" height="13px" alt="" style="margin-right: 5px; margin-bottom: -2px;"></img>'
}


function addMoreDescription(response, link) {
    var actual_descript = link.getAttribute("data-description");
    var data = response.data.list;
    if (data.length > 0) {
        var priceHistory = []
        for (const priceItem of data) {
            if (priceItem.event == "Trade") {
                priceHistory.push(priceItem.detail.price / 1e18 + BakeImg() + " ");
            }
        }
        if (priceHistory.length > 0)
            actual_descript = actual_descript + '<li> Selling Price History : ' + priceHistory + "</li>";
        var LastData = data[0];

        if (LastData.event == 'Ask')
            actual_descript = actual_descript + '<li> Current Price : ' + LastData.detail.price / 1e18 + BakeImg() + "</li>";
        actual_descript = actual_descript + "</ul>"
    }

    link.setAttribute("data-description", actual_descript);
}

export async function loadJSONBakery(address, table, begin) {
    await fetch('https://www.bakeryswap.org/api/v3/nfts?owner=' + address + '&order_direction=desc&offset=' + String(begin) + '&limit=' + String(limit), options)
        .then(response => response.json())
        .then(response => parseJsonBakery(response, table, address, begin))
        .catch(err => console.error(err));
    return
}