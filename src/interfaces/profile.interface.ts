export interface CurrentUser {
  id: string;
  name: string;
  username: string;
  email: string;
  roleName: string;   //("Superadmin", "Rental Vendor", "Customer")
  role?: string;
}
