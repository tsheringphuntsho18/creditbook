
import { ShopType } from "./types";

export const SHOP_TYPE_OPTIONS: { value: ShopType; label: string }[] = [
    { value: ShopType.GROCERY, label: 'Grocery' },
    { value: ShopType.HARDWARE, label: 'Hardware' },
    { value: ShopType.PHARMACY, label: 'Pharmacy' },
    { value: ShopType.GENERAL_STORE, label: 'General Store' },
    { value: ShopType.OTHER, label: 'Other' },
];
