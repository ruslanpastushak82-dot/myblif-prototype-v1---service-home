export type ServiceCategory = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

const assetBase = "https://c.animaapp.com/tqcZ1wIWenImfmkGb6Vkgw/img";

// Single source of truth for service categories: Service Home renders these
// as clickable cards, Quick Request's Service Type select uses the same
// titles so the two never drift apart.
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    title: "Doors",
    description: "Installation, lock repair, hardware",
    image: `${assetBase}/category-image---doors.png`,
    alt: "Category IMAGE DOORS",
  },
  {
    title: "Furniture",
    description: "Assembly, repair, setup & adjustment",
    image: `${assetBase}/category-image---furniture.png`,
    alt: "Category IMAGE",
  },
  {
    title: "Assembly & Installation",
    description: "Shelves, blinds, mirrors, equipment & more",
    image: `${assetBase}/category-image---assembly---installation.png`,
    alt: "Category IMAGE",
  },
  {
    title: "Welding",
    description: "Metal & aluminum fabrication and repair",
    image: `${assetBase}/category-image---welding.png`,
    alt: "Category IMAGE",
  },
  {
    title: "Plumbing",
    description: "Faucets, drains, leaks & minor plumbing",
    image: `${assetBase}/category-image---plumbing.png`,
    alt: "Category IMAGE",
  },
  {
    title: "TV Mounting",
    description: "TV brackets, mounting & setup",
    image: `${assetBase}/category-image---tv-mounting.png`,
    alt: "Category IMAGE TV",
  },
  {
    title: "Garage Doors",
    description: "Adjustment, hardware & minor repair",
    image: `${assetBase}/category-image---garage-doors.png`,
    alt: "Category IMAGE",
  },
  {
    title: "Caulking & Sealing",
    description: "Baths, showers, sinks, counters & joints",
    image: `${assetBase}/category-image---caulking---sealing.png`,
    alt: "Category IMAGE",
  },
  {
    title: "Window & Exterior Sealing",
    description: "Exterior gaps, window sealing & minor finishing",
    image: `${assetBase}/category-image---window---exterior-sealing.png`,
    alt: "Category IMAGE",
  },
  {
    title: "Other Repairs",
    description: "Small repairs & other handyman services",
    image: `${assetBase}/category-image---other-repairs.png`,
    alt: "Category IMAGE OTHER",
  },
];

export const SERVICE_CATEGORY_TITLES = SERVICE_CATEGORIES.map(
  (category) => category.title,
);
