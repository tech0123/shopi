import React, { useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import * as yup from "yup";
import Image from "next/image";
import { Col, Row } from "react-bootstrap";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Column } from "primereact/column";
import { useParams } from "next/navigation";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import CustomPaginator from "@/helper/CommonComponent/CustomPaginator";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import { getAllDataList, setCurrentPage } from "@/store/slice/commonSlice";
import { generateUniqueId, product_search_key } from "@/helper/commonValues";
import {
  setSalesItemSearchParam,
  setSalesTableData,
} from "@/store/slice/salesSlice";

const schema = yup.object().shape({
  product: yup.string().required("Please enter Product Name."),
  description: yup.string().required("Please enter Description."),
  quantity: yup.string().required("Please enter Quantity."),
  tax: yup.string().required("Please enter Tax."),
  selling_price: yup.string().required("Please enter Selling Price."),
  cost_price: yup.string().required("Please enter Cost Price."),
});

const inputFieldsList = [
  // {
  //   fieldTitle: "Product",
  //   fieldId: "Product",
  //   fieldName: "product",
  //   type:'single_select',
  //   options: productsOptions,
  //   isequired: true
  // },
  {
    fieldTitle: "Cost Price",
    fieldId: "CostPrice",
    fieldName: "cost_price",
    isequired: true,
  },
  { fieldTitle: "Tax", fieldId: "Tax", fieldName: "tax", isequired: true },
  {
    fieldTitle: "Description",
    fieldId: "Description",
    fieldName: "description",
    isequired: true,
  },
  {
    fieldTitle: "Quantity",
    fieldId: "Quantity",
    fieldName: "quantity",
    isequired: true,
  },
  {
    fieldTitle: "Selling Price",
    fieldId: "SellingPrice",
    fieldName: "selling_price",
    isequired: true,
  },
];

