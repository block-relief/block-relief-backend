const idlFactory = ({ IDL }) => {
  const DonationStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'Released' : IDL.Null,
    'Locked' : IDL.Null,
  });
  const Donation = IDL.Record({
    'status' : DonationStatus,
    'donationId' : IDL.Text,
    'disasterId' : IDL.Opt(IDL.Text),
    'donorId' : IDL.Text,
    'amount' : IDL.Float64,
    'proposalId' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'approveAid' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'getDonation' : IDL.Func([IDL.Text], [IDL.Opt(Donation)], ['query']),
    'requestAid' : IDL.Func([IDL.Text, IDL.Text, IDL.Float64], [IDL.Bool], []),
    'storeDisasterDonation' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Float64],
        [IDL.Text],
        [],
      ),
    'storeDonation' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Float64],
        [IDL.Text],
        [],
      ),
  });
};
const init = ({ IDL }) => { return []; };
module.exports = { idlFactory, init };
