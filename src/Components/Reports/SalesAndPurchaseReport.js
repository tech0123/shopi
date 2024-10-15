'use client';
import { memo, useEffect, useMemo } from "react";
import Highcharts from 'highcharts';
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import HighchartsReact from "highcharts-react-official";
import variablePie from 'highcharts/modules/variable-pie.js';

// variablePie(Highcharts);

const SalesAndPurchaseReport = () => {
  const { reportsData } = useSelector(({ report }) => report)

  useEffect(() => {
    import('highcharts/modules/variable-pie')
      .then((module) => {
        module.default(Highcharts);
      })
      .catch((error) => {
        console.error("Failed to load Highcharts variable-pie module:", error);
      });
  }, []);

  const salesOptionsData = useMemo(() => {
    let salesData = [];

    if (reportsData?.sales_report_data?.list?.length > 0) {
      salesData = reportsData?.sales_report_data?.list?.map(item => {
        return item?.amount;
      });
    }

    const options = {
      chart: {
        type: 'column',
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: reportsData?.sales_report_data?.date || [],
        crosshair: false,
        labels: {
          style: {
            color: '#7B7B7B',
          },
        },
        lineColor: '#D7D7D7',
        lineWidth: 1,
      },
      yAxis: {
        title: {
          text: 'Total Sales',
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data: salesData,
          color: '#373AA5',
          pointWidth: 10,
          name: 'Sales',
        },
      ],
      tooltip: {
        formatter: function () {
          return (
            '<div>' +
            '<span class="tooltip-x">' +
            this.x +
            '</span>' +
            '</div>' +
            '<div> <br>' +
            '<span style="color:' +
            this.point.color +
            '">\u25CF</span> <b>' +
            this.series.name +
            '</b> - ' +
            this.y +
            '</div>'
          );
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
          },
        ],
      },
    };

    return options;
  }, [reportsData?.sales_report_data?.list]);

  const purchaseOptionsData = useMemo(() => {
    let purchaseData = [];

    if (reportsData?.purchase_report_data?.list?.length > 0) {
      purchaseData = reportsData?.purchase_report_data?.list?.map(item => {
        return item?.amount;
      });
    }

    const options = {
      chart: {
        type: 'column',
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: reportsData?.purchase_report_data?.date || [],
        crosshair: false,
        labels: {
          style: {
            color: '#7B7B7B',
          },
        },
        lineColor: '#D7D7D7',
        lineWidth: 1,
      },
      yAxis: {
        title: {
          text: 'Total Purchase',
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data: purchaseData,
          color: '#373AA5',
          pointWidth: 10,
          name: 'Purchase',
        },
      ],
      tooltip: {
        formatter: function () {
          return (
            '<div>' +
            '<span class="tooltip-x">' +
            this.x +
            '</span>' +
            '</div>' +
            '<div> <br>' +
            '<span style="color:' +
            this.point.color +
            '">\u25CF</span> <b>' +
            this.series.name +
            '</b> - ' +
            this.y +
            '</div>'
          );
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
          },
        ],
      },
    };

    return options;
  }, [reportsData?.sales_report_data?.list]);

  return (
    <>
      <div className="chat_wrapper storage_back m-5">
        <Row className="g-3">
          <Col lg={6}>
            <div className="chat-inner-wrap">
              <div className="chat_header">
                <Row className="justify-content-between g-2">
                  <Col sm={6}>
                    <div className="chat_header_text">
                      <h5 className="text-yellow-600">Total Sales of Current year</h5>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="chat_box">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={salesOptionsData}
                />
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="chat-inner-wrap">
              <div className="chat_header">
                <Row className="justify-content-between g-2">
                  <Col sm={6}>
                    <div className="chat_header_text">
                      <h5 className="text-yellow-600">Total Purchase of Current year</h5>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="chat_box">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={purchaseOptionsData}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default memo(SalesAndPurchaseReport);