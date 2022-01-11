export const contractAddresses = {
    "BscBakeNFT": '0x43DB8ea81074b31Cf2665B600A4086cF36B59445',
    "BarkingNFT": '0xa86Bd7C13C19CC4586dcb07CF06Fa1f9578a6212',
    "LoveNFT": '0x6475270a858E0056e5aFc9187C87507B01375890',
    "BondlyNFT": '0x4ba782b05c7D580Ab6B896c6A63B8E5de53738B3',
    "YooshiNFT": '0x32afc8dC2Ff4AF284FA5341954050f917357A5f1',
    "SfpNFT": '0x1d0E5AF3faee43B5cFFf8f872F41d43B93ed964B',
    "BakerySoccer": '0x01f474B0c5be88C9C3c27089dFdfB552804F4810',
    "OneInchBakeNFT": '0x2B843942EdF0040012b12bE2b3C197Ef53cab7F9',
    "TokocryptoNFT": '0x3A1c331Bb2cBA92F3F623068947bAbAE3ed99A36',
    "SeascapeNFT": '0xc54b96b04AA8828b63Cf250408E1084E9F6Ac6c8',
    "BakeryArtwork3NFT": '0xe98631Ce5ccf1e9eF1638a76C78702a384A79E29',
    "BakeryArtwork2NFT": '0x1233B9f706cB9028a03B61AF125cf1Fe840CDBD3',
    "BakeryArtworkNFT": '0x5Bc94e9347F3b9Be8415bDfd24af16666704E44f',
    "digitalArtworkNft": '0xbc9535ceb418a27027f5cc560440f4a8823cb8bf',
    "gaNFT" : "0xff473df96251AcFfb0Ae06fDAA51d33F1Dafff7c",
    "bmoncNFT" : "0xACD21e605e838f1b5D2294f05f635250aF9BBbbb",
    "blin" : "0x3cFE8101C04b55eB3E42D19F468bce982B96Dc45",
    "muskUsmLand" :  '0xb5665e1038c4E17C58aB55b5C591faB52CE83fC4',
    "bakemusk" : "0x6EFdD0380C9DdE9c50ae99669d8FFd9439EFCDBd",
    "ktaNFT" : "0x3565AC59Aa2127D4C45bd050b673fBe6202cd742",
    "toys" : "0x14a62860de2Fdec247D48780ed110DBB794545d8",
    "matrixPlusBox" : "0x061C6eECA7B14cF4eC1B190Dd879008DD7d7E470",
    "takauNFT": "0x4E64198C1E13248BfC0e63D53E03460dbB383a94"
}

export function getAddress(type) {
    var address = "";
    switch (type) {
        case 1:
            address = contractAddresses["digitalArtworkNft"];
            break;
        case 3:
            address = contractAddresses["BakeryArtworkNFT"];
            break;
        case 4:
            address = contractAddresses["BakeryArtwork2NFT"];
            break;
        case 5:
            address = contractAddresses["BakeryArtwork2NFT"];
            break;
        case 6:
            address = contractAddresses["SeascapeNFT"];
            break;
        case 7:
            address = contractAddresses["TokocryptoNFT"];
            break;
        case 8:
            address = contractAddresses["OneInchBakeNFT"];
            break;
        case 100:
            address = contractAddresses["BakerySoccer"];
            break;
        case 101:
            address = contractAddresses["SfpNFT"];
            break;
        case 105:
            address = contractAddresses["LoveNFT"];
            break;
        case 108:
            address = contractAddresses["BarkingNFT"];
            break;
        case 109:
            address = contractAddresses["YooshiNFT"];
            break;
        case 111:
            address = contractAddresses["BscBakeNFT"]
            break;
        case 112:
            address = contractAddresses["takauNFT"];
            break;
        case 113:
            address = contractAddresses["matrixPlusBox"];
            break;
        case 115:
            address = contractAddresses["toys"];
            break;
        case 116:
            address = contractAddresses["ktaNFT"];
            break;
        case 117:
            address = contractAddresses["bakemusk"];
            break;
        case 118:
            address = contractAddresses["muskUsmLand"];
            break;
        case 119:
            address = contractAddresses["blin"];
            break;
        case 121:
            address = contractAddresses["bmoncNFT"];
            break;
        case 120:
            address =  contractAddresses["gaNFT"];
    }
    return address
}
