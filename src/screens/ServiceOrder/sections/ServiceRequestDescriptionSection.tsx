import { Card, CardContent } from "../../../components/ui/card";
import type { CustomerRequest } from "../../../state/CustomerRequestContext";

const mockDescription =
  "Automatic doors at a clinic. The lock jams, and the latch does not engage properly when the doors close automatically.";

export const ServiceRequestDescriptionSection = ({
  customerRequest,
}: {
  customerRequest?: CustomerRequest;
}): JSX.Element => {
  // Word for word, exactly what the Customer typed in Request Details --
  // no rewriting, trimming beyond whitespace, or summarizing.
  const description = customerRequest
    ? customerRequest.requestDetails
    : mockDescription;

  return (
    <Card className="w-full max-w-[633px] rounded-[14px] border-2 border-solid border-[#012878] bg-[#fffffff0] shadow-[0px_3px_10px_#01287814]">
      <CardContent className="flex flex-col p-0 pb-3">
        <h2 className="ml-5 mt-3 flex h-6 items-center text-xl font-normal leading-[normal] tracking-[0] text-[#012878] [font-family:'Inter',Helvetica]">
          Request Description
        </h2>
        {/*
          The description text scrolls internally past ~4 lines instead of
          growing the card/screen taller — same principle as Order Details.
          Content/text is unchanged.
        */}
        <div className="ml-5 mt-1.5 max-h-[76px] w-[calc(100%-40px)] max-w-[430px] overflow-y-auto pr-1">
          <p className="text-sm font-normal leading-[normal] tracking-[0] text-[#012878] [font-family:'Inter',Helvetica]">
            {description}
          </p>
        </div>
        <p className="ml-5 mt-1.5 flex min-h-5 w-[calc(100%-40px)] max-w-[430px] items-center text-xs font-normal leading-[normal] tracking-[0] text-[#5e6e85] [font-family:'Inter',Helvetica]">
          Customer&apos;s original description without automatic content
          changes.
        </p>
      </CardContent>
    </Card>
  );
};
