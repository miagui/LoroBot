import { Client, Message } from "discord.js";

export function run (client: Client, mgs: Message ,cmd: string, args: string)
{
    mgs.channel.bulkDelete(Number.parseInt(args));
}

export var Usage = "!bulkdelete <quantidade>`"
export var Info = "Deleta mensagens em massa especificando o `quantidade`"