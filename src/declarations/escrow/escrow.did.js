const idlFactory = ({ IDL }) => {
  const Milestone = IDL.Record({
    'milestoneId' : IDL.Nat,
    'amount' : IDL.Float64,
    'isReleased' : IDL.Bool,
  });
  const Proposal = IDL.Record({
    'isCompleted' : IDL.Bool,
    'ngoId' : IDL.Text,
    'totalAmount' : IDL.Float64,
    'proposalId' : IDL.Text,
    'milestones' : IDL.Vec(Milestone),
  });
  return IDL.Service({
    'createProposal' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Float64, IDL.Vec(Milestone)],
        [IDL.Bool],
        [],
      ),
    'getProposal' : IDL.Func([IDL.Text], [IDL.Opt(Proposal)], ['query']),
    'listAllProposals' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'markProposalCompleted' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'releaseFunds' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'withdrawRemainingFunds' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Float64)], []),
  });
};
const init = ({ IDL }) => { return []; };
module.exports = { idlFactory, init };
