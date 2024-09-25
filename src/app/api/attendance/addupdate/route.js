import connectToMongo from "@/lib/db";
import Attendance from "@/lib/models/AttendanceModel";
import { NextResponse } from 'next/server';

export async function POST(request) {
    await connectToMongo();

    try {
        const { employee_id, name, date, check_in, check_out } = await request.json();

        let attendanceRecord = await Attendance.findOne({ employee_id });

        if (!attendanceRecord) {
            attendanceRecord = new Attendance({ employee_id, name, attendance_by_date: {} });
        }
        if (!attendanceRecord.attendance_by_date) {
            attendanceRecord.attendance_by_date = {};
        }

        if (check_in) {
            attendanceRecord.attendance_by_date[date] = {
                ...attendanceRecord.attendance_by_date[date],
                check_in,
                check_out: '',
            };
            await attendanceRecord.save();
        }

        if (check_out) {
            await Attendance.findByIdAndUpdate(
                attendanceRecord._id,
                {
                    $set: {
                        [`attendance_by_date.${date}.check_out`]: check_out
                    }
                },
                { new: true }
            );
        }

        const allData = await Attendance.find();


        return NextResponse.json({
            data: allData || [],
            err: 0,
            success: true,
            msg: `Attendance for ${date} saved successfully`
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ err: 1, success: false, msg: error.message }, { status: 500 });
    }
}
