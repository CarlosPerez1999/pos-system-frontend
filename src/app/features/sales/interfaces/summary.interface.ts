import { Product } from "../../../core/models/product.model"
import { User } from "../../../core/models/user.model"

export interface Summary {
    totalSales: number
    totalRevenue: number
    dayRevenue: number
    averageTicket: number
    topProducts: {
        name: string;
        quantity: number;
    }[]
}
