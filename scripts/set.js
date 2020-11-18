const IOST = require("@kunroku/iost");
const iost_config = require("../config/iost.json");
const { id, secret_key } = require("../config/account.json");
const { address } = require("../config/contract.json");

if (!address)
  throw new Error("contract not deployed");

const [payment_id, total_amount_str, payers_length] = JSON.parse(process.argv[2]);
if (!payment_id)
  throw new Error("payment_id invalid");
if (!total_amount_str || Number.isNaN(Number(total_amount_str)))
  throw new Error("total_amount invalid");
if (!payers_length || Number.isNaN(payers_length))
  throw new Error("payers_length invalid");

const iost = new IOST(iost_config);
const account = new IOST.Account(id);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secret_key));
account.addKeyPair("active", kp);
iost.setPublisher(account);
const tx = iost.call(address, "set", [payment_id, total_amount_str, payers_length]);

const handler = iost.signAndSend(tx);
handler.listen({ irreversible: true });
handler.onSuccess(console.log);
handler.onFailed(console.log);
