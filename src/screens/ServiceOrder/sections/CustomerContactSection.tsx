import { Card, CardContent } from "../../../components/ui/card";

const customerDetails = [
  { label: "Address", value: "968 Albion Road, Etobicoke" },
  { label: "Name", value: "Vatsal Raval" },
  { label: "Mobile", value: "—" },
];

export const CustomerContactSection = (): JSX.Element => {
  return (
    <section className="flex w-full justify-end pt-[43px]">
      <Card className="h-[116px] w-full max-w-[456px] rounded-[14px] border-2 border-solid border-[#012878] bg-[#fffffff0] shadow-[0px_3px_10px_#01287814]">
        <CardContent className="grid h-full grid-cols-[minmax(0,1fr)_186px] grid-rows-[22px_1fr] gap-x-[30px] p-0 px-5 py-2.5 text-[#012878]">
          <h2 className="col-span-2 flex items-center font-['Inter',Helvetica] text-base font-normal leading-normal">
            Customer
          </h2>
          <dl className="row-start-2 flex flex-col gap-1 font-['Inter',Helvetica] text-[13px] font-normal leading-5">
            {customerDetails.map((detail) => (
              <div
                key={detail.label}
                className="flex h-5 items-center whitespace-nowrap"
              >
                <dt>{detail.label}:</dt>
                <dd className="ml-1">{detail.value}</dd>
              </div>
            ))}
          </dl>
          <p className="row-start-2 font-['Inter',Helvetica] text-xs font-medium leading-normal text-[#0c59bf]">
            Google Maps ↗ · 🚗 ~24 хв зараз
          </p>
        </CardContent>
      </Card>
    </section>
  );
};
