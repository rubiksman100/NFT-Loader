import Wallet from "@project-serum/sol-wallet-adapter"
import { addItem } from './utils';
import GLightbox from 'glightbox';

export async function solanaWalletConnect(provider_str) {
  if (provider_str == "sollet") {
    let provider = 'https://www.sollet.io';
    let wallet = new Wallet(provider);
    await wallet.connect();
    return wallet.publicKey.toBase58();
  }
  if (provider_str == "sollet_ext") {
    let provider = window.sollet;
    let wallet = new Wallet(provider);
    await wallet.connect();
    return wallet.publicKey.toBase58();
  }
  if (provider_str == "phantom") {
    await window.solana.connect();
    return window.solana.publicKey.toBase58();
  }
}

async function parseInfoWallet(response, address, table) {
  let bought = response.NFT_boughts;
  let sold = response.NFT_sold;
  let forSaleresponse = await getforSaleInfo(address);
  let forSale = forSaleresponse.NFT_forSale;
  let possessed = forSale
  for (let index = 0; index < bought.length; index++) {
    let found_in_sold = false;
    const element = bought[index];
    const element_id = bought[index].id;
    for (let index_sold = 0; index_sold < sold.length; index_sold++) {
      if (element_id == sold[index_sold].id) {
        found_in_sold = true;
        break;
      }
      if (!found_in_sold) {
        let found_in_possessed = false
        for (let index_possessed = 0; index_possessed < possessed.length; index_possessed++) {
          found_in_possessed = true;
          break;
        }
        if (!found_in_possessed) {
          possessed.push(element)
        }
      }
    }
  }
  const promises = possessed.map(async (element) => {
    console.log(element)
    const uri = element.link_img;
    const elementName = element.name;
    const elementDescription = element.description;
    var elementAttributes = element.attributes;
    var descript = "<ul>"
    if (elementDescription != undefined && elementDescription != "undefined" && elementDescription != null) {
      descript += ('<li>Description : ' + elementDescription + "</li>");
    }
    descript = descript + '<li> Current Price : ' + element.price + " " + element.currency + "</li></ul>";
    var link = addItem(elementName, descript, uri, table, "glightbox-solana")
    var type = element.type;
    await getAttributesRarity(type, link, elementAttributes)
    await getCollectionPrices(type, link)
  })
  await Promise.all(promises);

  var lightbox = GLightbox({
    selector: '.glightbox-solana',
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
    zoomable: true,
    draggable: true
  });
}

function parseInfoPrices(response, link) {
  var actual_descript = link.getAttribute("data-description");
  actual_descript = actual_descript + "<h6>Collection Data </h6>"
  actual_descript = actual_descript + '<ul><li> Current Floor Price : ' + response.floorPrice + "</li>";
  actual_descript = actual_descript + '<li> Total Volume : ' + response.totalVolume + "</li></ul> ";
  link.setAttribute("data-description", actual_descript);
}


function parseInfoAttributes(response, link, elementAttributes) {
  var actual_descript = link.getAttribute("data-description");
  actual_descript += "<h6>Attributes rarity</h6><ul>"
  for (let [key, value] of Object.entries(response)) {
    if (elementAttributes.replace(/\s+/g, '').includes(key.replace(/\s+/g, ''))) {
      actual_descript += "<li>" + key + " " + value + "%</li>";
    }
  }
  actual_descript += "</ul>"
  link.setAttribute("data-description", actual_descript);
}


async function getforSaleInfo(address) {
  const response = await fetch('https://qzlsklfacc.medianetwork.cloud/infos_wallet_for_sale?address=' + address);
  return response.json();
}
export async function getWalletInfo(address, table) {
  await fetch('https://qzlsklfacc.medianetwork.cloud/infos_wallet?address=' + address)
    .then(response => response.json())
    .then(response => parseInfoWallet(response, address, table))
    .catch(err => console.error(err));
}

async function getCollectionPrices(collection, link) {
  await fetch('https://qzlsklfacc.medianetwork.cloud/query_volume_per_collection?collection=' + collection)
    .then(response => response.json())
    .then(response => parseInfoPrices(response, link))
    .catch(err => console.error(err));
}

async function getAttributesRarity(collection, link, elementAttributes) {
  await fetch('https://qzlsklfacc.medianetwork.cloud/rarity?collection=' + collection)
    .then(response => response.json())
    .then(response => parseInfoAttributes(response, link, elementAttributes))
    .catch(err => console.error(err));
}