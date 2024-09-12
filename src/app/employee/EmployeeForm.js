"use client";
import React, { memo } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Col, Row } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dropdown } from "primereact/dropdown";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    getFieldState,
    getValues
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialState
  });

  console.log("value", getValues(), getFieldState());

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h6 className="fw-bold">Primary Details</h6>
      <div className="form_container">
        <Row>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                First Name <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="FirstName"
                  name="first_name"
                  placeholder="First Name"
                  className="input_wrap"
                  {...register("first_name", { required: true })}
                />
                {errors.first_name &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your First Name.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Last Name <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="LastName"
                  name="last_name"
                  placeholder="Last Name"
                  className="input_wrap"
                  // className="p-2 w-full"
                  {...register("last_name", { required: true })}
                />
                {errors.last_name &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Last Name.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Email <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="Email"
                  name="email"
                  placeholder="Email"
                  className="input_wrap"
                  // className="p-2 w-full"
                  {...register("email", { required: true })}
                />
                {errors.email &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Email.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Mobile No. <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="MobileNumber"
                  name="mobile_number"
                  placeholder="Mobile Number"
                  className="input_wrap"
                  // className="p-2 w-full"
                  {...register("mobile_number", { required: true })}
                />
                {errors.mobile_number &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Mobile Number.
                  </p>}
              </div>
            </div>
          </Col>
          {/* <Col lg={3}>
          <div className="w-full">
            <label className="w-6rem">Birth Date</label>
            <div className="date_select mt-2 mb-3">
              <Calendar
                name="birth_date"
                placeholder="dd/mm/yyyy"
                showIcon
                {...register("birth_date", { required: true })}
              />

              {errors.birth_date &&
                <p className="text-red-500 text-xs mt-1">
                  Please enter your Birth Date.
                </p>}
            </div>
          </div>
        </Col> */}

          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Blood Group <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="BloodGroup"
                  name="blood_group"
                  placeholder="Blood Group"
                  className="input_wrap"
                  {...register("blood_group", { required: true })}
                />
                {errors.blood_group &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Blood Group.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Country <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="Country"
                  name="country"
                  placeholder="Country"
                  className="input_wrap"
                  {...register("country", { required: true })}
                />
                {errors.country &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Country.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                State <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="State"
                  name="state"
                  placeholder="State"
                  className="input_wrap"
                  {...register("state", { required: true })}
                />
                {errors.state &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your State.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full radio-inner-wrap">
              <label className="w-6rem">
                City <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="City"
                  name="city"
                  placeholder="City"
                  className="input_wrap"
                  {...register("city", { required: true })}
                />
                {errors.city &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your City.
                  </p>}
              </div>
            </div>
          </Col>
          {/* <Col lg={3}>
            <div className="radio_wrapper">
              <div className="radio-inner-wrap">
                <RadioButton
                  inputId="Male"
                  name="gender"
                  // value={1}
                  // onChange={e => {
                  //   commonUpdateFieldValue(e.target.name, e.target.value);
                  // }}
                  // onBlur={handleBlur}
                  // checked={values?.gender === 1}
                />
                <label htmlFor="Male" className="ms-md-2 ms-1">
                  Male
                </label>
              </div>
              <div className="radio-inner-wrap">
                <RadioButton
                  inputId="Female"
                  name="gender"
                  // value={1}
                  // onChange={e => {
                  //   commonUpdateFieldValue(e.target.name, e.target.value);
                  // }}
                  // onBlur={handleBlur}
                  // checked={values?.gender === 1}
                />
                <label htmlFor="Female" className="ms-md-2 ms-1">
                  Female
                </label>
              </div>
            </div>
          </Col> */}
        </Row>
      </div>
      <h6 className="fw-bold">Office Details</h6>
      <div className="form_container">
        <Row>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Company Name <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="CompanyName"
                  name="company_name"
                  placeholder="Company Name"
                  className="input_wrap"
                  {...register("company_name", { required: true })}
                />
                {errors.company_name &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Company Name.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                User Email ID <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="UserEmailID"
                  name="user_email"
                  placeholder="User Email"
                  className="input_wrap"
                  {...register("user_email", { required: true })}
                />
                {errors.user_email &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your email.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Password <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="Password"
                  name="password"
                  placeholder="Password"
                  className="input_wrap"
                  {...register("password", { required: true })}
                />
                {errors.password &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Password.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Emp No <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  id="EmpNo"
                  name="emp_no"
                  placeholder="Emp No"
                  className="input_wrap"
                  {...register("emp_no", { required: true })}
                />
                {errors.emp_no &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Emp No.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
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
                  // value={values?.role}
                  {...register("role", { required: true })}
                />
                {errors.role &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter Role.
                  </p>}
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="me-10 flex justify-end items-center gap-3">
        <Button label="Cancel" className="btn_transperent" />
        <Button type="submit" label="Submit" className="btn_primary" />
      </div>
    </form>
  );
};

export default memo(EmployeeForm);
