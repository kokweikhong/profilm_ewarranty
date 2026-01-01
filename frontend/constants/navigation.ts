type NavigationItem = {
  name: string;
  href: string;
  icon: string;
  current: boolean;
  allowedRoles?: string[]; // if not specified, all roles can access
};

export const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: "/icons/dashboard.svg",
    current: true,
    allowedRoles: ["admin", "shop_admin"],
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: "/icons/product.svg",
    current: false,
    allowedRoles: ["admin"],
  },
  {
    name: "Shops",
    href: "/admin/shops",
    icon: "/icons/shop.svg",
    current: false,
    allowedRoles: ["admin"],
  },
  {
    name: "Product Allocations",
    href: "/admin/product-allocations",
    icon: "/icons/product-allocation.svg",
    current: false,
    allowedRoles: ["admin"],
  },
  {
    name: "Warranties",
    href: "/admin/warranties",
    icon: "/icons/warranty.svg",
    current: false,
    allowedRoles: ["admin", "shop_admin"],
  },
  {
    name: "Claims",
    href: "/admin/claims",
    icon: "/icons/claims.svg",
    current: false,
    allowedRoles: ["admin", "shop_admin"],
  },
];

export function filterNavigationByRole(
  userRole: string | undefined
): NavigationItem[] {
  if (!userRole) return [];
  return navigation.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(userRole)
  );
}

type UserNavigationItem = {
  name: string;
  href: string;
};

export const userNavigation: UserNavigationItem[] = [
  { name: "Your profile", href: "/admin/users" },
  { name: "Update password", href: "/admin/users/update-password" },
  { name: "Sign out", href: "#" },
];
