import { HeaderStructureSubsection } from "./sections/HeaderStructureSubsection";
import { MainContentSubsection } from "./sections/MainContentSubsection/MainContentSubsection";

export const RequestChat = (): JSX.Element => {
  return (
    <main
      className="relative min-h-screen w-full overflow-x-auto"
      data-model-id="1425:1851"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 min-h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://c.animaapp.com/tqcZ1wIWenImfmkGb6Vkgw/img/myblif-standard-background.png)",
        }}
      >
        <h1 className="ml-[150.365px] mt-9 w-fit [font-family:'Inter',Helvetica] text-[38px] font-bold leading-normal tracking-[0] text-[#012878]">
          MYBLIF Service
        </h1>
      </div>
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <HeaderStructureSubsection />
        <MainContentSubsection />
      </div>
    </main>
  );
};
