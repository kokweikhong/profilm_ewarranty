import {
  CalendarIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
  current: boolean;
};

export const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon, current: true },
  {
    name: "Products",
    href: "/admin/products",
    icon: UsersIcon,
    current: false,
  },
  {
    name: "Product Allocations",
    href: "/admin/product-allocations",
    icon: UsersIcon,
    current: false,
  },
  { name: "Shops", href: "/admin/shops", icon: FolderIcon, current: false },
  {
    name: "Warranties",
    href: "/admin/warranties",
    icon: CalendarIcon,
    current: false,
  },
  {
    name: "Claims",
    href: "/admin/claims",
    icon: DocumentDuplicateIcon,
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
