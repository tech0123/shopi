import dynamic from "next/dynamic";
import Loader from "@/helper/CommonComponent/Loader";
const EmployeeList = dynamic(
  () => import("../../../Components/Employee/EmployeeList"),
  {
    loading: () => <Loader />
  }
);

const Employee = () => {
  return <EmployeeList />;
};
export default Employee;
