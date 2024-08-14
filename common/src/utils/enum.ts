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
   AdminRpc = 'admin_rpc',
   Swagger = 'swagger',
   Admin = 'admin',
   Merchant = 'merchant',
}

export enum ESubscription {
   Demo = 'Demo',
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
   MerchantNoSub = 'MerchantNoSub',
   Owner = 'Owner',
}

export enum EGrpcAuth {
   Basic = 'Basic',
   Token = 'Token',
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

export enum ECategory {
   Option = 'Option',
   Merchant = 'Merchant',
   MerchantUserRole = 'MerchantUserRole',
   Admin = 'Admin',
   Product = 'Product',
   ProductTag = 'ProductTag',
   Campaign = 'Campaign',
}

export enum EEntityMetadata {
   Option = 'Option',
   Merchant = 'Merchant',
   MerchantUser = 'MerchantUser',
   Admin = 'Admin',
   Customer = 'Customer',
}

export enum EAllowanceTrigger {
   Point = 'Point',
   AmountSpend = 'AmountSpend',
   BuyTogether = 'BuyTogether',
}

export enum EAllowanceType {
   Point = 'Point',
   Cash = 'Cash',
   Product = 'Product',
   Discount = 'Discount',
}
