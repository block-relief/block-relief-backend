import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type VerificationStatus = { 'Rejected' : null } |
  { 'Verified' : null } |
  { 'Pending' : null };
export interface _SERVICE {
  'getBeneficiaryStatus' : ActorMethod<[string], [] | [VerificationStatus]>,
  'getDisasterStatus' : ActorMethod<[string], [] | [VerificationStatus]>,
  'getNGOStatus' : ActorMethod<[string], [] | [VerificationStatus]>,
  'listVerifiedBeneficiaries' : ActorMethod<[], Array<string>>,
  'listVerifiedNGOs' : ActorMethod<[], Array<string>>,
  'rejectBeneficiary' : ActorMethod<[string], boolean>,
  'rejectNGO' : ActorMethod<[string], boolean>,
  'verifyBeneficiary' : ActorMethod<[string], boolean>,
  'verifyDisaster' : ActorMethod<[string], boolean>,
  'verifyNGO' : ActorMethod<[string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
