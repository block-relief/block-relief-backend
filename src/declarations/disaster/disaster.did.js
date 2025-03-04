const idlFactory = ({ IDL }) => {
  const DisasterStatus = IDL.Variant({
    'Assessed' : IDL.Null,
    'Reported' : IDL.Null,
    'Resolved' : IDL.Null,
    'Verified' : IDL.Null,
  });
  const DisasterRecord = IDL.Record({
    'status' : DisasterStatus,
    'disasterId' : IDL.Text,
    'description' : IDL.Text,
    'reporter' : IDL.Text,
    'location' : IDL.Text,
    'estimatedDamageCost' : IDL.Float64,
  });
  return IDL.Service({
    'getAllDisasters' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, DisasterRecord))],
        ['query'],
      ),
    'getDisaster' : IDL.Func([IDL.Text], [IDL.Opt(DisasterRecord)], ['query']),
    'reportDisaster' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Float64, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'updateDisasterStatus' : IDL.Func(
        [IDL.Text, DisasterStatus],
        [IDL.Bool],
        [],
      ),
  });
};
const init = ({ IDL }) => { return []; };
module.exports = { idlFactory, init };
