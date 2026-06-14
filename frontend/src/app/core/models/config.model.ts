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
