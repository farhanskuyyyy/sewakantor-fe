import Navbar from "../components/Navbar";
import CityWrapper from "../wrappers/CityWrapper";

export default function Cities() {
  return (
    <>
      <Navbar />
      <section id="Cities" className="flex flex-col gap-[30px] mt-[100px]">
        <div className="w-full max-w-[1130px] mx-auto flex items-center justify-between">
          <h2 className="font-bold text-[32px] leading-[48px] text-nowrap">
            You Can Choose <br />
            Our Favorite Cities
          </h2>
        </div>
        <CityWrapper />
      </section>
    </>
  );
}
