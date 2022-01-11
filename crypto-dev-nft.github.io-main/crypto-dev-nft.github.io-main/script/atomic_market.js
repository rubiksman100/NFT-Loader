import { addItem, fetchRetry, randomIntFromInterval } from './utils';
const limit = 100;
const options = { method: 'GET' };


export async function loadJSONAtomic(address, table, begin) {
    await fetchRetry('https://wax.api.atomicassets.io/atomicassets/v1/assets?owner=' + address + '&order=desc&page=' + String(begin + 1) + '&limit=' + String(limit), randomIntFromInterval(1500, 2000), 10, options)
        .then(response => parseJsonAtomic(response.data, table, address, begin + 1))
        .catch(err => console.error(err));
}
async function get_assets(ids) {
    const separator = "%2C";
    const string_ids = ids.join(separator)
    const response = await fetchRetry("https://wax.api.atomicassets.io/atomicmarket/v1/assets?ids=" + string_ids + "&page=1&limit=" + String(limit) + "&order=desc&sort=asset_id")
    return response.data
}
async function get_asset_sales(ids) {
    const separator = "%2C";
    const string_ids = ids.join(separator)
    const response = await fetchRetry("https://wax.api.atomicassets.io/atomicmarket/v1/sales?ids=" + string_ids + "&page=1&limit=" + String(limit) + "&order=desc&sort=asset_id")
    return response.data
}

async function parseJsonAtomic(response, table, address, begin) {
    const assets = response["data"];
    let all_assets_id = []
    for (var element of assets)
        all_assets_id.push(element.asset_id)
    const assets_prices = (await get_assets(all_assets_id)).data
    let all_asset_sales = []
    for (var element of assets_prices) {
        if (element.sales.length > 0)
            all_asset_sales.push(element.sales[0].sale_id)
    }
    const assets_sales = (await get_asset_sales(all_asset_sales)).data

    var whole_assets = assets.map(o => ({
        data: o.data,
        asset_id: o.asset_id,
        sales: assets_sales.find(o1 => o1.assets[0].asset_id === o.asset_id),
        auctions: assets_prices.find(o1 => o1.asset_id === o.asset_id).auctions,
        prices: assets_prices.find(o1 => o1.asset_id === o.asset_id).prices
    }))
    //const promises = opensea_assets.map(async (element) => {
    for (const element of whole_assets) {
        const data = element.data;
        var is_video = false;
        var uri = data.image;
        if (!uri)
            uri = data.Image;
        if (!uri)
            uri = data.img;
        if (!uri) {
            uri = data.video;
            is_video = true;
        }
        if (!uri) {
            uri = "https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713";
            is_video = false;
        }
        if (uri.startsWith('Qm'))
            uri = "https://ipfs.io/ipfs/" + uri;

        const elementName = data.name;

        var elementDescription = "<ul> <li>Description : " + data.description + "</li>";
        elementDescription += "</ul><h6>Price Data </h6><ul>"
        if (element.prices.length > 0) {
            const last_price = element.prices[0];
            const token = last_price.token.token_symbol;
            const token_precision = last_price.token.token_precision;
            const divisionRatio = Math.pow(10, token_precision);
            const suggested_price = last_price.suggested_median / divisionRatio;
            const min_price = last_price.min / divisionRatio;
            const max_price = last_price.max / divisionRatio;

            elementDescription = elementDescription +
                "<li>Suggested price : " + suggested_price.toFixed(1) + " " + token + "</li>" +
                "<li>Min price : " + min_price.toFixed(1) + " " + token + "</li>" +
                "<li>Max price : " + max_price.toFixed(1) + " " + token + "</li>";

            if (element.sales) {
                const current_sale = element.sales.price;
                const current_sale_token_symbol = current_sale.token_symbol;
                const current_sale_token_precision = current_sale.token_precision;
                const current_sale_divisionRatio = Math.pow(10, current_sale_token_precision);
                const current_sale_price = current_sale.amount / current_sale_divisionRatio;
                elementDescription += "<li>Current price : " + current_sale_price.toFixed(1) + " " + current_sale_token_symbol + "</li>"
            }
            elementDescription += "</ul>";

        }

        elementDescription += "</ul><h6>Collection Data </h6>"

        //elementDescription += '<ul><li> Current Floor Price : ' + floor_price + "</li>";
        //elementDescription += '<li> Total Volume : ' + total_volume + "</li></ul> ";


        //elementDescription += "<h6>Attributes rarity</h6><ul>"
        //for (let index = 0; index < element.traits.length; index++) {
        //    const trait = element.traits[index];
        //    elementDescription += "<li>" + trait.trait_type + " : " + trait.value + " (" + (100 * trait.trait_count / count).toFixed(1) + "%)</li>";
        //}
        var link = addItem(elementName, elementDescription, uri, table, 'glightbox-atomic', is_video);
    }
    //)
    //await Promise.all(promises);
    if (assets.length == limit) {
        await loadJSONAtomic(address, table, begin + 1);
    }
}