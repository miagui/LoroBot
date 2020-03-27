"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function run(client, mgs, cmd, args) {
    mgs.channel.bulkDelete(Number.parseInt(args));
}
exports.run = run;
exports.Usage = "!bulkdelete <quantidade>`";
exports.Info = "Deleta mensagens em massa especificando o `quantidade`";
