const IOST = require("@kunroku/iost");
const iost_config = require("../config/iost.json");
const { id, secret_key } = require("../config/account.json");
const { address } = require("../config/contract.json");
const parse_args = require('./parse_args');

if (!address)
  throw new Error("contract not deployed");

const { pid, amount, length } = parse_args({
  pid: (value) => {
    return value;
  },
  amount: (value) => {
    if (Number.isNaN(Number(value)))
      throw new Error("amount is required number type");
    return value;
  },
  length: (value) => {
    if (!Number.isInteger(Number(value)))
      throw new Error("length is required integer type");
    return Number(value);
  }
});

const iost = new IOST(iost_config);
const account = new IOST.Account(id);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secret_key));
account.addKeyPair("active", kp);
iost.setPublisher(account);
const tx = iost.call(address, "set", [pid, amount, length]);

const handler = iost.signAndSend(tx);
handler.listen({ irreversible: true });
handler.onSuccess(console.log);
handler.onFailed(console.log);
