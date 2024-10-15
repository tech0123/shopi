// import connectToMongo from "@/lib/db";
// import Attendance from "@/lib/models/AttendanceModel";
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//     await connectToMongo();

//     try {
//         const { employee_id, name, date, check_in, check_out } = await request.json();

//         let attendanceRecord = await Attendance.findOne({ employee_id });

//         if (!attendanceRecord) {
//             attendanceRecord = new Attendance({ employee_id, name, attendance_by_date: {} });
//         }
//         if (!attendanceRecord.attendance_by_date) {
//             attendanceRecord.attendance_by_date = {};
//         }



//         if (check_in) {
//             attendanceRecord.attendance_by_date[date] = {
//                 ...attendanceRecord.attendance_by_date[date],
//                 check_in: check_in,
//                 check_out: '',
//             };
//             await attendanceRecord.save();
//         }

//         if (check_out) {
//             await Attendance.findByIdAndUpdate(
//                 attendanceRecord._id,
//                 {
//                     $set: {
//                         [`attendance_by_date.${date}.check_out`]: check_out
//                     }
//                 },
//                 { new: true }
//             );
//         }

//         const allData = await Attendance.find();

//         return NextResponse.json({
//             data: allData || [],
//             err: 0,
//             success: true,
//             msg: `Attendance for ${date} saved successfully`
//         }, { status: 201 });

//     } catch (error) {
//         return NextResponse.json({ err: 1, success: false, msg: error.message }, { status: 500 });
//     }
// }
// import connectToMongo from "@/lib/db";
// import Attendance from "@/lib/models/AttendanceModel";
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//     await connectToMongo();

//     try {
//         const { employee_id, name, date, check_in, check_out } = await request.json();

//         // Find the attendance record for the employee
//         let attendanceRecord = await Attendance.findOne({ employee_id });

//         if (!attendanceRecord) {
//             // If no record exists, create a new one
//             attendanceRecord = new Attendance({
//                 employee_id,
//                 name,
//                 attendance_by_date: {},
//             });
//         }

//         // Ensure the attendance_by_date field is initialized
//         if (!attendanceRecord.attendance_by_date) {
//             attendanceRecord.attendance_by_date = {};
//         }

//         // If check_in and check_out both are provided, update both
//         if (check_in && check_out) {
//             attendanceRecord.attendance_by_date[date] = {
//                 ...attendanceRecord.attendance_by_date[date],
//                 check_in,
//                 check_out,
//             };
//             await attendanceRecord.save();
//         } else {
//             // Update only check_in or check_out if they are provided individually
//             if (check_in) {
//                 attendanceRecord.attendance_by_date[date] = {
//                     ...attendanceRecord.attendance_by_date[date],
//                     check_in,
//                     check_out: attendanceRecord.attendance_by_date[date]?.check_out || '', // Preserve existing check_out if present
//                 };
//                 await attendanceRecord.save();
//             }

//             if (check_out) {
//                 await Attendance.findByIdAndUpdate(
//                     attendanceRecord._id,
//                     {
//                         $set: {
//                             [`attendance_by_date.${date}.check_out`]: check_out,
//                         },
//                     },
//                     { new: true }
//                 );
//             }
//         }

//         // Fetch all updated attendance data
//         const allData = await Attendance.find();

//         return NextResponse.json({
//             data: allData || [],
//             err: 0,
//             success: true,
//             msg: `Attendance for ${date} saved successfully`,
//         }, { status: 201 });

//     } catch (error) {
//         return NextResponse.json({
//             err: 1,
//             success: false,
//             msg: error.message,
//         }, { status: 500 });
//     }
// }
import connectToMongo from "@/lib/db";
import Attendance from "@/lib/models/AttendanceModel";
import { NextResponse } from 'next/server';

export async function POST(request) {
    await connectToMongo();

    try {
        const { employee_id, name, date, check_in, check_out } = await request.json();

        // Find the attendance record for the employee
        let attendanceRecord = await Attendance.findOne({ employee_id });

        // If no record exists, create a new one
        if (!attendanceRecord) {
            attendanceRecord = new Attendance({ employee_id, name, attendance_by_date: {} });
        }

        // Initialize the attendance_by_date if it doesn't exist
        if (!attendanceRecord.attendance_by_date) {
            attendanceRecord.attendance_by_date = {};
        }

        // Handle check_in logic
        if (check_in) {
            // Create or update the date entry with check_in
            attendanceRecord.attendance_by_date[date] = {
                ...attendanceRecord.attendance_by_date[date], // Preserve existing data
                check_in: check_in,
                // Ensure check_out is preserved if already exists
                check_out: attendanceRecord.attendance_by_date[date]?.check_out || '',
            };
        }

        // Handle check_out logic
        if (check_out) {
            // Ensure there is an entry for the date
            if (!attendanceRecord.attendance_by_date[date]) {
                attendanceRecord.attendance_by_date[date] = {}; // Create an empty entry if it doesn't exist
            }
            attendanceRecord.attendance_by_date[date].check_out = check_out; // Update check_out
        }

        // Save the attendance record (it will save check_in and check_out as needed)
        await attendanceRecord.save();

        // Fetch all updated attendance data
        const allData = await Attendance.find();

        return NextResponse.json({
            data: allData || [],
            err: 0,
            success: true,
            msg: `Attendance for ${date} saved successfully`
        }, { status: 201 });

    } catch (error) {
        console.error('Error saving attendance:', error); // Log the error for debugging
        return NextResponse.json({ err: 1, success: false, msg: error.message }, { status: 500 });
    }
}
