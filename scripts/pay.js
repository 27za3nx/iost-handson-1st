const IOST = require("@kunroku/iost");
const iost_config = require("../config/iost.json");
const { id, secret_key } = require("../config/account.json");
const { address } = require("../config/contract.json");

if (!address)
  throw new Error("contract not deployed");

const [payment_id] = JSON.parse(process.argv[2]);
if (!payment_id)
  throw new Error("payment_id invalid");

const iost = new IOST(iost_config);
const account = new IOST.Account(id);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secret_key));
account.addKeyPair("active", kp);
iost.setPublisher(account);
iost.rpc.blockchain.getContractStorage(address, "payment", payment_id).then(({ data }) => {
  const info = JSON.parse(data);
  if (!info)
    throw new Error("payment not found");
  const amount = info.unit_amount;
  const tx = iost.call(address, "pay", [payment_id]);
  tx.addApprove("iost", amount);
  const handler = iost.signAndSend(tx);
  handler.listen({ irreversible: true });
  handler.onSuccess(console.log);
  handler.onFailed(console.log);
});
