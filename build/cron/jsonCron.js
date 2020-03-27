"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const ROOT = require('path').dirname((_a = require.main) === null || _a === void 0 ? void 0 : _a.filename);
function Iniciar() {
    var buscarJogos = new cron_1.CronJob({
        cronTime: '00 30 14 * * 0-6',
        onTick: function () {
            console.log('[STEAM/APPLIST] Buscando AppList/v2...');
            // * Usa da biblioteca node-fetch para buscar o corpo da página.
            node_fetch_1.default("http://api.steampowered.com/ISteamApps/GetAppList/v2")
                .then(res => res.text())
                // * Usa a flag: "w" do objeto  WriteFileOptions para criar um arquivo caso não exista.
                .then(body => fs_1.default.writeFile(`${ROOT}/json/steamJogos.json`, body, { flag: "w" }, function (err) {
                if (err)
                    throw console.log(err);
                console.log("[STEAM/APPLIST] Salvo com sucesso");
            }));
        },
        start: true,
        runOnInit: true
    });
}
exports.Iniciar = Iniciar;
