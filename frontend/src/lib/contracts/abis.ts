export const erc20Abi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;

export const nomaScheduleRegistryAbi = [
  {
    type: "function",
    name: "createPlan",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "payoutSink", type: "address" },
      { name: "beneficiaryRef", type: "bytes32" },
      { name: "amountPerExecution", type: "uint96" },
      { name: "maxTotalSpend", type: "uint96" },
      { name: "schedule", type: "uint8" },
      { name: "dayOfMonth", type: "uint8" },
      { name: "firstExecutionAt", type: "uint64" },
    ],
    outputs: [{ name: "planId", type: "uint256" }],
  },
  {
    type: "function",
    name: "executePlan",
    stateMutability: "nonpayable",
    inputs: [{ name: "planId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "nextPlanId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;

/** Matches `NomaScheduleRegistry.ScheduleKind`. */
export const ScheduleKind = {
  OneTime: 0,
  Monthly: 1,
  Weekly: 2,
} as const;
