const IOST = require("@kunroku/iost");
const fs = require("fs");
const iost_config = require("../config/iost.json");
const { id, secret_key } = require("../config/account.json");
const { name, address } = require("../config/contract.json");

if (!address)
  throw new Error("contract not deployed");

const iost = new IOST({
  ...iost_config,
  gasLimit: 4000000
});
const account = new IOST.Account(id);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secret_key));
account.addKeyPair("active", kp);
iost.setPublisher(account);

const source = fs.readFileSync(`contract/${name}.js`, "utf-8");
const abi = JSON.parse(fs.readFileSync(`contract/${name}.js.abi`, "utf-8"));
const tx = iost.createTx();
iost.call(address, "freeze", [], tx);
iost.contract.system.updateCode(source, abi, address, "", tx);
iost.call(address, "unfreeze", [], tx);
const handler = iost.signAndSend(tx);
handler.listen({ irreversible: true });
handler.onSuccess(console.log);
handler.onFailed(console.log);
