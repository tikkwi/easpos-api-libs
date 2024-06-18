type AuthUser = {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  mail: string;
  status: EStatus;
  isOwner: boolean;
  type: EUser;
  merchant?: string;
  metadata: any;
};
