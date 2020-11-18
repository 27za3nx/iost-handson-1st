class Warikan {
  init() {
    // when this contract is published,
    // this function will be executed only once
    storage.put("freeze", "false");
  }
  /**
   * when this contract is freezed,
   * this contarct's publisher can update
   * @param {string} data 
   * @returns {boolean}
   */
  can_update(data) {
    this._require_owner_auth();
    this._require_freezed();
    return true;
  }
  /**
   * when this contract is freezed,
   * you cannot use normal services
   * and you can update this contract
   */
  freeze() {
    this._require_owner_auth();
    this._require_unfreezed();
    storage.put("freeze", "true");
  }
  /**
   * when this contract is unfreezed,
   * you can use normal services
   * and you cannnot update this contract
   */
  unfreeze() {
    this._require_owner_auth();
    this._require_freezed();
    storage.put("freeze", "false");
  }
  /**
   * create new payment
   * @param {string} payment_id 
   * @param {string} total_amount_str 
   * @param {number} payers_length 
   */
  set(payment_id, total_amount_str, payers_length) {
    this._require_unfreezed();
    if (storage.mapHas("payment", payment_id))
      throw new Error("payment_id_already_exists");
    const total_amount = Number(total_amount_str);
    if (total_amount < 0)
      throw new Error("invalid_total_amount");
    if (payers_length < 1 || 30 < payers_length)
      throw new Error("invalid_payers_length");
    const unit_amount = this._calc_unit_amount(total_amount, payers_length);
    storage.mapPut("payment", payment_id, JSON.stringify({
      unit_amount,
      receiver: tx.publisher,
      payers: [],
      payers_length
    }));
  }
  /**
   * pay segmented fee
   * @param {string} payment_id 
   */
  pay(payment_id) {
    this._require_unfreezed();
    const payment_info = JSON.parse(storage.mapGet("payment", payment_id));
    if (!payment_info)
      throw new Error("payment_not_found");
    if (payment_info.payers.length === payment_info.payers_length)
      throw new Error("already_payment_completed");
    // if you don't allow duplicated pay,
    // please turn off comment out of under 2 lines
    // if (payment_info.payers.indexOf(tx.publisher) !== -1)
    //   throw new Error("already_payed");
    blockchain.deposit(
      tx.publisher,
      payment_info.unit_amount.toString(),
      `warikan deposit :${payment_id}`
    );
    payment_info.payers.push(tx.publisher);
    storage.mapPut("payment", payment_id, JSON.stringify(payment_info));
  }
  /**
   * check payment and withdraw fee
   * @param {string} payment_id 
   */
  check(payment_id) {
    this._require_unfreezed();
    const payment_info = JSON.parse(storage.mapGet("payment", payment_id));
    if (!payment_info)
      throw new Error("payment_not_found");
    if (payment_info.payers.length !== payment_info.payers_length)
      throw new Error("payment not completed");
    blockchain.withdraw(
      payment_info.receiver,
      (payment_info.unit_amount * payment_info.payers_length).toString(),
      `warikan check: ${payment_id}`
    );
    storage.mapDel("payment", payment_id);
    storage.mapDel("payers", payment_id);
    blockchain.receipt(JSON.stringify(payment_info));
  }
  /**
   * 
   */
  _require_freezed() {
    if (storage.get("freeze") !== "true")
      throw new Error("contract_unfreezed");
  }
  /**
   * 
   */
  _require_unfreezed() {
    if (storage.get("freeze") !== "false")
      throw new Error("contract_freezed");
  }
  /**
   * 
   */
  _require_owner_auth() {
    if (!blockchain.requireAuth(blockchain.contractOwner(), "active"))
      throw new Error("permission_denied");
  }
  /**
   * calculate total_amount and payers_length to unit_amount
   * @param {number} total_amount 
   * @param {number} payers_length 
   */
  _calc_unit_amount(total_amount, payers_length) {
    return Number((total_amount / payers_length).toFixed(4));
  }
}
module.exports = Warikan;