import fs from "fs";
import { Client, Message } from 'discord.js'
// * Esses tipos facilitam na manipulação dos json resgatados..
import { App } from '../interfaces/ISteamSchema'
import fetch from "node-fetch"
import $ from 'cheerio'

const ROOT = require('path').dirname(require.main?.filename);

export function run(client: Client, msg: Message, cmd: string, args: string) {
     // * Busca na própria engine de search da Steam. Aqui é feito Scrap da página.
     fetch(`https://store.steampowered.com/search/?term=${args}`)
          .then(res => res.text())
          .then(body => {
               // * Busca o primeiro AppID da página que for do atributo
               // * 'data-ds-appid' e estiver como um filho elemento de ID search_resultRows.
               var appId = $('a', '#search_resultsRows', body).attr('data-ds-appid')

               // * Se for encontrado, prossiga com a operação.
               // * Caso contrário mande mensagem de que não encontrou o jogo.
               if (appId) {
                    fetch(`https://store.steampowered.com/api/appdetails/?appids=${appId}`)
                         .then(res => res.json())
                         .then(body => {
                              var app: App.Data = body[appId!].data;
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
                                   if (discount == 0) {
                                        reply = reply.concat(`Preço: ${finalPrice} (Sem desconto no momento).\n`)
                                   }
                                   else {
                                        reply = reply.concat(`Preço: ~~${initialPrice} ~~${finalPrice} (${discount}% de desconto).\n`)
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
                              reply = reply.concat(`https://store.steampowered.com/app/${appId}`)
                              msg.channel.send(reply)
                         })
               }
               else 
               {
                    msg.channel.send("Jogo não encontrado.")
               }
          })
}
export var Usage = "!store `<nomedojogo>`"
export var Info = "Busca por um jogo na Steam."