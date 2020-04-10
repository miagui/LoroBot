import { Client, Message } from "discord.js";
import * as steamLibrary from '../library/steamFunctions'
import * as toolLibrary from '../library/helperFunctions'
import { App } from "../interfaces/ISteamSchema";

export async function run (client: Client, mgs: Message ,cmd: string, args: string)
{
    var appId: number | undefined = await steamLibrary.buscarAppId(args)

    if (appId)
    {
        var playersCount: number | undefined = await steamLibrary.getPlayersCount(appId)
        var appDetails: App.Data = await steamLibrary.getAppDetails(appId)
        var appName: string = appDetails.name
        mgs.channel.send(` \`\`\`Jogo: ${appName}\nAppID: ${appId}\nQuantidade de jogadores: ${toolLibrary.formatNumber(playersCount)} \`\`\` `)
    }
    else
    {
        mgs.channel.send("Jogo não encontrado.")
    }
}

export var Usage = "!steamplayers <nomedojogo>"
export var Info = "Retorna a quantidade atual de jogadores de um jogo."