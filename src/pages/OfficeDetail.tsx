import { Swiper, SwiperSlide } from "swiper/react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Office } from "../types/type";
import apiClient from "../services/apiService";
import ErrorNotFound from "./ErrorNotFound";
import Loading from "../components/Loading";
import Rating from "../components/Rating";

export default function OfficeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [office, setoffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseURL = "http://127.0.0.1:8000/storage";

  useEffect(() => {
    apiClient
      .get(`/office/${slug}`)
      .then((response) => {
        setoffice(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

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
  return (
    <>
      <Navbar />
      <section id="Gallery" className="-mb-[50px]">
        <div className="swiper w-full">
          <div className="swiper-wrapper">
            <Swiper
              direction="horizontal"
              spaceBetween={10}
              slidesPerView={"auto"}
              slidesOffsetAfter={10}
              slidesOffsetBefore={10}
            >
              <SwiperSlide className="!w-fit">
                <div className="w-[700px] h-[550px] overflow-hidden">
                  <img
                    src={`${baseURL}/${office.thumbnail}`}
                    className="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                </div>
              </SwiperSlide>
              {office.photos.map((photo) => (
                <SwiperSlide className="!w-fit" key={photo.id}>
                  <div className="w-[700px] h-[550px] overflow-hidden">
                    <img
                      src={`${baseURL}/${photo.photo}`}
                      className="w-full h-full object-cover"
                      alt="thumbnail"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <section
        id="Details"
        className="relative flex max-w-[1130px] mx-auto gap-[30px] mb-20 z-10"
      >
        <div className="flex flex-col w-full rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
          <p className="w-fit rounded-full p-[6px_16px] bg-[#0D903A] font-bold text-sm leading-[21px] text-[#F7F7FD]">
            Popular
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-extrabold text-[32px] leading-[44px]">
                {office.name}
              </h1>
              <div className="flex items-center gap-[6px] mt-[10px]">
                <img
                  src="/assets/images/icons/location.svg"
                  className="w-6 h-6"
                  alt="icon"
                />
                <p className="font-semibold">{office.city.name}</p>
              </div>
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center gap-1">
                <Rating rate={office.ratings_avg ?? 0} />
              </div>
              <p className="font-semibold text-right">
                {office.ratings_avg
                  ? Math.round(office.ratings_avg * 100) / 100
                  : 0}
                /5 ({office.ratings_count ?? 0})
              </p>
            </div>
          </div>
          <p className="leading-[30px]">{office.about}</p>
          <hr className="border-[#F6F5FD]" />
          <h2 className="font-bold">You Get What You Need Most</h2>
          <div className="grid grid-cols-3 gap-x-5 gap-y-[30px]">
            {office.features.map((feature) => (
              <div className="flex items-center gap-4">
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
          <hr className="border-[#F6F5FD]" />
          <div className="flex flex-col gap-[6px]">
            <h2 className="font-bold">Office Address</h2>
            <p>{office.name}</p>
            <p>{office.address}</p>
          </div>
          <div className="overflow-hidden w-full h-[280px]">
            <div
              id="my-map-display"
              className="h-full w-full max-w-[none] bg-none"
            >
              <iframe
                className="h-full w-full border-0"
                frameBorder={0}
                src={`https://www.google.com/maps/embed/v1/place?q=${office.name}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
              />
            </div>
            <a
              className="from-embedmap-code"
              href="https://www.bootstrapskins.com/themes"
              id="enable-map-data"
            >
              premium bootstrap themes
            </a>
          </div>
        </div>
        <div className="w-[392px] flex flex-col shrink-0 gap-[30px]">
          <div className="flex flex-col rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
            <div>
              <p className="font-extrabold text-[32px] leading-[48px] text-[#0D903A]">
                Rp {office.price.toLocaleString("id")}
              </p>
              <p className="font-semibold mt-1">
                For {office.duration} days working
              </p>
            </div>
            <hr className="border-[#F6F5FD]" />
            <div className="flex flex-col gap-5">
              {office.benefits.map((benefit) => (
                <div className="flex items-center gap-3" key={benefit.id}>
                  <img
                    src="/assets/images/icons/verify.svg"
                    className="w-[30px] h-[30px]"
                    alt="icon"
                  />
                  <p className="font-semibold leading-[28px]">{benefit.name}</p>
                </div>
              ))}
            </div>
            <hr className="border-[#F6F5FD]" />
            <div className="flex flex-col gap-[14px]">
              <Link
                to={`/office/${office.slug}/book`}
                className="flex items-center justify-center w-full rounded-full p-[16px_26px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD]"
              >
                <img
                  src="/assets/images/icons/slider-horizontal-white.svg"
                  className="w-6 h-6"
                  alt="icon"
                />
                <span>Book This Office</span>
              </Link>
              <button className="flex items-center justify-center w-full rounded-full border border-[#000929] p-[16px_26px] gap-3 bg-white font-semibold">
                <img
                  src="/assets/images/icons/save-add.svg"
                  className="w-6 h-6"
                  alt="icon"
                />
                <span>Save for Later</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[20px] bg-white">
            <h2 className="font-bold">Contact Our Sales</h2>
            <div className="flex flex-col gap-[30px]">
              {office.sales.map((seller) => (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                      <img
                        src={`${baseURL}/${seller.image}`}
                        className="w-full h-full object-cover"
                        alt="photo"
                      />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <p className="font-bold">{seller.name}</p>
                      <p className="text-sm leading-[21px]">{seller.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a href="#">
                      <img
                        src="/assets/images/icons/call-green.svg"
                        className="w-10 h-10"
                        alt="icon"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/assets/images/icons/chat-green.svg"
                        className="w-10 h-10"
                        alt="icon"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
