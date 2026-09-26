import { useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const assetBase = "https://c.animaapp.com/tqcZ1wIWenImfmkGb6Vkgw/img";

const categories = [
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

const benefits = ["Fast Request", "Quality Repair", "Trusted Service"];

export const ServiceHome = (): JSX.Element => {
  const categoryRailRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: "previous" | "next") => {
    categoryRailRef.current?.scrollBy({
      left: direction === "next" ? 316 : -316,
      behavior: "smooth",
    });
  };

  return (
    <main
      className="relative aspect-[1440/1024] min-h-[640px] w-full min-w-[800px] overflow-hidden text-[#012878]"
      data-model-id="1425:2047"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${assetBase}/myblif-standard-background.png)`,
        }}
        aria-hidden="true"
      />
      <header className="absolute left-[4.44%] right-[4.44%] top-[3.32%] z-10 flex items-start justify-between">
        <img
          className="mt-[0.7%] h-auto w-[64px] max-w-[4.45vw] object-contain"
          alt="Myblif official logo"
          src={`${assetBase}/myblif-official-logo-2.png`}
        />
        <Select defaultValue="en">
          <SelectTrigger className="h-auto w-[80px] rounded-xl border-2 border-[#012878] bg-[#ffffffd1] px-2 py-2 text-base font-bold text-[#012878] shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">🌐 EN</SelectItem>
          </SelectContent>
        </Select>
      </header>
      <section
        className="absolute left-[9.86%] top-[5.18%] z-10 flex w-[43%] flex-col gap-3"
        aria-labelledby="service-title"
      >
        <h1
          id="service-title"
          className="[font-family:'Inter',Helvetica] text-[clamp(22px,2.64vw,38px)] font-bold leading-none"
        >
          MYBLIF Service
        </h1>
        <p className="max-w-[500px] [font-family:'Inter',Helvetica] text-[clamp(16px,1.88vw,27px)] font-bold leading-[1.05]">
          Your trusted handyman is always nearby
        </p>
      </section>
      <img
        className="absolute left-[32.5%] top-[16.5%] z-[1] w-[64.03%] object-contain"
        alt="Bbe fcf"
        src={`${assetBase}/b82b0e03-7fcf-4071-b4e9-4708d514068f-1.png`}
      />
      <section
        className="absolute left-[10.42%] top-[32.23%] z-10 flex flex-col gap-4"
        aria-label="MYBLIF service benefits"
      >
        {benefits.map((benefit) => (
          <div
            key={benefit}
            className="flex items-center gap-2 [font-family:'Inter',Helvetica] text-[clamp(15px,1.81vw,26px)] font-bold leading-none"
          >
            <span className="text-[#fcce5e]" aria-hidden="true">
              ✓
            </span>
            <span>{benefit}</span>
          </div>
        ))}
      </section>
      <Button
        type="button"
        className="absolute left-[32.78%] top-[62.7%] z-10 flex h-auto w-[36.11%] items-center justify-center gap-12 rounded-2xl border-2 border-[#012878] bg-[#fcce5e] py-3 text-[clamp(15px,1.46vw,21px)] font-bold text-[#012878] shadow-none hover:bg-[#fbd15e]"
      >
        <span>Quick Request</span>
        <span className="text-[clamp(20px,1.95vw,28px)]" aria-hidden="true">
          →
        </span>
      </Button>
      <section
        className="absolute bottom-[3.32%] left-[8.13%] right-[8.13%] z-10 flex items-center"
        aria-label="Service categories"
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="z-20 h-auto min-h-11 min-w-11 shrink-0 rounded-full border-2 border-[#012878] bg-[#fffffff2] p-0 text-2xl font-normal text-[#012878] shadow-none hover:bg-white"
          aria-label="Previous service categories"
          onClick={() => scrollCategories("previous")}
        >
          ‹
        </Button>
        <div
          ref={categoryRailRef}
          className="mx-2 flex min-w-0 flex-1 gap-[1.25%] overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => (
            <Card
              key={category.title}
              className="h-auto min-h-[190px] w-[23.88%] min-w-[298px] shrink-0 overflow-hidden rounded-[18px] border-2 border-[#012878] bg-[#ffffffe6] py-0 shadow-none"
            >
              <CardContent className="p-3">
                <button
                  type="button"
                  className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#012878] focus-visible:ring-offset-2"
                  aria-label={`Request ${category.title} service`}
                >
                  <img
                    className="h-[103px] w-full rounded-xl object-cover"
                    alt={category.alt}
                    src={category.image}
                  />
                  <h2 className="mt-3 truncate [font-family:'Inter',Helvetica] text-[17px] font-bold leading-none">
                    {category.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 [font-family:'Inter',Helvetica] text-sm leading-[1.15]">
                    {category.description}
                  </p>
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="z-20 h-auto min-h-11 min-w-11 shrink-0 rounded-full border-2 border-[#012878] bg-[#fffffff2] p-0 text-2xl font-normal text-[#012878] shadow-none hover:bg-white"
          aria-label="Next service categories"
          onClick={() => scrollCategories("next")}
        >
          ›
        </Button>
      </section>
    </main>
  );
};
