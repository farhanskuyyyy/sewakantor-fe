import Navbar from "../components/Navbar";
import OfficeWrapper from "../wrappers/OfficeWrapper";

export default function Offices() {
  return (
    <>
      <Navbar />
      <OfficeWrapper limit={100} />
    </>
  );
}
