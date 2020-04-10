"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const steamLibrary = __importStar(require("../library/steamFunctions"));
const toolLibrary = __importStar(require("../library/helperFunctions"));
async function run(client, mgs, cmd, args) {
    var appId = await steamLibrary.buscarAppId(args);
    if (appId) {
        var playersCount = await steamLibrary.getPlayersCount(appId);
        var appDetails = await steamLibrary.getAppDetails(appId);
        var appName = appDetails.name;
        mgs.channel.send(` \`\`\`Jogo: ${appName}\nAppID: ${appId}\nQuantidade de jogadores: ${toolLibrary.formatNumber(playersCount)} \`\`\` `);
    }
    else {
        mgs.channel.send("Jogo não encontrado.");
    }
}
exports.run = run;
exports.Usage = "!steamplayers <nomedojogo>";
exports.Info = "Retorna a quantidade atual de jogadores de um jogo.";
