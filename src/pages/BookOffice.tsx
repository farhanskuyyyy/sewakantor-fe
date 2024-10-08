import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { Office } from "../types/type";
import axios from "axios";
import { z } from "zod";
import { BookingSchema } from "../types/validationBooking";
import apiClient, { isAxiosError } from "../services/apiService";
import ErrorNotFound from "./ErrorNotFound";
import Loading from "../components/Loading";
import PaymentWrapper from "../wrappers/PaymentWrapper";

export default function BookOffice() {
  const { slug } = useParams<{ slug: string }>();
  const [office, setoffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseURL = "http://127.0.0.1:8000/storage";
  const navigate = useNavigate();

  interface FormData {
    name: string;
    phone_number: string;
    started_at: string;
    office_space_id: string;
    total_amount: number;
    attachment: File | null;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone_number: "",
    started_at: "",
    attachment: null,
    office_space_id: "",
    total_amount: 0,
  });

  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uniqueCode, setUniquieCode] = useState<number>(0);
  const [totalAmountWithUniqueCode, setTotalAmountWithUniqueCode] =
    useState<number>(0);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/office/${slug}`, {
        headers: {
          "X-API-KEY": "jalksdasmkldjalksdjaslkdj12312321",
        },
      })
      .then((response) => {
        setoffice(response.data.data);

        const officeSpaceId = response.data.data.id;
        const generateUniqueCode = Math.floor(100 + Math.random() * 900); // random 3 digit code
        const grandTotal = response.data.data.price - generateUniqueCode;

        setUniquieCode(generateUniqueCode);
        setTotalAmountWithUniqueCode(grandTotal);

        setFormData((prevData) => ({
          ...prevData,
          office_space_id: officeSpaceId,
          total_amount: grandTotal,
        }));
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading />;
      </>
    );
  }

  if (error) {
    if (error == "Request failed with status code 404") {
      return <ErrorNotFound />;
    } else {
      return <p>Error loading Data : {error}</p>;
    }
  }

  if (!office) {
    return <ErrorNotFound />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      attachment: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Validating form data...");
    const validation = BookingSchema.safeParse(formData);
    if (!validation.success) {
      console.error("Validation errors:", validation.error.issues);
      setFormErrors(validation.error.issues);
      return;
    }

    console.log("Form data is valid. Submitting...", formData);
    setIsLoading(true); // Set loading state to true
    // Create form data object to submit via API
    const submitFormData = new FormData();
    submitFormData.append("name", formData.name);
    submitFormData.append("phone_number", formData.phone_number);
    submitFormData.append("started_at", formData.started_at);
    submitFormData.append("office_space_id", formData.office_space_id);
    submitFormData.append("total_amount", formData.total_amount.toString());
    if (formData.attachment)
      submitFormData.append("attachment", formData.attachment);

    try {
      const response = await apiClient.post(
        "/booking-transaction",
        submitFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Form submitted successfully:", response.data);
      navigate("/success-booking", {
        state: {
          office,
          booking: response.data.data,
        },
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        id="Banner"
        className="relative w-full h-[240px] flex items-center shrink-0 overflow-hidden -mb-[50px]"
      >
        <h1 className="text-center mx-auto font-extrabold text-[40px] leading-[60px] text-white mb-5 z-20">
          Start Booking Your Office
        </h1>
        <div className="absolute w-full h-full bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,#000000_91.83%)] z-10" />
        <img
          src={`${baseURL}/${office.thumbnail}`}
          className="absolute w-full h-full object-cover object-top"
          alt=""
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="relative flex justify-center max-w-[1130px] mx-auto gap-[30px] mb-20 z-20"
      >
        <div className="flex flex-col shrink-0 w-[500px] h-fit rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
          <div className="flex items-center gap-4">
            <div className="flex shrink-0 w-[140px] h-[100px] rounded-[20px] overflow-hidden">
              <img
                src={`${baseURL}/${office.thumbnail}`}
                className="w-full h-full object-cover"
                alt="thumbnail"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold text-xl leading-[30px]">{office.name}</p>
              <div className="flex items-center gap-[6px]">
                <img
                  src="/assets/images/icons/location.svg"
                  className="w-6 h-6"
                  alt="icon"
                />
                <p className="font-semibold">{office.city.name}</p>
              </div>
            </div>
          </div>
          <hr className="border-[#F6F5FD]" />
          <div className="flex flex-col gap-4">
            <h2 className="font-bold">Complete The Details</h2>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-semibold">
                Full Name
              </label>
              <div className="flex items-center rounded-full border border-[#000929] px-5 gap-[10px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D903A]">
                <img
                  src="/assets/images/icons/security-user-black.svg"
                  className="w-6 h-6"
                  alt="icon"
                />
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]"
                  placeholder="Write your complete name"
                  onChange={handleChange}
                />
              </div>
              {formErrors.find((error) => error.path.includes("name")) && (
                <p className="text-red-500">Name Is Required</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone_number" className="font-semibold">
                Phone Number
              </label>
              <div className="flex items-center rounded-full border border-[#000929] px-5 gap-[10px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D903A]">
                <img
                  src="/assets/images/icons/call-black.svg"
                  className="w-6 h-6"
                  alt="icon"
                />
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  value={formData.phone_number}
                  className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]"
                  placeholder="Write your valid number"
                  onChange={handleChange}
                />
              </div>
              {formErrors.find((error) =>
                error.path.includes("phone_number")
              ) && <p className="text-red-500">Phonenumber Is Required</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="started_at" className="font-semibold">
                Started At
              </label>
              <div className="flex items-center rounded-full border border-[#000929] px-5 gap-[10px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D903A] overflow-hidden">
                <img
                  src="/assets/images/icons/calendar-black.svg"
                  className="w-6 h-6"
                  alt="icon"
                />
                <input
                  type="date"
                  name="started_at"
                  id="started_at"
                  value={formData.started_at}
                  className="relative appearance-none outline-none w-full py-3 font-semibold [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                  onChange={handleChange}
                />
              </div>
              {formErrors.find((error) =>
                error.path.includes("started_at")
              ) && <p className="text-red-500">Started at Is Required</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="attachment" className="font-semibold">
                Attachment
              </label>
              <div className="flex items-center rounded-full border border-[#000929] px-5 gap-[10px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D903A] overflow-hidden">
                <img
                  src="/assets/images/icons/calendar-black.svg"
                  className="w-6 h-6"
                  alt="icon"
                />
                <input
                  type="file"
                  name="attachment"
                  id="attachment"
                  // value={formData.attachment}
                  accept="image/*"
                  className="relative appearance-none outline-none w-full py-3 font-semibold [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                  onChange={handleFileChange}
                />
              </div>
              {formErrors.find((error) =>
                error.path.includes("attachment")
              ) && <p className="text-red-500">Attachement Is Required</p>}
            </div>
          </div>
          <hr className="border-[#F6F5FD]" />
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/icons/shield-tick.svg"
              className="w-[30px] h-[30px]"
              alt="icon"
            />
            <p className="font-semibold leading-[28px]">
              Kami akan melindungi privasi Anda sebaik mungkin sehingga dapat
              fokus bekerja
            </p>
          </div>
          <hr className="border-[#F6F5FD]" />
          <div className="flex flex-col gap-[30px]">
            <h2 className="font-bold">Features For You</h2>
            <div className="grid grid-cols-2 gap-[30px]">
              {office.features.slice(0, 2).map((feature) => (
                <div className="flex items-center gap-4" key={feature.id}>
                  <img
                    src={`${baseURL}/${feature.icon}`}
                    className="w-[34px] h-[34px]"
                    alt="icon"
                  />
                  <div className="flex flex-col gap-[2px]">
                    <p className="font-bold text-lg leading-[24px]">
                      {feature.name}
                    </p>
                    <p className="text-sm leading-[21px]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col shrink-0 w-[400px] h-fit rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
          <h2 className="font-bold">Your Order Details</h2>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Duration</p>
              <p className="font-bold">{office.duration} Days Working</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold">Sub Total</p>
              <p className="font-bold">
                Rp {office.price.toLocaleString("id")}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold">Unique Code</p>
              <p className="font-bold text-[#FF2D2D]">-Rp {uniqueCode}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold">Grand Total</p>
              <p className="font-bold text-[22px] leading-[33px] text-[#0D903A]">
                Rp{" "}
                {totalAmountWithUniqueCode.toLocaleString("id", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="relative rounded-xl p-[10px_20px] gap-[10px] bg-[#000929] text-white">
              <img
                src="/assets/images/icons/Polygon 1.svg"
                className="absolute -top-[15px] right-[10px] "
                alt=""
              />
              <p className="font-semibold text-sm leading-[24px] z-10">
                Tolong perhatikan kode unik berikut ketika melakukan pembayaran
                kantor
              </p>
            </div>
          </div>
          <hr className="border-[#F6F5FD]" />
          <h2 className="font-bold">Send Payment to</h2>

          <PaymentWrapper />
          <hr className="border-[#F6F5FD]" />
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full rounded-full p-[16px_26px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD]"
          >
            <span>{isLoading ? "Loading..." : "I’ve Made The Payment"}</span>
          </button>
        </div>
      </form>
    </>
  );
}
