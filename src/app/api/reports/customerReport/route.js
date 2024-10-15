import connectToMongo from "@/lib/db";
import { NextResponse } from "next/server";
import Sales from "@/lib/models/SalesModel";
import { getFormattedDate } from "@/helper/commonValues";

const search_key = ["customer_name", "email", "type", "mobile_number"];

export async function POST(request) {
  await connectToMongo();

  try {
    // let updatedSalesData = []
    // const { start = 1, limit = 7, search = "" } = await request.json();

    // const skip = (start - 1) * limit; // Pagination

    // const currentDate = new Date();
    // const startDate = new Date(currentDate);
    // startDate.setFullYear(currentDate.getFullYear() - 1);
    // const endDate = new Date(currentDate);
    // const formattedEndDate = getFormattedDate(endDate);
    // const formattedStartDate = getFormattedDate(startDate);

    // const query = search
    //   ? {
    //       $or: search_key.map(item => ({
    //         [item]: { $regex: search, $options: "i" }
    //       })),
    //       sales_date: {
    //         $gte: formattedStartDate,
    //         $lte: formattedEndDate
    //       }
    //     }
    //   : {};

    // const salesData = await Sales.find(query).skip(skip).limit(limit).lean();

    // salesData?.map((item) => {
    //     const index = updatedSalesData?.findIndex((d) => d?.customer === item?.customer)

    //     if(index && index !== -1) {
    //         const oldObj = updatedSalesData[index];
    //         const newObj = {
    //             ...oldObj,
    //             total_sales: Number(oldObj?.total_sales) + Number(item?.total_amount)
    //         }
    //         updatedSalesData.push(newObj)
    //     } else {
    //         const newItemObj = {
    //             ...item,
    //             total_sales: Number(item?.total_amount)
    //         }
    //         updatedSalesData.push(newItemObj)
    //     }
    // })

    const { start = 1, limit = 7, search = "" } = await request.json();

    const skip = (start - 1) * limit; // Pagination

    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setFullYear(currentDate.getFullYear() - 1);
    const endDate = new Date(currentDate);

    // If you have a date formatter function (getFormattedDate), you can use it here.
    // Otherwise, we assume MongoDB dates are handled in a standard format.
    const formattedStartDate = startDate;
    const formattedEndDate = endDate;

    // Create the basic query
    const query = search
      ? {
          $or: search_key.map(item => ({
            [item]: { $regex: search, $options: "i" }
          })),
          sales_date: {
            $gte: formattedStartDate,
            $lte: formattedEndDate
          }
        }
      : {};

    const salesResult = await Sales.aggregate([
      { $match: query }, // Filter sales data based on the query
      {
        $group: {
          _id: "$customer", // Group by customer
          customer: { $first: "$customer" }, // Keep the customer field
          customer_name: { $first: "$customer_name" }, // Get customer name
          total_sales: { $sum: { $toDouble: "$total_amount" } }, // Sum total_amount per customer
          sales_data: {
            $push: {
              _id: "$_id", // Keep the original sales record _id
              sales_date: "$sales_date",
              total_amount: { $toDouble: "$total_amount" },
              customer: "$customer",
              customer_name: "$customer_name",
              bill_no: "$bill_no",
              email: "$email",
              mobile_number: "$mobile_number",
              type: "$type",
              address: "$address",
              sub_total: { $toDouble: "$sub_total" },
              tax: "$tax",
              discount: "$discount",
              total_sales: { $toDouble: "$total_amount" } // Add total_sales field per sale
            }
          }
        }
      },
      {
        $project: {
          _id: "$sales_data._id", // Keep the original sales record _id
          sales_date: "$sales_data.sales_date",
          total_amount: "$sales_data.total_amount",
          customer: "$sales_data.customer",
          customer_name: "$sales_data.customer_name",
          bill_no: "$sales_data.bill_no",
          email: "$sales_data.email",
          mobile_number: "$sales_data.mobile_number",
          type: "$sales_data.type",
          address: "$sales_data.address",
          sub_total: "$sales_data.sub_total",
          tax: "$sales_data.tax",
          discount: "$sales_data.discount",
          total_sales: "$sales_data.total_amount" // Add total_sales field per sale
        }
      },
      {
        $sort: { total_sales: -1 } // Sort by total_sales in descending order
      },
      {
        $skip: skip // Pagination skip
      },
      {
        $limit: 20 // Limit the number of results to 20
      }
    ]);

    // Return the result
    // return salesResult;

    return NextResponse.json(
      {
        status: 200,
        err: 0,
        list: salesResult,
        msg: `Get customer report data successfully`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sales data:", error); // Log the error for debugging
    return NextResponse.json(
      { list: {}, err: 1, success: false, msg: error.message },
      { status: 500 }
    );
  }
}
