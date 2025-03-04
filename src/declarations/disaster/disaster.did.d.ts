import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface DisasterRecord {
  'status' : DisasterStatus,
  'disasterId' : string,
  'description' : string,
  'reporter' : string,
  'location' : string,
  'estimatedDamageCost' : number,
}
export type DisasterStatus = { 'Assessed' : null } |
  { 'Reported' : null } |
  { 'Resolved' : null } |
  { 'Verified' : null };
export interface _SERVICE {
  'getAllDisasters' : ActorMethod<[], Array<[string, DisasterRecord]>>,
  'getDisaster' : ActorMethod<[string], [] | [DisasterRecord]>,
  'reportDisaster' : ActorMethod<
    [string, string, string, number, string],
    boolean
  >,
  'updateDisasterStatus' : ActorMethod<[string, DisasterStatus], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
