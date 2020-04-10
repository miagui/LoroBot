"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importStar(require("node-fetch"));
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
    var res = await node_fetch_1.default(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=${appId}`);
    var body = await res.json();
    var playerCount = body.response.player_count;
    return playerCount;
}
exports.getPlayersCount = getPlayersCount;
async function getAppDetails(appId) {
    var res = await node_fetch_1.default(`https://store.steampowered.com/api/appdetails/?appids=${appId}&cc=br`);
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
    // * Esse cookie guarda a sessão que deixa a região em PT-BR, assim evitando que valores apareceram
    // * em outra moeda caso esteja hospedado em um servidor de outro país.
    var cookie = "gg-session=ecuf69rmgps7pkmthsmm93dmok; gg_csrf=33e7ff54a14c8693ade8da7da59303a13d39b605s%3A88%3A%22NWZkU1kxeU5rMmlhcWNQN0h3NjlybVR2X29ram5zVVr9iB74Q64E004YnvlWzbwwcyrelT1Om_dTjuiIENLBJQ%3D%3D%22%3B";
    var header = new node_fetch_1.Headers({
        'Cookie': cookie,
        'Accept-Language': 'en-US'
    });
    var res = await node_fetch_1.default(`https://gg.deals/game/${toHtmlFormat(appName)}`, {
        headers: header
    });
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
