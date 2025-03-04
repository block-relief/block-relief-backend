const idlFactory = ({ IDL }) => {
  const UserHash = IDL.Text;
  const UserRole = IDL.Variant({
    'NGO' : IDL.Null,
    'Beneficiary' : IDL.Null,
    'Donor' : IDL.Null,
    'Admin' : IDL.Null,
    'Pending' : IDL.Null,
  });
  return IDL.Service({
    'addUser' : IDL.Func([UserHash, UserRole], [IDL.Bool], []),
    'bootstrapInitialAdmin' : IDL.Func([UserHash], [IDL.Bool], []),
    'getUserRole' : IDL.Func([UserHash], [IDL.Opt(UserRole)], ['query']),
    'listUsers' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(UserHash, UserRole))],
        ['query'],
      ),
    'listVerifiedBeneficiaries' : IDL.Func([], [IDL.Vec(UserHash)], ['query']),
    'listVerifiedNGOs' : IDL.Func([], [IDL.Vec(UserHash)], ['query']),
    'verifyUser' : IDL.Func([UserHash, UserHash, UserRole], [IDL.Bool], []),
  });
};
const init = ({ IDL }) => { return []; };
module.exports = { idlFactory, init };
