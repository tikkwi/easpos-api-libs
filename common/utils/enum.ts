export enum EApp {
   Admin = 'admin',
   User = 'user',
}

export enum EUserApp {
   SuperAdmin = 'SuperAdmin',
   Seller = 'Seller',
   Admin = 'Admin',
   Partner = 'Partner',
   Customer = 'Customer',
}

//service name
export enum EAuthCredential {
   AdminRpc = 'admin_rpc',
   Swagger = 'swagger',
   Admin = 'admin',
   Merchant = 'merchant',
}

// export enum ESubscription {
//    Demo = 'Demo',
//    Offline = 'Offline',
//    Dedicated = 'Dedicated', //NOTE: dedicated server & db
//    SharedSubscription = 'SharedSubscription',
// }

export enum EStatus {
   Pending = 'Pending',
   Active = 'Active',
   Approved = 'Approved',
   Expired = 'Expired',
   Blocked = 'Blocked',
   Rejected = 'Rejected',
   Suspended = 'Suspended',
   Stale = 'Stale',
   Queuing = 'Queuing',
}

export enum ETmpBlock {
   WrongPassF = 'WrongPassF',
   WrongPassS = 'WrongPassS',
   WrongPassT = 'WrongPassT',
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
   Partner = 'Partner',
}

export enum EAllowedUser {
   Any = 'Any',
   Admin = 'Admin',
   Merchant = 'Merchant',
   Customer = 'Customer',
   Partner = 'Partner',
   MerchantNoVerified = 'MerchantNoVerified',
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
   Datetime = 'Datetime',
   Address = 'Address',
   Number = 'Number',
   Phone = 'Phone',
   Color = 'Color',
}

export enum ECategory {
   Merchant = 'Merchant',
   UserRole = 'UserRole',
   Product = 'Product',
   ProductTag = 'ProductTag',
   Campaign = 'Campaign',
   PaymentMethod = 'PaymentMethod',
   Price = 'Price',
   Expense = 'Expense',
   Locality = 'Locality',
   AdministrativeArea = 'AdministrativeArea',
   StateProvince = 'StateProvince',
   Country = 'Country',
   Unit = 'Unit',
}

export enum EExpenseScope {
   WholeBusiness = 'WholeBusiness',
   ProductCategory = 'ProductCategory',
   ProductTag = 'ProductTag',
   WholeProduct = 'WholeProduct',
   PerUnitProduct = 'PerUnitProduct',
}

export enum EEntityMetadata {
   Option = 'Option',
   Merchant = 'Merchant',
   MerchantUser = 'MerchantUser',
   Admin = 'Admin',
   Customer = 'Customer',
}

export enum EAllowanceBenefit {
   Point = 'Point',
   Cash = 'Cash',
   Product = 'Product',
   Discount = 'Discount',
}

export enum ETime {
   Hour = 'Hour',
   Day = 'Day',
   Week = 'Week',
   Month = 'Month',
}

export enum EAllowance {
   TimeBased = 'TimeBased',
   StockLevel = 'StockLevel', //NOTE: validate if applicable product have
   VolumeLevel = 'VolumeLevel',
   TierBased = 'TierBased',
   Geographic = 'Geographic',
   Bundle = 'Bundle',
   SpendBase = 'SpendBase',
   TotalSpendBase = 'TotalSpendBase',
   PaymentMethod = 'PaymentMethod',
   Currency = 'Currency',
}

export enum EProduct {
   Subscription = 'Subscription',
   Depleting = 'Depleting',
   NonDepleting = 'NonDepleting',
}
