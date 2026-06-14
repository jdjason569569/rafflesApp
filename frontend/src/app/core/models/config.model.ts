export interface SystemConfig {
  configId: string;
  updatedBy: string;
  totalNumbersQuantity: number;
  soldNumbersCount: number;
  pricePerNumber: number;
  currency: string;
  packages: number[];
  updatedAt: string;
}

export interface PackageOption {
  quantity: number;
  totalPrice: number;
  pricePerNumber: number;
  currency: string;
}

export interface PreOrderBuyer {
  fullName: string;
  email: string;
  phone: string;
}

export interface PreOrder {
  preOrderId: string;
  expiresAt: string;
  buyer: PreOrderBuyer;
  package: {
    type: string;
    quantity: number;
    totalAmount: number;
    currency: string;
  };
  assignedNumbers: string[];
  status: 'AWAITING_PAYMENT' | 'PAID' | 'CANCELLED' | 'EXPIRED';
}

