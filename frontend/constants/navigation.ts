type NavigationItem = {
  name: string;
  href: string;
  icon: string;
  current: boolean;
};

export const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: "/icons/dashboard.svg",
    current: true,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: "/icons/product.svg",
    current: false,
  },
  {
    name: "Product Allocations",
    href: "/admin/product-allocations",
    icon: "/icons/product-allocation.svg",
    current: false,
  },
  {
    name: "Shops",
    href: "/admin/shops",
    icon: "/icons/shop.svg",
    current: false,
  },
  {
    name: "Warranties",
    href: "/admin/warranties",
    icon: "/icons/warranty.svg",
    current: false,
  },
  {
    name: "Claims",
    href: "/admin/claims",
    icon: "/icons/claims.svg",
    current: false,
  },
];

type UserNavigationItem = {
  name: string;
  href: string;
};

export const userNavigation: UserNavigationItem[] = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];
