/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { format, getDaysInMonth, setDate } from "date-fns";
import { database } from "../lib/firebaseConfig";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import editIcon from "../public/editIcon.svg";

export default function Dashboard() {
	const [selectedMonthDays, setSelectedMonthDays] = useState<[]>([]);
	const [allMonthIncome, setAllMonthIncome] = useState<number>(0);
	const [allMonthExpenses, setAllMonthExpenses] = useState<number>(0);
	const [totalEl7agExpenses, setTotalEl7agExpenses] = useState<number>(0);
	const [totalBassemExpenses, setTotalBassemExpenses] = useState<number>(0);
	const [totalMonthIncome, setTotalMonthIncome] = useState<number>(0);
	const [totalMonthExpenses, setTotalMonthExpenses] = useState<number>(0);
	const [currentFetchingMonth, setCurrentFetchingMonth] = useState(format(new Date(), "MM-yyyy"));
	const [currentMonth, setCurrentMonth] = useState("");

	const dbInstance = collection(database, `${currentFetchingMonth}`);
	useEffect(() => {
		(async function () {
			getCurrentMonth();
			await getDocs(dbInstance).then((data) => {
				const monthData: any = data.docs.map((item) => {
					return { ...item.data(), id: item.id };
				});
				setSelectedMonthDays(monthData);
			});
		})();
	}, [currentFetchingMonth]);

	useEffect(() => {
		monthMethods.totalMonthIncome();
		monthMethods.allMonthExpenses();
		monthMethods.allMonthIncome();
		monthMethods.totalEl7agExpenses();
		monthMethods.totalBassemExpenses();
		monthMethods.totalMonthExpenses();
	}, [selectedMonthDays]);

	const monthMethods = {
		allMonthExpenses() {
			const sum = selectedMonthDays.reduce((acc, eachDay: any) => acc + parseInt(eachDay.total_day_expenses), 0);
			setAllMonthExpenses(sum);
			return sum;
		},
		allMonthIncome() {
			const sum = selectedMonthDays.reduce((acc, eachDay: any) => acc + parseInt(eachDay.total_day_income), 0);
			setAllMonthIncome(sum);
			return sum;
		},
		totalEl7agExpenses() {
			const sum = selectedMonthDays.reduce((acc, eachDay: any) => acc + parseInt(eachDay.expensesEl7ag), 0);
			setTotalEl7agExpenses(sum);
			return sum;
		},
		totalBassemExpenses() {
			const sum = selectedMonthDays.reduce((acc, eachDay: any) => acc + parseInt(eachDay.expensesBassem), 0);
			setTotalBassemExpenses(sum);
			return sum;
		},
		totalMonthIncome() {
			const sum = selectedMonthDays.reduce((acc, eachDay: any) => acc + parseInt(eachDay.total_cash), 0);
			setTotalMonthIncome(sum);
			return sum;
		},
		totalMonthExpenses() {
			const sum = selectedMonthDays.reduce((acc, eachDay: any) => acc + parseInt(eachDay.total_day_expenses), 0);
			setTotalMonthExpenses(sum);
			return sum;
		}
	};

	function formatInputSelectedMonth(selectedMonth: string) {
		const [year, month] = selectedMonth.split("-");
		setCurrentFetchingMonth(`${month}-${year}`);
	}

	function formatInputMonthVal() {
		const [month, year] = currentFetchingMonth.split("-");
		return `${year}-${month}`;
	}

	function getCurrentMonth() {
		const [month, year] = currentFetchingMonth.split("-");
		var months = [
			"يناير",
			"فبراير",
			"مارس",
			"إبريل",
			"مايو",
			"يونيو",
			"يوليو",
			"أغسطس",
			"سبتمبر",
			"أكتوبر",
			"نوفمبر",
			"ديسمبر"
		];
		if (month.split("0").length > 1) {
			const monthNumber = (month.split("0")[1] as any) - 1;
			const currentMonth = months[parseInt(monthNumber as any)];
			setCurrentMonth(currentMonth + ", " + year);
			return currentMonth + ", " + year;
		} else {
			const monthNumber = (month.split("0")[0] as any) - 1;
			const currentMonth = months[parseInt(monthNumber as any)];
			setCurrentMonth(currentMonth + ", " + year);
			return currentMonth + ", " + year;
		}
	}

	function getDayString(date: string) {
		const newDate = new Date(date);
		var days = ["اﻷحد", "اﻷثنين", "الثلاثاء", "اﻷربعاء", "الخميس", "الجمعة", "السبت"];
		// var delDateString = days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ', ' + date.getFullYear();
		return `${days[newDate.getDay()]}`;
	}

	useEffect(() => {
		getMonthDays();
	}, [selectedMonthDays.length, currentFetchingMonth]);

	const [combinedArr, setCombinedArr] = useState<[]>([]);
	function getMonthDays() {
		const [month, year]: any = currentFetchingMonth.split("-");
		const date = new Date(year, month); // June 2023
		const daysInMonth = getDaysInMonth(date);
		const fullMonthDays: any = Array(daysInMonth).fill(0);
		selectedMonthDays.map((eachAddedDay: { date: string }) => {
			const dateParts = eachAddedDay.date.split("-");
			const day = parseInt(dateParts[2]);
			fullMonthDays[day - 1] = eachAddedDay;
		});
		setCombinedArr(fullMonthDays);
	}

	function getDateOfMonth(day: any) {
		const [month, year]: any = currentFetchingMonth.split("-");
		const currentDate = new Date(year, month - 1, day);
		return format(setDate(currentDate, day), "yyyy-MM-dd");
	}
	return (
		<>
			<Head>
				<title>دراي كلين الجامعة</title>
			</Head>
			<div className="container px-4">
				<header className="relative mt-7">
					<label htmlFor="start" className="font-bold text-lg mb-2">
						الشهر:
					</label>
					<input
						className="w-full max-w-[200px] p-2 text-xl rounded-md mt-2 border-2 border-gray-400"
						type="month"
						id="start"
						name="start"
						min={`2023-03`}
						max={`${format(new Date(), "yyyy-12")}`}
						value={formatInputMonthVal()}
						onChange={(e) => {
							formatInputSelectedMonth(e.target.value);
							console.log("target value", e.target.value);
						}}
					></input>
				</header>
				<main>
					<div className="dashboard-container overflow-x-scroll">
						<div className="dashboard-header">
							<h1 className="text-center text-xl w-full py-5 font-bold">ايرادات شهر {currentMonth}</h1>
						</div>
						<div className="applications-table">
							<table id="table" className="table-auto">
								<thead>
									<tr className="text-xl">
										<th>تاريخ اليوم</th>
										<th>الايراد الكلي</th>
										<th>المصروفات الكليه</th>
										<th>مسحوبات الحج محمد</th>
										<th>مسحوبات باسم</th>
										<th>صافي مصروفات اليوم</th>
										<th>صافي ايرادات اليوم</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{combinedArr.map((eachDay: any, index) =>
										eachDay !== 0 ? (
											<tr key={index}>
												<td>
													<p>{eachDay.date}</p>
													<span>{getDayString(eachDay.date)}</span>
												</td>
												<td>
													{eachDay.total_day_income}
													<sub>ج.م</sub>
												</td>
												<td>
													{eachDay.total_day_expenses} <sub>ج.م</sub>
												</td>
												<td>
													{eachDay.expensesEl7ag} <sub>ج.م</sub>
												</td>
												<td>
													{eachDay.expensesBassem} <sub>ج.م</sub>
												</td>
												<td>
													{eachDay.total_day_expenses} <sub>ج.م</sub>
												</td>
												<td>
													{eachDay.total_cash} <sub>ج.م</sub>
												</td>
												<td className="underline">
													<Link href={`/dashboard?date=${getDateOfMonth(index + 1)}`}>
														إضغط لتعديل بيانات اليوم
													</Link>
												</td>
											</tr>
										) : (
											<tr key={index}>
												<td>
													{/* <p>{eachDay.date}</p> */}
													<span>{getDateOfMonth(index + 1)}</span>
												</td>
												<td>NaN</td>
												<td>NaN</td>
												<td>NaN</td>
												<td>NaN</td>
												<td>NaN</td>
												<td>NaN</td>
												<td className="underline">
													<Link href={`/dashboard?date=${getDateOfMonth(index + 1)}`}>
														إضغط لإضافة بيانات اليوم
													</Link>
												</td>
											</tr>
										)
									)}
								</tbody>
								<br />
								<tr className="secondHead">
									<td>شهر</td>
									<td>إجمــالي ايرادات الشهر</td>
									<td>إجمــالي المصروفات</td>
									<td>اجمالي مسحويات الحاج</td>
									<td>اجمالي مسحويات باسم</td>
									<td>صافي مصروفات الشهر</td>
									<td>صافي ايرادات الشهر</td>
								</tr>
								<tr className="secondBody">
									<td>{currentMonth}</td>
									<td>
										{allMonthIncome} <sub>ج.م</sub>
									</td>
									<td>
										{allMonthExpenses}
										<sub>ج.م</sub>
									</td>
									<td>
										{totalEl7agExpenses} <sub>ج.م</sub>
									</td>
									<td>
										{totalBassemExpenses} <sub>ج.م</sub>
									</td>
									<td>
										{totalMonthExpenses} <sub>ج.م</sub>
									</td>
									<td>
										{totalMonthIncome} <sub>ج.م</sub>
									</td>
								</tr>
							</table>
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
