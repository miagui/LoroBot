"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio_1 = __importDefault(require("cheerio"));
async function buscarAppId(nomeJogo) {
    var appId = 0;
    var res = await node_fetch_1.default(`https://store.steampowered.com/search/?term=${nomeJogo}`);
    var body = await res.text();
    // * Busca o primeiro AppID da página que for do atributo
    // * 'data-ds-appid' e estiver como um filho elemento de ID search_resultRows.
    var dataDsAppId = cheerio_1.default('a', '#search_resultsRows', body).attr('data-ds-appid');
    if (dataDsAppId) {
        appId = parseInt(dataDsAppId);
        return appId;
    }
    else {
        return 0;
    }
}
exports.buscarAppId = buscarAppId;
async function getPlayersCount(appId) {
    var res = await node_fetch_1.default(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=${appId}&cc=br`);
    var body = await res.json();
    var playerCount = body.response.player_count;
    return playerCount;
}
exports.getPlayersCount = getPlayersCount;
async function getAppDetails(appId) {
    var res = await node_fetch_1.default(`https://store.steampowered.com/api/appdetails/?appids=${appId}`);
    var body = await res.json();
    var appDetails = body[appId].data;
    return appDetails;
}
exports.getAppDetails = getAppDetails;
// * Converte uma string para o formato que aceita no URL do site GG Deals.
// * Exemplo: Street Fighter V -> street-fighter-v
function toHtmlFormat(appName) {
    appName = appName.toLowerCase().replace(/[\s']/g, "-").replace(/[:?!@#$%&()]/, "");
    return appName;
}
exports.toHtmlFormat = toHtmlFormat;
async function getHistoricalLow(appName) {
    var res = await node_fetch_1.default(`https://gg.deals/game/${toHtmlFormat(appName)}`);
    console.log(`Buscando em https://gg.deals/game/${toHtmlFormat(appName)}`);
    var body = await res.text();
    // * Busca pela classe .numeric no contexto da tag que contém a classe .lowest-recorded.
    // * Exemplo:       <div class='lowest-recorded>abc</div>
    //*                     <div class='numeric'>abc</div>
    var lowestPrice = cheerio_1.default(".numeric", ".lowest-recorded.price", body).first().text();
    var lastTime = new Date(cheerio_1.default("time", ".historical-info", body).attr('datetime'));
    console.log(lastTime);
    var historicalLow = [];
    historicalLow.push(lowestPrice);
    historicalLow.push(lastTime);
    return historicalLow;
}
exports.getHistoricalLow = getHistoricalLow;
