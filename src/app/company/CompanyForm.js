"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputText } from "primereact/inputtext";
import React, { memo } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

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

const CompanyForm = () => {
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

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h5 className="fw-bold">Company Profile</h5>
      <div className="form_container">
        <Row>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Company Name <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
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
                Legal Name <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  name="legal_name"
                  placeholder="Legal Name"
                  className="input_wrap"
                  // className="p-2 w-full"
                  {...register("legal_name", { required: true })}
                />
                {errors.legal_name &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Legal Name.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Business Type <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  name="business_type"
                  placeholder="Business Type"
                  className="input_wrap"
                  // className="p-2 w-full"
                  {...register("business_type", { required: true })}
                />
                {errors.business_type &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Business Type.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Director Name <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  name="director_name"
                  placeholder="Director Name"
                  className="input_wrap"
                  {...register("director_name", { required: true })}
                />
                {errors.director_name &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Director Name.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Email Id <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  name="email_id"
                  placeholder="Email Id"
                  className="input_wrap"
                  {...register("email_id", { required: true })}
                />
                {errors.email_id &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Email Id.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                Mobile No <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  name="mobile_no"
                  placeholder="Mobile No"
                  className="input_wrap"
                  {...register("mobile_no", { required: true })}
                />
                {errors.mobile_no &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your Mobile No.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full">
              <label className="w-6rem">
                PAN No <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  name="pan_no"
                  placeholder="PAN No"
                  className="input_wrap"
                  {...register("pan_no", { required: true })}
                />
                {errors.pan_no &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your PAN No.
                  </p>}
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="w-full radio-inner-wrap">
              <label className="w-6rem">
                GST No <span className="text-danger fs-6">*</span>
              </label>
              <div className="mt-2 mb-3">
                <InputText
                  name="GST_no"
                  placeholder="GST No"
                  className="input_wrap"
                  {...register("GST_no", { required: true })}
                />
                {errors.GST_no &&
                  <p className="text-red-500 text-xs mt-1">
                    Please enter your GST No.
                  </p>}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default memo(CompanyForm);
