export enum EMerchantPurchase {
  Subscription = 'Subscription',
  OneTime = 'OneTime',
  FOC = 'FOC',
}

export enum EApp {
  Admin = 'admin',
  User = 'user',
}

//service name
export enum EAuthCredential {
  Swagger = 'swagger',
  Admin = 'admin',
  Merchant = 'merchant',
}

export enum ESubscription {
  Offline = 'Offline',
  DedicatedServer = 'DedicatedServer',
  Dedicated = 'Dedicated', //NOTE: dedicated both server & db
  SharedSubscription = 'SharedSubscription',
}

export enum EStatus {
  Pending = 'Pending',
  Active = 'Active',
  Approved = 'Approved',
  Expired = 'Expired',
  Blocked = 'Blocked',
  Rejected = 'Rejected',
  Suspended = 'Suspended',
}

export enum ESchemaStatus {
  Merchant = 'Merchant',
}

export enum EMail {
  MerchantSubscriptionExpire = 'MerchantSubscriptionExpire',
  MerchantPreSubscriptionExpire = 'MerchantPreSubscriptionExpire',
}

export enum EPath {}

export enum EUser {
  Admin = 'Admin',
  Merchant = 'Merchant',
  Customer = 'Customer',
}

export enum EAllowedUser {
  Admin = 'Admin',
  Merchant = 'Merchant',
  Customer = 'Customer',
  MerchantNoSub = 'MerchantNoSub',
  Owner = 'Owner',
}

export enum EField {
  String = 'String',
  Enum = 'Enum',
  Boolean = 'Boolean',
  URL = 'URL',
  Image = 'Image',
  User = 'User',
  Merchant = 'Merchant',
  Datetime = 'Datetime',
  Address = 'Address',
  Number = 'Number',
  Phone = 'Phone',
  Color = 'Color',
}

export enum EStaff {
  General = 'General',
  Nutritionist = 'Nutritionist',
  Doctor = 'Doctor',
}

export enum ECategory {
  Option = 'Option',
  Merchant = 'Merchant',
  Admin = 'Admin',
}

export enum EEntityMetadata {
  Option = 'Option',
  Merchant = 'Merchant',
  MerchantUser = 'MerchantUser',
  Admin = 'Admin',
  Customer = 'Customer',
}
