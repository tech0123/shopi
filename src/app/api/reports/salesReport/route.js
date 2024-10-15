import connectToMongo from "@/lib/db";
import { NextResponse } from "next/server";
import Sales from "@/lib/models/SalesModel";
import Purchase from "@/lib/models/PurchaseModal";
import { convertIntoNumber, getFormattedDate } from "@/helper/commonValues";

const getMonthsBetween = (start, end) => {
  const months = [];
  const date = new Date(start);

  while (date <= end) {
    const da = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    months.push(da);
    date.setMonth(date.getMonth() + 1);
  }
  return months;
}

export async function POST(request) {
  await connectToMongo();

  try {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setFullYear(currentDate.getFullYear() - 1);
    const endDate = new Date(currentDate);
    const formattedEndDate = getFormattedDate(endDate);
    const formattedStartDate = getFormattedDate(startDate);
    const monthsArray = getMonthsBetween(startDate, endDate);

    const updatedTableData = (tableData) => {
      const updatedData = monthsArray.map((item) => {
        const findData = tableData?.filter((purchaseData) => { 
          const date1 = new Date(purchaseData?.date);
          const date2 = new Date(item);
          const checkCondition = date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
          return checkCondition;
        });

        if(findData?.length){
          let calculated_amount = 0;
          findData?.map((data) => {
            calculated_amount += data.amount;
          })

          return { date: item, amount: convertIntoNumber(calculated_amount) }
        } else {
          return { date: item, amount: 0 }
        }
      })
      return updatedData;
    }

    const sales_query = {
      sales_date: {
        $gte: formattedStartDate,
        $lte: formattedEndDate
      }
    };

    const purchase_query = {
        purchase_date: {
          $gte: formattedStartDate,
          $lte: formattedEndDate
        }
    };

    const salesResult = await Sales.aggregate([
      { $match: sales_query },
      {
        // $project: {
        //   _id: 0,
        //   date: {
        //     $dateToString: {
        //       format: "%m-%Y",
        //       date: { $toDate: "$sales_date" }
        //     }
        //   },
        //   amount: { $toDouble: "$total_amount" }
        // }
        $project: {
          _id: 0,
          date: {
            $concat: [
              {
                $switch: {
                  branches: [
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 1] }, then: "Jan" },
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 2] }, then: "Feb" },
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 3] }, then: "Mar" },
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 4] }, then: "Apr" },
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 5] }, then: "May" },
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 6] }, then: "Jun" },
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 7] }, then: "Jul" },
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 8] }, then: "Aug" },
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 9] }, then: "Sep" },
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 10] }, then: "Oct" },
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 11] }, then: "Nov" },
                    { case: { $eq: [{ $month: { $toDate: "$sales_date" } }, 12] }, then: "Dec" }
                  ],
                  default: null
                }
              },
              "-",
              { $dateToString: { format: "%Y", date: { $toDate: "$sales_date" } } }
            ]
          },
          amount: { $toDouble: "$total_amount" }
        }
      }
    ]);

    const getSalesTotalAmount = await Sales.aggregate([
      { $match: sales_query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $toDouble: "$total_amount" } }
        }
      }
    ]);

    const purchaseResult = await Purchase.aggregate([
      { 
        $match: purchase_query
      },
      {
        // $project: {
        //   _id: 0,
        //   date: {
        //     $cond: {
        //       if: { $gt: [{ $type: "$purchase_date" }, "missing"] },
        //       then: {
        //         $dateToString: {
        //           format: "%m-%Y",
        //           date: { $toDate: "$purchase_date" }
        //         }
        //       },
        //       else: null
        //     }
        //   },
        //   amount: {
        //     $cond: {
        //       if: { $gt: [{ $type: "$total_amount" }, "missing"] },
        //       then: { $toDouble: "$total_amount" },
        //       else: 0
        //     }
        //   }
        // }
        $project: {
          _id: 0,
          date: {
            $cond: {
              if: { $gt: [{ $type: "$purchase_date" }, "missing"] },
              then: {
                $concat: [
                  { 
                    $switch: {
                      branches: [
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 1] }, then: "Jan" },
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 2] }, then: "Feb" },
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 3] }, then: "Mar" },
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 4] }, then: "Apr" },
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 5] }, then: "May" },
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 6] }, then: "Jun" },
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 7] }, then: "Jul" },
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 8] }, then: "Aug" },
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 9] }, then: "Sep" },
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 10] }, then: "Oct" },
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 11] }, then: "Nov" },
                        { case: { $eq: [{ $month: { $toDate: "$purchase_date" } }, 12] }, then: "Dec" }
                      ],
                      default: null
                    }
                  },
                  "-",
                  { $dateToString: { format: "%Y", date: { $toDate: "$purchase_date" } } }
                ]
              },
              else: null
            }
          },
          amount: {
            $cond: {
              if: { $gt: [{ $type: "$total_amount" }, "missing"] },
              then: { $toDouble: "$total_amount" },
              else: 0
            }
          }
        }
      }
    ]);

    const getPurchaseTotalAmount = await Purchase.aggregate([
      { $match: purchase_query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $toDouble: "$total_amount" } }
        }
      }
    ]);

    const totalAmounts = {
        sales: getSalesTotalAmount?.length > 0 ? getSalesTotalAmount[0].totalAmount : 0,
        purchase: getPurchaseTotalAmount?.length > 0 ? getPurchaseTotalAmount[0].totalAmount : 0
    }

    const updateSalesResult = updatedTableData(salesResult)
    const updatePurchaseResult = updatedTableData(purchaseResult) 

    return NextResponse.json(
      {
        status: 200,
        err: 0,
        sales_report_data: {
          list: updateSalesResult || [],
          date: monthsArray || [],
          total_count: totalAmounts?.sales || 0
        },
        purchase_report_data: {
          list: updatePurchaseResult || [],
          date: monthsArray || [],
          total_count: totalAmounts?.purchase || 0
        },
        msg: `Get Reports data successfully`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sales data:", error); // Log the error for debugging
    return NextResponse.json(
      { data: [], err: 1, success: false, msg: error.message },
      { status: 500 }
    );
  }
}
