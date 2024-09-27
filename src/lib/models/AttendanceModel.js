
import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
    employee_id: { type: String, required: true },
    name: { type: String, required: true },
    attendance_by_date: { type: mongoose.Schema.Types.Mixed }
});

const Attendance = mongoose.models.attendances || mongoose.model("attendances", AttendanceSchema);

export default Attendance;
