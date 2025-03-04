const idlFactory = ({ IDL }) => {
  const VerificationStatus = IDL.Variant({
    'Rejected' : IDL.Null,
    'Verified' : IDL.Null,
    'Pending' : IDL.Null,
  });
  return IDL.Service({
    'getBeneficiaryStatus' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(VerificationStatus)],
        ['query'],
      ),
    'getDisasterStatus' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(VerificationStatus)],
        ['query'],
      ),
    'getNGOStatus' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(VerificationStatus)],
        ['query'],
      ),
    'listVerifiedBeneficiaries' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'listVerifiedNGOs' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'rejectBeneficiary' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'rejectNGO' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'verifyBeneficiary' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'verifyDisaster' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'verifyNGO' : IDL.Func([IDL.Text], [IDL.Bool], []),
  });
};
const init = ({ IDL }) => { return []; };
module.exports = { idlFactory, init };
