const IOST = require("@kunroku/iost");
const fs = require("fs");
const iost_config = require("../config/iost.json");
const { id, secret_key } = require("../config/account.json");
const { name: contract_name, address: current_contract_address } = require("../config/contract.json");

if (current_contract_address)
  throw new Error("contract already deployed");

const iost = new IOST({
  ...iost_config,
  gasLimit: 4000000
});
const account = new IOST.Account(id);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secret_key));
account.addKeyPair("active", kp);
iost.setPublisher(account);

const source = fs.readFileSync(`contract/${contract_name}.js`, "utf-8");
const abi = JSON.parse(fs.readFileSync(`contract/${contract_name}.js.abi`, "utf-8"));
const tx = iost.contract.system.setCode(source, abi);

const handler = iost.signAndSend(tx);
handler.listen({ irreversible: true });
handler.onSuccess(res => {
  const contract_address = JSON.parse(res.returns[0])[0];
  fs.writeFileSync("config/contract.json", JSON.stringify({
    name: contract_name,
    address: contract_address
  }), "utf-8");
  console.log(res);
});
handler.onFailed(console.log);
