import { Card, CardContent } from "../../../components/ui/card";

export const ServiceRequestDescriptionSection = (): JSX.Element => {
  return (
    <section className="flex w-full justify-center">
      <Card className="w-full max-w-[633px] min-h-[182px] rounded-[14px] border-2 border-solid border-[#012878] bg-[#fffffff0] shadow-[0px_3px_10px_#01287814]">
        <CardContent className="flex min-h-[178px] flex-col p-0">
          <h2 className="ml-5 mt-3.5 flex h-7 items-center text-xl font-normal leading-[normal] tracking-[0] text-[#012878] [font-family:'Inter',Helvetica]">
            Request Description
          </h2>
          <p className="ml-5 mt-3 flex min-h-[54px] w-[calc(100%-40px)] max-w-[430px] items-center text-sm font-normal leading-[normal] tracking-[0] text-[#012878] [font-family:'Inter',Helvetica]">
            Automatic doors at a clinic. The lock jams, and the latch does not
            engage properly when the doors close automatically.
          </p>
          <p className="ml-5 mt-1 flex min-h-5 w-[calc(100%-40px)] max-w-[430px] items-center text-xs font-normal leading-[normal] tracking-[0] text-[#5e6e85] [font-family:'Inter',Helvetica]">
            Customer&apos;s original description without automatic content
            changes.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};
