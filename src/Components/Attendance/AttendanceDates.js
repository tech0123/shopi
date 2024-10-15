"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { memo } from "react";

const getLast6Months = () => {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const months = [];
    const today = new Date();

    today.setMonth(today.getMonth() - 1);

    for (let i = 0; i < 6; i++) {
        const month = today.getMonth();
        months.push(monthNames[month]);
        today.setMonth(today.getMonth() - 1);
    }

    return months;
};

const getLast30Dates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const pastDate = new Date(today.getTime());
        pastDate.setDate(today.getDate() - i);
        dates.push(pastDate.toISOString().split('T')[0]);
    }
    return dates;
};

const getDatesForMonth = (monthOffset) => {
    const today = new Date();
    today.setMonth(today.getMonth() - monthOffset);
    const selectedMonthDates = [];

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
        selectedMonthDates.push(day.toISOString().split('T')[0]);
    }

    return selectedMonthDates.reverse();
};

const AttendanceDates = () => {
    const [data, setData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('30 DAYS');
    const last6Months = getLast6Months();
    const router = useRouter();

    const fetchAttendanceList = useCallback(() => {
        const last30Dates = getLast30Dates();
        const dateList = last30Dates.map((date) => ({
            id: date,
            date,
        }));
        setData(dateList);
    }, []);

    useEffect(() => {
        fetchAttendanceList();
    }, [fetchAttendanceList]);

    const viewBodyTemplete = (item) => {
        return (
            <Button onClick={() => {
                router.push(`/attendanceDates/${item?.date}`);
                console.log('Hello');
            }}>View</Button>
        );
    };

    const handleMonthClick = (month, monthIndex) => {
        setSelectedFilter(month);
        const monthDates = getDatesForMonth(monthIndex);
        const filteredData = monthDates.map((date) => ({
            id: date,
            date,
        }));
        setData(filteredData);
    };

    const handle30DaysClick = () => {
        setSelectedFilter('30 DAYS');
        fetchAttendanceList();
    };

    return (
        <>
            <div className="flex justify-center space-x-2 mb-5 mt-4 mx-4">
                <button
                    className={`px-4 py-2 rounded-lg border ${selectedFilter === '30 DAYS' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
                    onClick={handle30DaysClick}
                >
                    30 DAYS
                </button>
                {last6Months.map((month, index) => (
                    <button
                        key={month}
                        className={`px-4 py-2 rounded-lg border ${selectedFilter === month ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
                        onClick={() => handleMonthClick(month, index)}
                    >
                        {month}
                    </button>
                ))}
            </div>

            <div className="table_wrapper mt-5">
                <DataTable value={data} dataKey="id" className="max-lg:hidden">
                    <Column field="date" header="Date" style={{ minWidth: "12rem" }} sortable />
                    <Column field="action" header="Action" style={{ minWidth: "12rem" }} body={viewBodyTemplete} sortable />
                </DataTable>
            </div>
        </>
    );
};

export default memo(AttendanceDates);
