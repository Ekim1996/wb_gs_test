export interface WbBoxTariff {
  id?: number; 
  boxDeliveryBase: string;
  boxDeliveryCoefExpr?: string | null;
  boxDeliveryLiter: string;
  boxDeliveryMarketplaceBase: string;
  boxDeliveryMarketplaceCoefExpr?: string | null;
  boxDeliveryMarketplaceLiter: string;
  boxStorageBase: string;
  boxStorageCoefExpr?: string | null;
  boxStorageLiter: string;
  geoName: string;
  warehouseName: string;
  createdAt?: string; 
  updatedAt?: string;
}