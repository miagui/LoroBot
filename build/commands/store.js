"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio_1 = __importDefault(require("cheerio"));
const ROOT = require('path').dirname((_a = require.main) === null || _a === void 0 ? void 0 : _a.filename);
function run(client, msg, cmd, args) {
    // * Busca na própria engine de search da Steam. Aqui é feito Scrap da página.
    node_fetch_1.default(`https://store.steampowered.com/search/?term=${args}`)
        .then(res => res.text())
        .then(body => {
        // * Busca o primeiro AppID da página que for do atributo
        // * 'data-ds-appid' e estiver como um filho elemento de ID search_resultRows.
        var appId = cheerio_1.default('a', '#search_resultsRows', body).attr('data-ds-appid');
        // * Se for encontrado, prossiga com a operação.
        // * Caso contrário mande mensagem de que não encontrou o jogo.
        if (appId) {
            node_fetch_1.default(`https://store.steampowered.com/api/appdetails/?appids=${appId}`)
                .then(res => res.json())
                .then(body => {
                var app = body[appId].data;
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
                    if (discount == 0) {
                        reply = reply.concat(`Preço: ${finalPrice} (Sem desconto no momento).\n`);
                    }
                    else {
                        reply = reply.concat(`Preço: ~~${initialPrice} ~~${finalPrice} (${discount}% de desconto).\n`);
                    }
                }
                // * Verifica se o jogo já foi lançado ou não.
                if (app.release_date.coming_soon) {
                    reply = reply.concat(`Lançamento em breve.`);
                }
                else {
                    reply = reply.concat(`Data de lançamento: ${app.release_date.date}\n`);
                }
                // * Adiciona o link da página da steam do jogo.
                reply = reply.concat(`https://store.steampowered.com/app/${appId}`);
                msg.channel.send(reply);
            });
        }
        else {
            msg.channel.send("Jogo não encontrado.");
        }
    });
}
exports.run = run;
exports.Usage = "!store `<nomedojogo>`";
exports.Info = "Busca por um jogo na Steam.";
