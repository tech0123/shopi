import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { Dialog } from "primereact/dialog";
import { Col, Row } from "react-bootstrap";
import { Button } from "primereact/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import {
  calculateTotal,
  generateUniqueId,
  product_search_key,
} from "@/helper/commonValues";
import { setPurchaseTableData } from "@/store/slice/purchaseSlice";
import CommonInputText from "@/helper/CommonComponent/CommonInputText";
import {
  getAllDataList,
  setCurrentPage,
  setPageLimit,
  setSearchParam,
} from "@/store/slice/commonSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomPaginator from "@/helper/CommonComponent/CustomPaginator";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import _ from "lodash";
import Image from "next/image";
import { useParams } from "next/navigation";

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

const PurchaseTableDialog = (props) => {
  const dispatch = useDispatch();
  const { purchaseId } = useParams();
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProductData, setSelectedProductData] = useState({});
  const [showHideProductData, setShowHideProductData] = useState(false);

  const {
    intialDialogState,
    purchaseTableDialog,
    selectedPurchaseData,
    setPurchaseTableDialog,
    onPageChange,
    onPageRowsChange,
  } = props;

  const { purchaseTableData } = useSelector(({ purchase }) => purchase);
  const { allProductList } = useSelector(({ productItem }) => productItem);
  const { searchParam, pageLimit, currentPage } = useSelector(
    ({ common }) => common
  );

  // const productsOptions = useMemo(() => {
  //   if(allProductList?.list?.length){
  //     const data = allProductList?.list?.map(item => ({
  //       label: item?.name,
  //       value: item?._id
  //     }));
  //     return data;
  //   }
  // },[allProductList])

  const filteredProductData = useMemo(() => {
    let data = [];
    if (allProductList?.list?.length) {
      data = allProductList?.list
        ?.map((item) => {
          const isProductAvailable = purchaseTableData.every((data) => {
            return data?.product !== item?._id && item;
          });

          if (!purchaseTableData?.length || isProductAvailable) {
            return item;
          }
        })
        .filter((item) => item);
    }

    return data;
    // setProductOptions(data)
  }, [allProductList?.list]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: selectedPurchaseData,
  });

  useEffect(() => {
    return () => {
      methods.reset(intialDialogState);
    };
  }, [intialDialogState, methods]);

  useEffect(() => {
    if (selectedPurchaseData) {
      methods.reset(selectedPurchaseData);
    }
  }, [selectedPurchaseData]);

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
      // if (res) {
      //     dispatch(setAllProductsData(modifyProducts(res)))
      // }
    },
    []
  );

  const handleProuctChange = (item) => {
    const value = item?._id;
    setShowHideProductData(false);

    const fieldsObj = {
      ...item,
      product: value,
      selling_price: "",
    };
    dispatch(setSearchParam(item?.name));
    setSelectedProductData(fieldsObj);
    methods.reset(fieldsObj);
  };

  const onSubmit = (data) => {
    let storePurchaseTableData = [...purchaseTableData];
    const productOptionData = allProductList?.list?.find(
      (item) => item?._id === data?.product
    );

    if (data?.unique_id) {
      let purchaseData = [...purchaseTableData];
      const index = purchaseData?.findIndex(
        (index) => index?.unique_id === data?.unique_id
      );

      if (index !== -1) {
        const oldObj = purchaseData[index];
        const newObj = {
          ...oldObj,
          ...data,
          product_name: productOptionData?.name,
        };
        purchaseData[index] = newObj;
      }

      storePurchaseTableData = purchaseData;
    } else {
      const updatedObj = {
        ...data,
        unique_id: generateUniqueId(),
        product_name: productOptionData?.name,
      };

      storePurchaseTableData = [...purchaseTableData, updatedObj];
    }

    dispatch(setPurchaseTableData(storePurchaseTableData));
    setPurchaseTableDialog(false);
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
                ADD
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
            value={searchParam}
            onChange={(e) => {
              setSelectedProductData({});
              debounceHandleSearchInput(e);
              dispatch(setSearchParam(e.target.value));
              setShowHideProductData(true);
              if (!e.target.value) {
                setShowHideProductData(false);
              }
            }}
            disabled={purchaseId}
          />
        </IconField>
      </div>
    );
  };
  console.log("filteredProductData", filteredProductData);
  return (
    <Dialog
      visible={purchaseTableDialog}
      style={{ width: "55rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={`${methods.watch("unique_id") ? "Edit" : "Add"} Purchase Item`}
      modal
      className="p-fluid common_modal purchase_modal"
      onHide={() => setPurchaseTableDialog(false)}
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
                setPurchaseTableDialog(false);
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

export default PurchaseTableDialog;
