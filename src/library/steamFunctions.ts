import fetch from "node-fetch"
import $ from 'cheerio'
import {App} from '../interfaces/ISteamSchema'
import * as toolLibrary from '../library/helperFunctions'

export async function buscarAppId(nomeJogo: string): Promise<number>
{
    var appId: number = 0;
    var res = await fetch(`https://store.steampowered.com/search/?term=${nomeJogo}`)
    var body = await res.text()
    // * Busca o primeiro AppID da página que for do atributo
    // * 'data-ds-appid' e estiver como um filho elemento de ID search_resultRows.
    var dataDsAppId = $('a', '#search_resultsRows', body).attr('data-ds-appid')

    if (dataDsAppId)
    {
        appId = parseInt(dataDsAppId)
        return appId
    }
    else
    {
        return 0;
    }
}

export async function getPlayersCount(appId: number): Promise<number>
{
    var res = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=${appId}&cc=br`)
    var body = await res.json()
    var playerCount: number = body.response.player_count
    return playerCount;
}

export async function getAppDetails(appId: number): Promise<App.Data>
{
    var res = await fetch(`https://store.steampowered.com/api/appdetails/?appids=${appId}`)
    var body = await res.json()
    var appDetails: App.Data = body[appId!].data
    return appDetails;
}

// * Converte uma string para o formato que aceita no URL do site GG Deals.
// * Exemplo: Street Fighter V -> street-fighter-v
export function toHtmlFormat(appName: string): string
{
    appName = appName.toLowerCase().replace(/[\s']/g, "-").replace(/[:?!@#$%&()]/, "")
    return appName
}

export async function getHistoricalLow(appName: string): Promise<any>
{
    var res = await fetch(`https://gg.deals/game/${toHtmlFormat(appName)}`)
    console.log(`Buscando em https://gg.deals/game/${toHtmlFormat(appName)}`)
    var body = await res.text()

    // * Busca pela classe .numeric no contexto da tag que contém a classe .lowest-recorded.
    // * Exemplo:       <div class='lowest-recorded>abc</div>
    //*                     <div class='numeric'>abc</div>
    var lowestPrice: string = $(".numeric", ".lowest-recorded.price", body).first().text()
    var lastTime: Date = new Date($("time", ".historical-info", body).attr('datetime')!)
    console.log(lastTime)
    
    var historicalLow = []
    historicalLow.push(lowestPrice)
    historicalLow.push(lastTime)
    return historicalLow;
}