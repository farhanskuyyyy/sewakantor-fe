import { useEffect, useState } from "react";
import { Payment } from "../types/type";
import apiClient from "../services/apiService";
import Loading from "../components/Loading";

const PaymentWrapper = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseURL = "http://127.0.0.1:8000/storage";

  useEffect(() => {
    apiClient
      .get("/payments")
      .then((response) => {
        setPayments(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error loading Data : {error}</p>;
  }

  return (
    <div className="flex flex-col gap-[30px]">
      {payments.map((payment) => (
        <div className="flex items-center gap-3" key={payment.id}>
          <div className="w-[71px] flex shrink-0">
            <img
              src={`${baseURL}/${payment.image}`}
              className="w-full object-contain"
              alt="bank logo"
            />
          </div>
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-1">
              <p className="font-semibold">{payment.recipient}</p>
              <img
                src="/assets/images/icons/verify.svg"
                className="w-[18px] h-[18px]"
                alt="icon"
              />
            </div>
            <p>{payment.bank_number}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentWrapper;
