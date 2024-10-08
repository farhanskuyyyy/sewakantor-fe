import { useEffect, useState } from "react";
import OfficeCard from "../components/OfficeCard";
import { Office } from "../types/type";
import { Link } from "react-router-dom";
import apiClient from "../services/apiService";
import Loading from "../components/Loading";
interface OfficeWrapperProps {
  limit: number; // username bersifat opsional dan bisa berupa string atau null
}

const OfficeWrapper: React.FC<OfficeWrapperProps> = ({ limit = 5 }) => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get("/offices", {
        params: {
          limit: limit,
        },
      })
      .then((response) => {
        setOffices(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (error) {
    return <p>Error loading Data : {error}</p>;
  }

  return (
    <>
      <section
        id="Fresh-Space"
        className="flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[100px] mb-[120px]"
      >
        <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-center">
          Browse Our Fresh Space.
          <br />
          For Your Better Productivity.
        </h2>
        {offices.length > 0 ? (
          <div className="grid grid-cols-3 gap-[30px]">
            {offices.map((office) => (
              <Link to={`/office/${office.slug}`} key={office.id}>
                <OfficeCard office={office}></OfficeCard>
              </Link>
            ))}
          </div>
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
};

export default OfficeWrapper;
