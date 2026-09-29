import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { SERVICE_CATEGORIES } from "../../data/serviceCategories";
import { useCustomerRequest } from "../../state/CustomerRequestContext";

const assetBase = "https://c.animaapp.com/tqcZ1wIWenImfmkGb6Vkgw/img";

const benefits = ["Fast Request", "Quality Repair", "Trusted Service"];

export const ServiceHome = (): JSX.Element => {
  const categoryRailRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { clearServiceType, setServiceType } = useCustomerRequest();

  const scrollCategories = (direction: "previous" | "next") => {
    const rail = categoryRailRef.current;
    if (!rail) return;

    const firstCard = rail.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? rail.clientWidth / 4;
    const gap = parseFloat(getComputedStyle(rail).columnGap || "0");
    const step = cardWidth + gap;

    rail.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  };

  const openQuickRequest = () => {
    clearServiceType();
    navigate("/quick-request-u8212-export-diagnostic");
  };

  const openQuickRequestWithCategory = (title: string) => {
    setServiceType(title);
    navigate("/quick-request-u8212-export-diagnostic");
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
      <header className="absolute left-[6.67%] right-[4.44%] top-[3.32%] z-10 flex items-start justify-between">
        <img
          className="mt-[0.7%] h-16 w-16 object-contain"
          alt="Myblif official logo"
          src={`${assetBase}/myblif-official-logo-2.png`}
        />
        <Select defaultValue="en">
          <SelectTrigger className="h-auto w-[92px] rounded-xl border-2 border-[#012878] bg-[#ffffffd1] px-2 py-2 text-base font-bold text-[#012878] shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">🌐 EN</SelectItem>
          </SelectContent>
        </Select>
      </header>
      <section
        className="absolute left-[163.8125px] top-[5.18%] z-10 flex w-[43%] flex-col gap-3"
        aria-labelledby="service-title"
      >
        <h1
          id="service-title"
          className="[font-family:'Inter',Helvetica] text-[38px] font-bold leading-none"
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
        onClick={openQuickRequest}
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
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="block"
          >
            <path
              d="M9 1L2 8L9 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <div
          ref={categoryRailRef}
          className="mx-2 flex min-w-0 flex-1 snap-x snap-mandatory gap-[1.25%] overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SERVICE_CATEGORIES.map((category) => (
            <Card
              key={category.title}
              className="h-auto min-h-[190px] w-[23.88%] shrink-0 snap-start overflow-hidden rounded-[18px] border-2 border-[#012878] bg-[#ffffffe6] py-0 shadow-none"
            >
              <CardContent className="p-3">
                <button
                  type="button"
                  onClick={() => openQuickRequestWithCategory(category.title)}
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
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="block"
          >
            <path
              d="M1 1L8 8L1 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </section>
    </main>
  );
};
