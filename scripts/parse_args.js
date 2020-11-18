/**
 * 
 * @param {{ [key: string]: (value: string) => void }} validators 
 */
module.exports = function (validators) {
  const args_object = {};
  Object.keys(validators).map(key => {
    const identifier = `${key}:`;
    const value = process.argv.find(e => e.startsWith(identifier));
    if (!value)
      throw new Error(`${key} not found in args`);
    const fixed_value = value.replace(identifier, '');
    validators[key](fixed_value);
    args_object[key] = fixed_value;
  });
  return args_object;
}