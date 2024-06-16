export enum EMerchantPurchase {
  Subscription = 'Subscription',
  OneTime = 'OneTime',
  FOC = 'FOC',
}

export enum EApp {
  Admin = 'admin-api',
  Shared = 'shared-api',
  Inventory = 'inventory-api',
  Loyalty = 'loyalty-api',
  Merchant = 'merchant-api',
  Misc = 'misc-api',
  Payment = 'payment-api',
  Promotion = 'promotion-api',
  Report = 'report-api',
  Sale = 'sale-api',
  Supplier = 'supplier-api',
}

//service name
export enum EAuthCredential {
  Swagger = 'Swagger',
}

export enum ESubscription {
  Offline = 'Offline',
  DedicatedServer = 'DedicatedServer',
  DedicatedDB = 'DedicatedDB',
  Dedicated = 'Dedicated',
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
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  Trainer = 'Trainer',
  GeneralStaff = 'GeneralStaff',
  Nutritionist = 'Nutritionist',
  Doctor = 'Doctor',
  Member = 'Member',
  ExceedLimit = 'ExceedLimit',
}

export enum EEntityMetadata {
  Option = 'Option',
  Merchant = 'Merchant',
  MerchantUser = 'MerchantUser',
  Admin = 'Admin',
  Customer = 'Customer',
}
