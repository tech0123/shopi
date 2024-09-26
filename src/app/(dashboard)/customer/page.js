import dynamic from "next/dynamic";
import Loader from "@/helper/CommonComponent/Loader";
const CustomerList = dynamic(
  () => import("../../../Components/Customer/CustomerList"),
  {
    loading: () => <Loader />
  }
);

const Customer = () => {
  return <CustomerList />;
};
export default Customer;
