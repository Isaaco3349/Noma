export type SavedRecipient = {
  id: string;
  /** Matches parser labels e.g. Mum, Sister */
  nickname: string;
  location: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
  paystackRecipientCode: string;
  createdAt: number;
};
