const IOST = require("@kunroku/iost");
const iost_config = require("../config/iost.json");
const { id, secret_key } = require("../config/account.json");
const { address } = require("../config/contract.json");
const parse_args = require('./parse_args');

if (!address)
  throw new Error("contract not deployed");

const { pid } = parse_args({
  pid: (value) => {
  }
});

const iost = new IOST(iost_config);
const account = new IOST.Account(id);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secret_key));
account.addKeyPair("active", kp);
iost.setPublisher(account);
iost.rpc.blockchain.getContractStorage(address, "payment", pid).then(({ data }) => {
  const info = JSON.parse(data);
  if (!info)
    throw new Error("payment not found");
  const amount = info.unit_amount;
  const tx = iost.call(address, "pay", [pid]);
  tx.addApprove("iost", amount);
  const handler = iost.signAndSend(tx);
  handler.listen({ irreversible: true });
  handler.onSuccess(console.log);
  handler.onFailed(console.log);
});
