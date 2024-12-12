export enum EApp {
   Admin = 'admin',
   User = 'user',
}

export enum EUserApp {
   SuperAdmin = 'SuperAdmin',
   Seller = 'Seller',
   Owner = 'Owner',
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

export enum EProductStatus {
   InTransitFromSupplier = 'InTransitFromSupplier',
   AwaitingRestock = 'AwaitingRestock',
   Discontinued = 'Discontinued',
   AvailableOrder = 'AvailableOrder', //NOTE: this can be for both back ordering or drop-shipping
   SupplierOutOfStock = 'SupplierOutOfStock',
   InStock = 'InStock',
   OutOfStock = 'OutOfStock',
   FindingNewSupplier = 'FindingNewSupplier',
   ShortStock = 'ShortStock',
   RequireReplenishment = 'RequireReplenishment',
}

//TODO: separate stock_unit if specific status per unit is needed
export enum EProductUnitStatus {
   Available = 'Available',
   Damaged = 'Damaged',
   Wasted = 'Wasted',
   WaitingWarranty = 'WaitingWarranty',
   ReturnedToSupplier = 'ReturnedToSupplier',
   Sold = 'Sold',
   InTransitFromSupplier = 'InTransitFromSupplier',
   InTransitToCustomer = 'InTransitToCustomer',
   Expired = 'Expired',
   Consigned = 'Consigned',
}

export enum EProcurementStatus {
   Pending = 'Pending',
   Approved = 'Approved',
   Ordered = 'Ordered',
   InTransit = 'InTransit',
   Delivered = 'Delivered',
   InspectionProgress = 'InspectionProgress',
   Cancelled = 'Cancelled',
   Returned = 'Returned',
   Completed = 'Completed',
}

export enum EInspectionStatus {
   Pending = 'Pending',
   Approved = 'Approved',
   InProgress = 'InProgress',
   Passed = 'Passed',
   Failed = 'Failed',
   ReInspectionRequired = 'ReInspectionRequired',
   Cancelled = 'Cancelled',
}

export enum ELocationStatus {
   Open = 'Open',
   Closed = 'Closed',
   UnderMaintenance = 'UnderMaintenance',
}

export enum ETmpBlock {
   WrongPassF = 'WrongPassF',
   WrongPassS = 'WrongPassS',
   WrongPassT = 'WrongPassT',
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
   Id = 'Id',
   Boolean = 'Boolean',
   URL = 'URL',
   Datetime = 'Datetime',
   Number = 'Number',
   Phone = 'Phone',
}

export enum ECategory {
   Merchant = 'Merchant',
   UserRole = 'UserRole',
   Product = 'Product',
   Campaign = 'Campaign',
   PaymentMethod = 'PaymentMethod',
   Price = 'Price',
   Expense = 'Expense',
   Locality = 'Locality',
   AdministrativeArea = 'AdministrativeArea',
   StateProvince = 'StateProvince',
   Country = 'Country',
   Unit = 'Unit',
   ProductTag = 'ProductTag',
   ProductVariantTag = 'ProductVariantTag',
   ProductUnitTag = 'ProductUnitTag',
   PayrollAdjustment = 'PayrollAdjustment',
   MerchantTag = 'MerchantTag',
   CustomerTag = 'CustomerTag',
   PartnerTag = 'PartnerTag',
   Ingredient = 'Ingredient',
   Procurement = 'Procurement',
   Inspection = 'Inspection',
}

export enum EExpenseScope {
   WholeBusiness = 'WholeBusiness',
   ProductCategory = 'ProductCategory',
   ProductTag = 'ProductTag',
   WholeProduct = 'WholeProduct',
   PerUnitProduct = 'PerUnitProduct',
   Procurement = 'Procurement',
}

export enum EEntityMetadata {
   Option = 'Option',
   Merchant = 'Merchant',
   MerchantUser = 'MerchantUser',
   Admin = 'Admin',
   Customer = 'Customer',
}

export enum EPriceAdjustment {
   StockLevelLower = 'StockLevelLower',
   StockLevelHigher = 'StockLevelHigher',
   Volume = 'Volume',
   Time = 'Time',
   Tier = 'Tier',
   Bundle = 'Bundle',
   Spend = 'Spend',
   PaymentMethod = 'PaymentMethod',
   Currency = 'Currency',
}

export enum EMerchantAllowanceBenefit {
   Product = 'Product',
   Point = 'Point',
   Cash = 'Cash',
   Discount = 'Discount',
}

export enum EProduct {
   Subscription = 'Subscription',
   Depleting = 'Depleting',
   NonDepleting = 'NonDepleting',
}

export enum EAccumulatedAllowance {
   Subscription = 'Subscription',
   Depleting = 'Depleting',
   NonDepleting = 'NonDepleting',
}

export enum ECustomerAllowance {
   Point = 'Point',
   Cash = 'Cash',
   Allowance = 'Allowance',
}

export enum EMfa {
   Mobile = 'Mobile',
   Mail = 'Mail',
}

export enum EDocumentPermission {
   Branch = 'Branch',
   Warehouse = 'Warehouse',
   Section = 'Section',
   Shelf = 'Shelf',
}

export enum EClientPermission {}
