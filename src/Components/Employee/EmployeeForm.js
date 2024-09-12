"use client";
import React, { memo } from "react";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Col, Row } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dropdown } from "primereact/dropdown";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import CommonInputSingalSelect from "@/helper/CommonComponent/CommonInputSingalSelect";
import { useRouter } from "next/navigation";
import { addEmployeeList } from "@/store/slice/employeeSlice";
import { useDispatch } from "react-redux";

const initialState = {
  first_name: "",
  last_name: "",
  email: "",
  mobile_number: "",
  blood_group: "",
  country: "",
  state: "",
  city: "",
  company_name: "",
  user_email: "",
  password: "",
  emp_no: "",
  role: ""
};

const schema = yup.object().shape({
  first_name: yup.string().required("Please enter First Name."),
  last_name: yup.string().required("Please enter Last Name."),
  email: yup.string().email().required("Please enter Email."),
  mobile_number: yup.string().required("Please enter Mobile Number."),
  blood_group: yup.string().required("Please enter Blood Group."),
  country: yup.string().required("Please enter Country."),
  state: yup.string().required("Please enter State."),
  city: yup.string().required("Please enter City."),
  company_name: yup.string().required("Please enter Company Name."),
  user_email: yup.string().required("Please enter User Email."),
  password: yup.string().required("Please enter Password."),
  emp_no: yup.string().required("Please enter Emp No."),
  role: yup.string().required("Please enter Role.")
});

const EmployeeForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialState
  });

  const { getValues } = methods;
  const { role } = getValues();

  const onSubmit = async data => {
    console.log(data);

    const payload = {
      email: data.email,
      password: data.password,
      role: data.role
    };

    console.log("payload", payload);

    // const res = await dispatch(addEmployeeList(payload));
    // console.log("res", res);

    // try {
    //   const response = await fetch("/api/Employee/addEmployee", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(payload)
    //   });

    //   console.log("response", response);

    //   const result = await response.json();
    //   console.log("result", result);
    // } catch (error) {
    //   console.error("Error:", error);
    //   throw error;
    // }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <h5 className="fw-bold title_wrap my-6 ml-5">Primary Details</h5>
        <div className="form_container">
          <Row>
            <Col lg={3}>
              <CommonInputText
                title="First Name"
                id="FirstName"
                name="first_name"
                placeholder="First Name"
                isRequired
              />
            </Col>
            <Col lg={3}>
              <CommonInputText
                title="Last Name"
                id="LastName"
                name="last_name"
                placeholder="Last Name"
                isRequired
              />
            </Col>
            <Col lg={3}>
              <CommonInputText
                title="Email"
                id="Email"
                name="email"
                placeholder="Email"
                isRequired
              />
            </Col>
            <Col lg={3}>
              <CommonInputText
                title="Mobile No."
                id="MobileNumber"
                name="mobile_number"
                placeholder="Mobile Number"
                isRequired
              />
            </Col>
            <Col lg={3}>
              <CommonInputText
                title="Blood Group"
                id="BloodGroup"
                name="blood_group"
                placeholder="Blood Group"
                isRequired
              />
            </Col>
            <Col lg={3}>
              <CommonInputText
                title="Country"
                id="Country"
                name="country"
                placeholder="Country"
                isRequired
              />
            </Col>
            <Col lg={3}>
              <CommonInputText
                title="State"
                id="State"
                name="state"
                placeholder="State"
                isRequired
              />
            </Col>
            <Col lg={3}>
              <CommonInputText
                title="City"
                id="City"
                name="city"
                placeholder="City"
                isRequired
              />
            </Col>
          </Row>
        </div>
        <h5 className="fw-bold title_wrap my-6 ml-5">Office Details</h5>
        <div className="form_container mb-5">
          <Row>
            <Col lg={3}>
              <CommonInputText
                title="Company Name"
                id="CompanyName"
                name="company_name"
                placeholder="Company Name"
                isRequired
              />
            </Col>
            <Col lg={3}>
              <CommonInputText
                title="User Email ID"
                id="UserEmailID"
                name="user_email"
                placeholder="User Email"
                isRequired
              />
            </Col>
            <Col lg={3}>
              <CommonInputText
                type="password"
                title="Password"
                id="Password"
                name="password"
                placeholder="Password"
                isRequired
              />
            </Col>
            <Col lg={3}>
              <CommonInputText
                id="EmpNo"
                title="Emp No"
                name="emp_no"
                placeholder="Emp No"
                isRequired
              />
            </Col>
            {/* <Col lg={3}>
              <div className="w-full">
                <label className="w-6rem">
                  Role <span className="text-danger fs-6">*</span>
                </label>
                <div className="mt-2 mb-3">
                  <Dropdown
                    filter
                    id="role"
                    name="role"
                    options={[]}
                    placeholder="Role"
                    className="input_select"
                    {...methods.register("role", { required: true })}
                  />
                  {methods.formState.errors.role &&
                    <p className="text-red-500 text-xs mt-1">
                      Please enter Role.
                    </p>}
                </div>
              </div>
            </Col> */}
            <Col lg={3}>
              <CommonInputSingalSelect
                title="Role"
                id="Role"
                name="role"
                placeholder="Role"
                value={role}
                options={[
                  { label: "Owner", value: 1 },
                  { label: "Manager", value: 2 },
                  { label: "Sales-Men", value: 3 },
                  { label: "C.A.", value: 4 }
                ]}
                isRequired
              />
            </Col>
          </Row>
        </div>
        <div className="me-10 flex justify-end items-center gap-3">
          <Button
            className="btn_transperent"
            onClick={e => {
              e.preventDefault();
              router.push("/employee");
            }}
          >
            Cancel
          </Button>
          <Button type="submit" className="btn_primary">
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default memo(EmployeeForm);