const SalesTableDialog = (props) => {
  const dispatch = useDispatch();
  const { salesId } = useParams();
  const {
    intialDialogState,
    salesTableDialog,
    selectedSalesItemData,
    setSalesTableDialog,
    onPageChange,
    onPageRowsChange,
  } = props;

  const [selectedProductData, setSelectedProductData] = useState({});
  const [showHideProductData, setShowHideProductData] = useState(false);

  const { salesTableData, salesItemSearchParam } = useSelector(
    ({ sales }) => sales
  );
  const { allProductList } = useSelector(({ productItem }) => productItem);
  const { searchParam, pageLimit, currentPage } = useSelector(
    ({ common }) => common
  );

  const filteredProductData = useMemo(() => {
    let data = [];
    if (allProductList?.list?.length) {
      data = allProductList?.list
        ?.map((item) => {
          const isProductAvailable = salesTableData.every((data) => {
            return data?.product !== item?._id && item;
          });

          if (!salesTableData?.length || isProductAvailable) {
            return item;
          }
        })
        .filter((item) => item);
    }

    return data;
  }, [allProductList?.list]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedSalesItemData,
  });

  const values = methods.getValues();

  useEffect(() => {
    return () => {
      methods.reset(intialDialogState);
    };
  }, []);

  useEffect(() => {
    if (selectedSalesItemData) {
      methods.reset(selectedSalesItemData);
    }
  }, [selectedSalesItemData]);

  const fetchProductList = useCallback(
    async (key_name, start = 1, limit = 7, search = "") => {
      const payload = {
        modal_to_pass: key_name,
        start: start,
        limit: limit,
        search: search?.trim(),
        search_key: product_search_key,
      };
      const res = await dispatch(getAllDataList(payload));
    },
    []
  );

  const handleProuctChange = (item) => {
    const value = item?._id;
    setShowHideProductData(false);

    const fieldsObj = {
      tax: item?.tax,
      product: value,
      product_name: item?.name,
      cost_price: item?.cost_price,
      description: item?.description,
      quantity: "",
      selling_price: "",
    };

    dispatch(setSalesItemSearchParam(item?.name));
    setSelectedProductData(fieldsObj);
    methods.reset((prev) => ({ ...prev, ...fieldsObj }));
  };

  const onSubmit = (data) => {
    let storeSalesTableData = [...salesTableData];
    // const productOptionData = allProductList?.list?.find((item) => item?._id === data?.product)

    if (data?.unique_id) {
      const index = storeSalesTableData?.findIndex(
        (index) => index?.unique_id === data?.unique_id
      );

      if (index !== -1) {
        const oldObj = storeSalesTableData[index];
        const newObj = {
          ...oldObj,
          ...data,
          // product_name: productOptionData?.name
        };

        storeSalesTableData[index] = newObj;
      }
    } else {
      const updatedObj = {
        ...data,
        unique_id: generateUniqueId(),
        // product_name: productOptionData?.name,
      };

      storeSalesTableData = [...storeSalesTableData, updatedObj];
    }

    dispatch(setSalesTableData(storeSalesTableData));
    setSalesTableDialog(false);
  };

  const handleSearchInput = (e) => {
    dispatch(setCurrentPage(1));

    fetchProductList(
      "Products",
      currentPage,
      pageLimit,
      e.target.value?.trim()
    );
  };

  const debounceHandleSearchInput = useCallback(
    _.debounce((e) => {
      handleSearchInput(e);
    }, 800),
    []
  );

  const header = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-content-between align-items-center mb-4">
        <IconField iconPosition="right" className="min-w-full min-h-10">
          <InputIcon className="pi pi-search mr-3" />
          <InputText
            id="Search"
            placeholder="Search Product"
            type="search"
            className="input_wrap small search_wrap"
            value={salesItemSearchParam}
            onChange={(e) => {
              setSelectedProductData({});
              debounceHandleSearchInput(e);
              dispatch(setSalesItemSearchParam(e.target.value));
              setShowHideProductData(true);
              if (!e.target.value) {
                setShowHideProductData(false);
              }
            }}
            disabled={values?.unique_id}
          />
        </IconField>
      </div>
    );
  };

  const multiBodyTemplate = (data) => {
    return (
      <div className="container flex flex-col w-full">
        <div className="flex justify-center p-1">
          <Image src={data.image} alt={data?._id} width={150} height={150} />
        </div>
        <div className="flex flex-1 bg-gray-900 amount_content mt-2">
          <div className="flex-1 p-3">
            <p className="text-left">Name: {data.name}</p>
            <p className="text-left">Code: {data?.code}</p>
            <div className="flex justify-center">
              <Button
                className="btn_primary"
                onClick={(e) => {
                  e.preventDefault();
                  handleProuctChange(data);
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      visible={salesTableDialog}
      style={{ width: "55rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={`${methods.watch("unique_id") ? "Edit" : "Add"} Sales Item`}
      modal
      className="p-fluid common_modal"
      onHide={() => setSalesTableDialog(false)}
      draggable={false}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="form_container max-lg:p-0 max-lg:m-0">
            <Row>
              <Col lg={12}>
                {/* <CommonInputText
                  type='single_select'
                  title="Product" 
                  id="Product"
                  name='product' 
                  options={productOptions} 
                  isRequired={true}
                  fieldOnChange={(e) => {
                    handleProuctChange(e)
                  }}
                /> */}
                <DataTable
                  className="!p-0 modal_datatable"
                  value={
                    showHideProductData === "" ? [{}] : filteredProductData
                  }
                  header={header}
                  rows={10}
                >
                  {showHideProductData ? (
                    <Column
                      headerStyle={{ width: "8rem", textAlign: "center" }}
                      bodyStyle={{
                        overflow: "visible",
                        padding: "0 !important",
                      }}
                      body={multiBodyTemplate}
                    />
                  ) : null}
                </DataTable>
                {showHideProductData && (
                  <CustomPaginator
                    dataList={filteredProductData}
                    pageLimit={pageLimit}
                    onPageChange={(page) => onPageChange(page, "Products")}
                    onPageRowsChange={(page) =>
                      onPageRowsChange(page, "Products")
                    }
                    currentPage={currentPage}
                    totalCount={allProductList?.totalRows}
                  />
                )}
              </Col>
              {!showHideProductData &&
                inputFieldsList.map((field, i) => {
                  return (
                    <Col lg={6} key={i}>
                      <CommonInputText
                        id={field?.fieldId}
                        title={field?.fieldTitle}
                        body={field?.fieldBody}
                        name={field?.fieldName}
                        type={field?.type}
                        options={field?.options}
                        isRequired={field?.isequired}
                      />
                    </Col>
                  );
                })}
            </Row>
          </div>
          <div className="flex justify-content-end items-center gap-4 common_modal_btn_group">
            <Button
              className="btn_transparent"
              onClick={(e) => {
                e.preventDefault();
                setSalesTableDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn_primary gradient_common_btn">
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default SalesTableDialog;
