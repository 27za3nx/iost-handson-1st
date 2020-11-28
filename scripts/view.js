const IOST = require("@kunroku/iost");
const iost_config = require("../config/iost.json");
const { address } = require("../config/contract.json");
const parse_args = require('./parse_args');

if (!address)
  throw new Error("contract not deployed");

const { pid } = parse_args({
  pid: (value) => {
    return value;
  }
});

const iost = new IOST(iost_config);
iost.rpc.blockchain.getContractStorage(address, "payment", pid).then(({ data }) => {
  const info = JSON.parse(data);
  console.log(info);
});
