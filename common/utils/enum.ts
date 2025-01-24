export enum EApp {
   Admin = 'admin',
   User = 'user',
}

export enum EUserApp {
   SuperAdmin = 'SuperAdmin',
   Seller = 'Seller',
   Admin = 'Admin',
   Employee = 'Employee',
   Partner = 'Partner',
   Customer = 'Customer',
}

//base name
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
   Employee = 'Employee',
   Customer = 'Customer',
   Partner = 'Partner',
}

export enum EAllowedUser {
   Any = 'Any',
   Admin = 'Admin',
   Employee = 'Employee',
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
   PaymentProvider = 'PaymentProvider',
   AppSubscriptionType = 'AppSubscriptionType',
   Price = 'Price',
   Expense = 'Expense',
   Locality = 'Locality',
   AdministrativeArea = 'AdministrativeArea',
   StateProvince = 'StateProvince',
   Country = 'Country',
   Unit = 'Unit',
   PayrollAdjustment = 'PayrollAdjustment',
   Ingredient = 'Ingredient',
   SupplierStock = 'SupplierStock',
   Inspection = 'Inspection',
   MerchantSubscription = 'MerchantSubscription',
   EmployeeRole = 'EmployeeRole',
   ProductTag = 'ProductTag',
   ProductVariantTag = 'ProductVariantTag',
   ProductUnitTag = 'ProductUnitTag',
   MerchantTag = 'MerchantTag',
   CustomerTag = 'CustomerTag',
   PartnerTag = 'PartnerTag',
   MerchantSubscriptionTag = 'MerchantSubscriptionTag',
   PermissionTag = 'PermissionTag',
}

export enum EExpenseScope {
   WholeBusiness = 'WholeBusiness',
   WholeProduct = 'WholeProduct',
   PerUnitProduct = 'PerUnitProduct',
}

export enum EExpense {
   Administrative = 'Administrative',
   Marketing = 'Marketing',
   Sale = 'Sale',
   Finance = 'Finance',
   ResearchDevelopment = 'ResearchDevelopment',
   Tax = 'Tax',
   COGS = 'COGS',
   Operating = 'Operating',
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
   TotalSpend = 'TotalSpend',
   PaymentMethod = 'PaymentMethod',
   PaymentProvider = 'PaymentProvider',
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

export enum EType {
   String = 'String',
   Number = 'Number',
   Boolean = 'Boolean',
   Url = 'Url',
   Id = 'Id',
}
