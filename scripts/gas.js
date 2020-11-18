const IOST = require("@kunroku/iost");

const iost_config = require("../config/iost.json");
const { id, secret_key } = require("../config/account.json");

const amount_in_args = process.argv.find(e => e.startsWith("amount:"));
if (!amount_in_args)
  throw new Error("amount not found in args");

const amount = Number(amount_in_args.replace("amount:", ""));
if (Number.isNaN(amount))
  throw new Error("amount is NaN");

const iost = new IOST(iost_config);
const account = new IOST.Account(id);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secret_key));
account.addKeyPair("active", kp);
iost.setPublisher(account);

const tx = iost.contract.gas.pledge(account.id, account.id, amount);

const handler = iost.signAndSend(tx);
handler.listen({ irreversible: true });
handler.onSuccess(console.log);
handler.onFailed(console.log);
