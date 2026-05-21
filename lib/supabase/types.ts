export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          original_price: number | null;
          era: string | null;
          condition: string | null;
          category: string | null;
          images: string[] | null;
          measurements: Json | null;
          fit_note: string | null;
          in_stock: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      profiles: {
        Row: { id: string; full_name: string | null; email: string | null };
        Insert: { id: string; full_name?: string | null; email?: string | null };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      cart_items: {
        Row: { id: string; user_id: string; product_id: string; quantity: number; added_at: string };
        Insert: { id?: string; user_id: string; product_id: string; quantity?: number; added_at?: string };
        Update: Partial<Database["public"]["Tables"]["cart_items"]["Insert"]>;
      };
      orders: {
        Row: { id: string; user_id: string | null; status: string; total: number; shipping_address: Json | null; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: { id: string; order_id: string; product_id: string | null; quantity: number; price_at_purchase: number };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      sell_submissions: {
        Row: { id: string; name: string; email: string; description: string | null; photo_urls: string[] | null; status: string; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["sell_submissions"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["sell_submissions"]["Insert"]>;
      };
    };
  };
}

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type SellSubmission = Database["public"]["Tables"]["sell_submissions"]["Row"];

export type CartItemWithProduct = CartItem & { product: Product };
export type OrderWithItems = Order & { order_items: (OrderItem & { product: Product | null })[] };

export interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
