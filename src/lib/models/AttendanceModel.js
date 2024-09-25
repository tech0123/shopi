
import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
    employee_id: { type: String, required: true },
    name: { type: String, required: true },
    attendance_by_date: { type: mongoose.Schema.Types.Mixed }
});

const Attendance = mongoose.models.attendance || mongoose.model("attendance", AttendanceSchema);

export default Attendance;
