import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type UserHash = string;
export type UserRole = { 'NGO' : null } |
  { 'Beneficiary' : null } |
  { 'Donor' : null } |
  { 'Admin' : null } |
  { 'Pending' : null };
export interface _SERVICE {
  'addUser' : ActorMethod<[UserHash, UserRole], boolean>,
  'bootstrapInitialAdmin' : ActorMethod<[UserHash], boolean>,
  'getUserRole' : ActorMethod<[UserHash], [] | [UserRole]>,
  'listUsers' : ActorMethod<[], Array<[UserHash, UserRole]>>,
  'listVerifiedBeneficiaries' : ActorMethod<[], Array<UserHash>>,
  'listVerifiedNGOs' : ActorMethod<[], Array<UserHash>>,
  'verifyUser' : ActorMethod<[UserHash, UserHash, UserRole], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
