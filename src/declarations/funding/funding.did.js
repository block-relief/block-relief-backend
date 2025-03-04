const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'approveAid' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'requestAid' : IDL.Func([IDL.Text, IDL.Text, IDL.Float64], [IDL.Bool], []),
  });
};
const init = ({ IDL }) => { return []; };
module.exports = { idlFactory, init };
