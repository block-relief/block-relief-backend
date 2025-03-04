import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Milestone {
  'milestoneId' : bigint,
  'amount' : number,
  'isReleased' : boolean,
}
export interface Proposal {
  'isCompleted' : boolean,
  'ngoId' : string,
  'totalAmount' : number,
  'proposalId' : string,
  'milestones' : Array<Milestone>,
}
export interface _SERVICE {
  'createProposal' : ActorMethod<
    [string, string, number, Array<Milestone>],
    boolean
  >,
  'getProposal' : ActorMethod<[string], [] | [Proposal]>,
  'listAllProposals' : ActorMethod<[], Array<string>>,
  'markProposalCompleted' : ActorMethod<[string], boolean>,
  'releaseFunds' : ActorMethod<[string, bigint], boolean>,
  'withdrawRemainingFunds' : ActorMethod<[string], [] | [number]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
