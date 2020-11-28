const IOST = require("@kunroku/iost");
const iost_config = require("../config/iost.json");

const parse_args = require('./parse_args');

const { id } = parse_args({
  id: value => value
});

const iost = new IOST(iost_config);
iost.rpc.blockchain.getBalance(id).then(({ balance }) => {
  console.log(balance);
})
