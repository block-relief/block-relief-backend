import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Donation {
  'status' : DonationStatus,
  'donationId' : string,
  'disasterId' : [] | [string],
  'donorId' : string,
  'amount' : number,
  'proposalId' : [] | [string],
}
export type DonationStatus = { 'Failed' : null } |
  { 'Released' : null } |
  { 'Locked' : null };
export interface _SERVICE {
  'approveAid' : ActorMethod<[string], boolean>,
  'getDonation' : ActorMethod<[string], [] | [Donation]>,
  'requestAid' : ActorMethod<[string, string, number], boolean>,
  'storeDisasterDonation' : ActorMethod<
    [string, string, string, number],
    string
  >,
  'storeDonation' : ActorMethod<[string, string, string, number], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
