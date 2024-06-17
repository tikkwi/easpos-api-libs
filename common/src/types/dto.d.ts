type AuthUser = {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  mail: string;
  status: EStatus;
  isOwner: boolean;
  type: EUser;
  merchant?: { id: string; dbUri?: string; isSubActive: boolean };
  metadata: any;
};
