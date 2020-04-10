import fs from "fs";
import { Client, Message } from 'discord.js'
// * Esses tipos facilitam na manipulação dos json resgatados..
import { App } from '../interfaces/ISteamSchema'
import fetch from "node-fetch"
import $ from 'cheerio'
import * as steamLibrary from '../library/steamFunctions'
import { weeksBetween } from "../library/helperFunctions";

const ROOT = require('path').dirname(require.main?.filename);

export async function run(client: Client, msg: Message, cmd: string, args: string) {
     // * Busca na própria engine de search da Steam. Aqui é feito Scrap da página.
     var appId = await steamLibrary.buscarAppId(args);
     if (appId) {

          var app: App.Data = await steamLibrary.getAppDetails(appId);
          var reply: string = `Encontrado o jogo ${app.name}.\n`;

          // * Verifica se existe a propriedade de preço no jogo.
          if (app.price_overview) 
          {
               var initialPrice: string | undefined = app.price_overview.initial_formatted;
               var finalPrice: string | undefined = app.price_overview.final_formatted;
               var discount: number | undefined = app.price_overview.discount_percent;
          }

          // * Verifica se o jogo é F2P ou não.
          if (app.is_free) 
          {
               reply = reply.concat("Free To Play\n");
          }
          else if (!app.is_free && !app.price_overview) 
          {
               reply = reply.concat("Sem preço encontrado.\n");
          }
          else {
               // * Adiciona a queda histórica, buscada do GG Deals.
               if (discount == 0) 
               {
                    reply = reply.concat(`Preço: ${finalPrice} (Sem desconto no momento).\n`)
               }
               else 
               {
                    reply = reply.concat(`Preço: ~~${initialPrice} ~~${finalPrice} (${discount}% de desconto).\n`)
               }

               var historicalLow: [string, Date] = await steamLibrary.getHistoricalLow(app.name)
               var lowestPrice: string = historicalLow[0]
               var lastTime: number = weeksBetween(historicalLow[1], new Date())
               reply = reply.concat(`Queda histórica: ${lowestPrice} (${lastTime} semanas atrás).\n`)
          }

          // * Verifica se o jogo já foi lançado ou não.
          if (app.release_date.coming_soon) 
          {
               reply = reply.concat(`Lançamento em breve.\n`);
          }
          else 
          {
               reply = reply.concat(`Data de lançamento: ${app.release_date.date}\n`);
          }

          
          // * Adiciona o link da página da steam do jogo.
          reply = reply.concat(`https://store.steampowered.com/app/${appId}`)
          msg.channel.send(reply)
     }
     else 
     {
          msg.channel.send("Jogo não encontrado.")
     }


}
export var Usage = "!store `<nomedojogo>`"
export var Info = "Busca por um jogo na Steam."