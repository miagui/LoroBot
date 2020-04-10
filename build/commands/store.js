"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const steamLibrary = __importStar(require("../library/steamFunctions"));
const helperFunctions_1 = require("../library/helperFunctions");
const ROOT = require('path').dirname((_a = require.main) === null || _a === void 0 ? void 0 : _a.filename);
async function run(client, msg, cmd, args) {
    // * Busca na própria engine de search da Steam. Aqui é feito Scrap da página.
    var appId = await steamLibrary.buscarAppId(args);
    if (appId) {
        var app = await steamLibrary.getAppDetails(appId);
        var reply = `Encontrado o jogo ${app.name}.\n`;
        // * Verifica se existe a propriedade de preço no jogo.
        if (app.price_overview) {
            var initialPrice = app.price_overview.initial_formatted;
            var finalPrice = app.price_overview.final_formatted;
            var discount = app.price_overview.discount_percent;
        }
        // * Verifica se o jogo é F2P ou não.
        if (app.is_free) {
            reply = reply.concat("Free To Play\n");
        }
        else if (!app.is_free && !app.price_overview) {
            reply = reply.concat("Sem preço encontrado.\n");
        }
        else {
            // * Adiciona a queda histórica, buscada do GG Deals.
            if (discount == 0) {
                reply = reply.concat(`Preço: ${finalPrice} (Sem desconto no momento).\n`);
            }
            else {
                reply = reply.concat(`Preço: ~~${initialPrice} ~~${finalPrice} (${discount}% de desconto).\n`);
            }
            var historicalLow = await steamLibrary.getHistoricalLow(app.name);
            var lowestPrice = historicalLow[0];
            var lastTime = helperFunctions_1.weeksBetween(historicalLow[1], new Date());
            reply = reply.concat(`Queda histórica: ${lowestPrice} (${lastTime} semanas atrás).\n`);
        }
        // * Verifica se o jogo já foi lançado ou não.
        if (app.release_date.coming_soon) {
            reply = reply.concat(`Lançamento em breve.\n`);
        }
        else {
            reply = reply.concat(`Data de lançamento: ${app.release_date.date}\n`);
        }
        // * Adiciona o link da página da steam do jogo.
        reply = reply.concat(`https://store.steampowered.com/app/${appId}`);
        msg.channel.send(reply);
    }
    else {
        msg.channel.send("Jogo não encontrado.");
    }
}
exports.run = run;
exports.Usage = "!store `<nomedojogo>`";
exports.Info = "Busca por um jogo na Steam.";
