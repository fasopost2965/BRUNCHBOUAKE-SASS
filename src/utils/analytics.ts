import { Room, Transaction, TableOrder, MenuItem, StockItem } from '../types';

/**
 * Calculates the Occupancy Rate for a specific tenant.
 * Formula: (Number of occupied rooms / Total rooms) * 100
 */
export function calculateOccupancyRate(rooms: Room[], tenantId: string): { rate: number; occupiedCount: number; totalCount: number } {
  const tenantRooms = rooms.filter(r => r.tenantId === tenantId);
  const totalCount = tenantRooms.length;
  if (totalCount === 0) {
    return { rate: 0, occupiedCount: 0, totalCount: 0 };
  }
  const occupiedCount = tenantRooms.filter(r => r.status === 'occupied').length;
  const rate = Math.round((occupiedCount / totalCount) * 100);
  return { rate, occupiedCount, totalCount };
}

/**
 * Calculates the RevPAR (Revenue Per Available Room) for a specific tenant in a given month.
 * Formula: Total lodging revenue / Number of available rooms
 */
export function calculateRevPAR(
  transactions: Transaction[],
  rooms: Room[],
  tenantId: string,
  month: string,
  year: string
): { revPar: number; lodgingRevenue: number; roomsCount: number } {
  const tenantRooms = rooms.filter(r => r.tenantId === tenantId);
  const roomsCount = tenantRooms.length;

  if (roomsCount === 0) {
    return { revPar: 0, lodgingRevenue: 0, roomsCount: 0 };
  }

  const lodgingRevenue = transactions
    .filter(tx => {
      if (tx.tenantId !== tenantId || tx.type !== 'lodging_payment') {
        return false;
      }
      try {
        const txDate = new Date(tx.date);
        const m = (txDate.getMonth() + 1).toString().padStart(2, '0');
        const y = txDate.getFullYear().toString();
        return m === month && y === year;
      } catch {
        return false;
      }
    })
    .reduce((acc, curr) => acc + curr.amount, 0);

  const revPar = Math.round(lodgingRevenue / roomsCount);
  return { revPar, lodgingRevenue, roomsCount };
}

/**
 * Calculates the Food Cost for a single itemized order.
 * Uses ingredients required from the menu item and purchase price from stock items.
 */
export function calculateFoodCostForOrder(
  orderItems: { menuItemId: string; quantity: number }[],
  menu: MenuItem[],
  stock: StockItem[]
): number {
  let totalCost = 0;

  for (const item of orderItems) {
    // Find the menu item matching by id
    const menuItem = menu.find(m => m.id === item.menuItemId);
    if (!menuItem) continue;

    // If there are ingredients specified
    if (menuItem.ingredients && menuItem.ingredients.length > 0) {
      let itemIngredientsCost = 0;
      for (const ingredient of menuItem.ingredients) {
        const stockItem = stock.find(s => s.id === ingredient.stockItemId);
        if (stockItem) {
          itemIngredientsCost += ingredient.quantityRequired * stockItem.pricePurchase;
        }
      }
      totalCost += itemIngredientsCost * item.quantity;
    } else {
      // Fallback if no ingredients list is defined, estimate as 30% of sale price
      totalCost += (menuItem.price * 0.3) * item.quantity;
    }
  }

  return Math.round(totalCost);
}

/**
 * Calculates the total Food Cost and Gross Margin for a list of paid POS orders.
 * Formula Gross Margin Rate: ((Total POS Sales - Food Cost) / Total POS Sales) * 100
 */
export function calculateFoodCostAndMargin(
  orders: TableOrder[],
  menu: MenuItem[],
  stock: StockItem[],
  tenantId: string,
  month: string,
  year: string
): { foodCost: number; totalSales: number; grossMarginRate: number } {
  const periodOrders = orders.filter(order => {
    if (order.tenantId !== tenantId || order.status !== 'paid') {
      return false;
    }
    try {
      const orderDate = new Date(order.createdAt);
      const m = (orderDate.getMonth() + 1).toString().padStart(2, '0');
      const y = orderDate.getFullYear().toString();
      return m === month && y === year;
    } catch {
      return false;
    }
  });

  const totalSales = periodOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  let foodCost = 0;
  for (const order of periodOrders) {
    foodCost += calculateFoodCostForOrder(order.items, menu, stock);
  }

  const grossMarginRate = totalSales > 0 
    ? Math.round(((totalSales - foodCost) / totalSales) * 100) 
    : 0;

  return { foodCost, totalSales, grossMarginRate };
}
