import User from "./User.model";

interface Item {
  item_id?: string;
  product_id?: string;
  order_id?: string;
  product_img: string;
  product_name: string;
  product_price: number;
  product_quantity: number;
  variant?: string;
  status?: string;
}

export type OrderStatus = "Pending" | "Processing" | "Delivered" | "Cancelled";

interface Order {
  user: User;
  id: string;
  tax: number;
  items: Item[];
  createdAt: Date;
  discount: number;
  deliveredAt: Date;
  subtotal?: number;
  shippingFee?: number;
  totalPrice: number;
  isDelivered: boolean;
  shippingAddress: string;
  paymentMethod?: string;
  rawStatus?: string;
  status: OrderStatus;
}

export default Order;
