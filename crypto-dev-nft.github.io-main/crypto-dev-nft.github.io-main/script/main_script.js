import { solanaWalletConnect, getWalletInfo } from './solana_connect';
import { loadJSONOpensea } from './opensea'
import { loadJSONBakery } from './bakery'
import { loadJSONAtomic } from './atomic_market'
import * as waxjs from "@waxio/waxjs/dist";

import MetaMaskOnboarding from '@metamask/onboarding'
import GLightbox from 'glightbox';

let account;
const onboardButton = document.getElementById('onboard');
const solletOnboardButton = document.getElementById('sollet_onboard');
const solletIOOnboardButton = document.getElementById('sollet_io_onboard');
const phantomOnboardButton = document.getElementById('phantom_onboard');
const waxOnboardButton = document.getElementById('onboardWax');

solletIOOnboardButton.onclick = () => { ConnectSolana("sollet") }
solletOnboardButton.onclick = () => { ConnectSolana("sollet_ext") }
phantomOnboardButton.onclick = () => { ConnectSolana("phantom") }
waxOnboardButton.onclick = ConnectWax;

const accountsDiv = document.getElementById('accounts');
const wax = new waxjs.WaxJS({
    rpcEndpoint: 'https://wax.greymass.com',
    tryAutoLogin: false
});

async function ConnectSolana(provider_str) {
    var key = await solanaWalletConnect(provider_str);
    account = key
    accountsDiv.innerHTML = account
    await getNFTDAtaSolana(key)
}

async function ConnectWax() {
    //normal login. Triggers a popup for non-whitelisted dapps
    async function login() {
        try {
            //if autologged in, this simply returns the userAccount w/no popup
            let userAccount = await wax.login();
            let pubKeys = wax.pubKeys;
            return userAccount
        } catch (e) {
            alert("Can't Connect to Wax.")
        }
    }
    const userAccount = await login();
    account = userAccount;
    accountsDiv.innerHTML = account;
    getNFTDAtaAtomic()
}

async function getNFTDAtaAtomic() {
    const begin = 0
    var table = document.getElementById("nft_test");
    var AtomicNFT = document.createElement('div')
    AtomicNFT.classList.add("hes-gallery")
    AtomicNFT.classList.add("hidden")
    table.innerHTML = ""
    var Atomich2 = document.createElement('h2')
    Atomich2.innerHTML = 'Atomic Market NFTs'
    table.appendChild(Atomich2)
    table.appendChild(AtomicNFT)
    await loadJSONAtomic(account, AtomicNFT, begin)
    var atomic_lightbox = GLightbox({
        selector: '.glightbox-atomic',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        zoomable: true,
        draggable: true
    });
    AtomicNFT.classList.remove("hidden")
    if (AtomicNFT.innerHTML == "") {
        AtomicNFT.innerHTML = "<center><h4>It seems that you have no NFT on Atomic Market</h4></center>"
        AtomicNFT.classList.remove("hes-gallery")
    }
}

async function handleNewMetamaskAccounts(newAccounts) {
    account = newAccounts[0]
    accountsDiv.innerHTML = account
    try {
        await getNFTDataBSCAndETH();
    } catch (error) {
        throw (error);
    }
}

async function getNFTDAtaSolana() {
    const begin = 0
    var table = document.getElementById("nft_test");
    var solanaNFT = document.createElement('div')
    solanaNFT.classList.add("hes-gallery")
    solanaNFT.classList.add("hidden")
    table.innerHTML = ""
    var Solanah2 = document.createElement('h2')
    Solanah2.innerHTML = 'Solanart NFTs'
    table.appendChild(Solanah2)
    table.appendChild(solanaNFT)
    getWalletInfo(account, solanaNFT)
    solanaNFT.classList.remove("hidden")
    if (solanaNFT.innerHTML == "") {
        solanaNFT.innerHTML = "<center><h4>It seems that you have no NFT on Solanart</h4></center>"
        solanaNFT.classList.remove("hes-gallery")
    }
}

async function getNFTDataBSCAndETH() {
    //account = "0xaF4A5dabb5d922B4CDAA5fDf2EdDABade6895f85"
    const begin = 0
    var table = document.getElementById("nft_test");
    table.innerHTML = ""
    var bakeryNFT = document.createElement('div')
    var bakeryh2 = document.createElement('h2')
    bakeryh2.innerHTML = 'BakerySwap NFTs'
    table.appendChild(bakeryh2)
    bakeryNFT.classList.add("hes-gallery")
    bakeryNFT.classList.add("hidden")
    table.appendChild(bakeryNFT)
    await loadJSONBakery(account, bakeryNFT, begin);
    var openseaNFT = document.createElement('div')
    openseaNFT.classList.add("hes-gallery")
    openseaNFT.classList.add("hidden")
    var openSeah2 = document.createElement('h2')
    openSeah2.innerHTML = 'OpenSea NFTs'
    table.appendChild(openSeah2)
    table.appendChild(openseaNFT)
    await loadJSONOpensea(account, openseaNFT, begin);
    var lightbox = GLightbox({
        selector: '.glightbox-opensea',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        zoomable: true,
        draggable: true
    });
    var lightbox_bakery = GLightbox({
        selector: '.glightbox-bakery',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        zoomable: true,
        draggable: true
    });
    bakeryNFT.classList.remove("hidden")
    openseaNFT.classList.remove("hidden")
    if (bakeryNFT.innerHTML == "") {
        bakeryNFT.innerHTML = "<center><h4>It seems that you have no NFT on BakerySwap</h4></center>"
        bakeryNFT.classList.remove("hes-gallery")

    }
    if (openseaNFT.innerHTML == "") {
        openseaNFT.innerHTML = "<center><h4>It seems that you have no NFT on OpenSea</h4></center>"
        openseaNFT.classList.remove("hes-gallery")
    }
}

const onClickConnect = async () => {
    try {
        const newAccounts = await ethereum.request({
            method: 'eth_requestAccounts',
        })
        handleNewMetamaskAccounts(newAccounts)
    } catch (error) {
        console.error(error)
    }
}
//We create a new MetaMask onboarding object to use in our app
const forwarderOrigin = undefined
const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

//This will start the onboarding proccess
const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
};
const isMetaMaskInstalled = () => {
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
}
const MetaMaskClientCheck = () => {
    //Now we check to see if Metmask is installed
    if (!isMetaMaskInstalled()) {
        //If it isn't installed we ask the user to click to install it
        onboardButton.innerHTML = 'You must install MetaMask!';
        //When the button is clicked we call this function
        onboardButton.onclick = onClickInstall;
        //The button is now disabled
        onboardButton.disabled = false;
    } else {
        //If it is installed we change our button text
        onboardButton.innerHTML = 'Metamask Connect';
        onboardButton.onclick = onClickConnect
    }
};
MetaMaskClientCheck();
