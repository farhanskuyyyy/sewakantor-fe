import { BrowserRouter, Route, Routes } from "react-router-dom";
import Browse from "./pages/Browse";
import CityDetails from "./pages/CityDetail";
import Details from "./pages/OfficeDetail";
import BookOffice from "./pages/BookOffice";
import SuccessBooking from "./pages/SuccessBooking";
import CheckBooking from "./pages/CheckBooking";
import Offices from "./pages/Offices";
import Cities from "./pages/Cities";
import ErrorNotFound from "./pages/ErrorNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ErrorNotFound />} />
        <Route path="/" element={<Browse />} />
        <Route path="/offices" element={<Offices />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/office/:slug" element={<Details />} />
        <Route path="/office/:slug/book" element={<BookOffice />} />
        <Route path="/city/:slug" element={<CityDetails />} />
        <Route path="/success-booking" element={<SuccessBooking />} />
        <Route path="/check-booking" element={<CheckBooking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
