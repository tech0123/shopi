"use client";
import { memo, useEffect, useMemo } from "react";
import Highcharts, { color } from "highcharts";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Chart } from "primereact/chart";

// variablePie(Highcharts);

const SalesAndPurchaseReport = () => {
  const { reportsData } = useSelector(({ report }) => report);

  useEffect(() => {
    import("highcharts/modules/variable-pie")
      .then((module) => {
        module.default(Highcharts);
      })
      .catch((error) => {
        console.error("Failed to load Highcharts variable-pie module:", error);
      });
  }, []);

  const options = {
    scales: {
      x: {
        ticks: {
          color: "#ffff", // Set the X-axis label color
        },
      },
      y: {
        grid: {
          color: "grey", // Set the Y-axis grid line color
        },
        beginAtZero: true,
        ticks: {
          color: "#ffff", // Set the Y-axis label color
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
  };

  const salesData = reportsData?.sales_report_data?.list?.map((item) => {
    return item.amount;
  });

  const purchaseData = reportsData?.purchase_report_data?.list?.map((item) => {
    return item.amount;
  });

  const displayPurchaseData = {
    labels: reportsData?.purchase_report_data?.date,
    datasets: [
      {
        label: "Purchase",
        data: purchaseData,
        backgroundColor: ["#ffff"],
        borderColor: ["#ffff"],
        borderWidth: 1,
      },
    ],
  };

  // console.log(reportsData?.sales_report_data?.date);

  const displaySalesData = {
    labels: reportsData?.sales_report_data?.date,
    datasets: [
      {
        label: "Sales",
        data: salesData,
        backgroundColor: ["#ffff"],
        borderColor: ["#ffff"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Row className=" reports_title_card_item m-0 justify-start flex-wrap">
        <Col lg={3} md={4} sm={6} className="card-items">
          <div className="item-content">
            <h6 className="main_title m-0">{`₹ ${
              reportsData?.purchase_report_data?.total_count || 0
            }`}</h6>
            <h5 className="sub_title m-0">Total Purchase Count</h5>
          </div>
        </Col>
        <Col lg={3} md={4} sm={6} className="card-items">
          <div className="item-content">
            <h6 className="m-0 main_title">{`₹ ${
              reportsData?.sales_report_data?.total_count || 0
            }`}</h6>
            <h5 className="m-0 sub_title">Total Sale</h5>
          </div>
        </Col>
        <Col lg={3} md={4} sm={6} className="card-items">
          <div className="item-content">
            <h6 className="m-0 main_title">$ 24,500</h6>
            <h5 className="m-0 sub_title">Todays Revenue</h5>
          </div>
        </Col>
        <Col lg={3} md={4} sm={6} className="card-items">
          <div className="item-content">
            <h6 className="m-0 main_title">82.8%</h6>
            <h5 className="m-0 sub_title">Conversion Rate</h5>
          </div>
        </Col>
        <Col lg={3} md={4} sm={6} className="card-items">
          <div className="item-content">
            <h6 className="m-0 main_title">$ 9982.00</h6>
            <h5 className="m-0 sub_title">Total Expenses</h5>
          </div>
        </Col>
        <Col lg={3} md={4} sm={6} className="card-items">
          <div className="item-content">
            <h6 className="m-0 main_title">$ 80.5</h6>
            <h5 className="m-0 sub_title">Avg. Value</h5>
          </div>
        </Col>
      </Row>

      <div className="chat_wrapper storage_back">
        <Row className="g-3">
          <Col lg={6} className="mx-0 chart_gap">
            {/* <div className="chart_title">
              <h6 className="value_title m-0">{`₹ ${
                reportsData?.purchase_report_data?.total_count || 0
              }`}</h6>
              <h5 className="total_title m-0">Total Purchase Count</h5>
            </div> */}
            <div className="chat-inner-wrap">
              <div className="chat_header">
                <div className="justify-content-between g-2">
                  <div>
                    <div className="chat_header_text">
                      <h5 className="m-0 header_text">
                        Total Purchase of Current year
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat_box">
                {/* <HighchartsReact
                  highcharts={Highcharts}
                  options={salesOptionsData}
                /> */}
                {/* <div className="card">
                  <Chart type="bar" data={displaySalesData} options={options} />
                </div> */}
                <div className="card">
                  <Chart
                    type="bar"
                    data={displayPurchaseData}
                    options={options}
                  />
                </div>
              </div>
            </div>
          </Col>
          <Col lg={6} className="mx-0 chart_gap">
            {/* <div className="chart_title">
              <h6 className="value_title m-0">{`₹ ${
                reportsData?.sales_report_data?.total_count || 0
              }`}</h6>
              <h5 className="total_title m-0">Total Sale</h5>
            </div> */}
            <div className="chat-inner-wrap">
              <div className="chat_header">
                <div className="justify-content-between g-2">
                  <div>
                    <div className="chat_header_text">
                      <h5 className="m-0 header_text">
                        Total Sales of Current year
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat_box">
                {/* <HighchartsReact
                  highcharts={Highcharts}
                  options={purchaseOptionsData}
                /> */}
                <div className="card">
                  <Chart type="bar" data={displaySalesData} options={options} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* <div className="card">
        <Chart type="bar" data={data} options={options} />
      </div> */}
    </>
  );
};

export default memo(SalesAndPurchaseReport);
