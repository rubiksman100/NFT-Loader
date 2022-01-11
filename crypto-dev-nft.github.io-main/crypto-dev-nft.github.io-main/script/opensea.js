
import { addItem, fetchRetry } from './utils';
var AsyncLock = require('async-lock');
var lock = new AsyncLock();
var seen_collections = {}

const limit = 20;
const options = {
    //method: 'GET',
    headers: {
        //"X-API-KEY": process.env.API_KEY
    }
};

export async function loadJSONOpensea(address, table, begin) {
    await fetchRetry('https://api.opensea.io/api/v1/assets?owner=' + address + '&order_direction=desc&offset=' + String(begin) + '&limit=' + String(limit), randomIntFromInterval(1500, 2000), 10, options)
        .then(response => parseJsonOpensea(response.data, table, address, begin))
        .catch(err => console.error(err));
}

async function callAssetEvents(address, id, link) {
    // To recover sale history (last one is first in the list)
    await fetchRetry('https://api.opensea.io/api/v1/events?asset_contract_address=' + address + '&token_id=' + id + '&event_type=successful&only_opensea=false&offset=0&limit=' + String(limit), randomIntFromInterval(1500, 2000), 10, options)
        .then(response => addMoreDescription(response.data, link))
        .catch(err => console.error(err));
}

async function addCollectionData(slug) {
    var stats

    if (slug in seen_collections) {
        stats = seen_collections[slug]
    }
    else {
        const response = await fetchRetry(' https://api.opensea.io/api/v1/collection/' + slug + '/stats', randomIntFromInterval(1500, 2000), 10, options)
        stats = response.data.stats
        seen_collections[slug] = stats
    }
    return [stats.count, stats.floor_price, stats.total_volume];
}


function addMoreDescription(response, link) {
    var actual_descript = link.getAttribute("data-description");
    var data = response.asset_events;
    var priceHistory = [];
    for (const priceItem of data) {
        const paymentToken = priceItem.payment_token;
        if (priceItem.event_type == "successful") {
            var decimals = paymentToken.decimals;
            var divisionRatio = Math.pow(10, decimals);
            priceHistory.push(priceItem.total_price / divisionRatio + paymentToken.symbol);
        }
    }
    if (priceHistory.length > 0)
        actual_descript = actual_descript + '<li> Selling Price History : ' + priceHistory + "</li>";
    link.setAttribute("data-description", actual_descript);
}

async function parseJsonOpensea(response, table, address, begin) {
    const opensea_assets = response["assets"];
    //const promises = opensea_assets.map(async (element) => {
    for (const element of opensea_assets) {
        var uri = element.image_url;
        if (uri == "")
            uri = element.animation_url;
        const elementName = element.name;
        const nftAddress = element.asset_contract.address;
        const [count, floor_price, total_volume] = await addCollectionData(element.collection.slug)

        var elementDescription = "<ul> <li>Description : " + element.description + "</li>";
        elementDescription += "</ul><h6>Collection Data </h6>"
        elementDescription += '<ul><li> Current Floor Price : ' + floor_price + "</li>";
        elementDescription += '<li> Total Volume : ' + total_volume + "</li></ul> ";


        elementDescription += "<h6>Attributes rarity</h6><ul>"
        for (let index = 0; index < element.traits.length; index++) {
            const trait = element.traits[index];
            elementDescription += "<li>" + trait.trait_type + " : " + trait.value + " (" + (100 * trait.trait_count / count).toFixed(1) + "%)</li>";
        }
        var link = addItem(elementName, elementDescription, uri, table, 'glightbox-opensea');
        // To recove price history, but needs too much API calls and is unstable key
        //await callAssetEvents(nftAddress, element.token_id, link);
    }
    //)
    //await Promise.all(promises);
    if (opensea_assets.length == limit) {
        await loadJSONOpensea(address, table, begin + limit);
    }
}