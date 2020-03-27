import cron, { CronJob } from "cron";
import fs from "fs";
import fetch from "node-fetch";

const ROOT = require('path').dirname(require.main?.filename);

export function Iniciar() 
{
    var buscarJogos: CronJob = new CronJob({
        cronTime: '00 30 14 * * 0-6'
        ,onTick: function () 
        {
            console.log('[STEAM/APPLIST] Buscando AppList/v2...');
    
            // * Usa da biblioteca node-fetch para buscar o corpo da página.
            fetch("http://api.steampowered.com/ISteamApps/GetAppList/v2")
                .then(res => res.text())
                // * Usa a flag: "w" do objeto  WriteFileOptions para criar um arquivo caso não exista.
                .then(body => fs.writeFile(`${ROOT}/json/steamJogos.json`, body, { flag: "w" }, function (err) {
                    if (err) throw console.log(err);
                    console.log("[STEAM/APPLIST] Salvo com sucesso")
                }))
        }
        ,start:true
        ,runOnInit: true
    })
    
    
}




