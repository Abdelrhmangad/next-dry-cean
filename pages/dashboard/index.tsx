/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { database } from "../../lib/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { format } from "date-fns";
import ExpensesHandler from "../../components/ExpensesHandler";
import { useRouter } from "next/router";

const Home: NextPage = () => {
	const { query } = useRouter();
	const [todaysFormattedDate, setTodaysFormattedDate] = useState("");
	useEffect(() => {
		setTodaysFormattedDate(query.date as string);
	}, [query.date]);
	const { register, watch, setValue, handleSubmit, getValues } = useForm();
	const [success, setSuccess] = useState(false);
	const [totalDayIncome, setTotalDayIncome] = useState(0);
	const [totalDayExpenses, setTotalDayExpenses] = useState(0);
	function calculateDayTotalIncome() {
		const total =
			parseInt(watch("iron_wash") || 0) +
			parseInt(watch("dye") || 0) +
			parseInt(watch("carpet_blanket_wash") || 0);
		setTotalDayIncome(total);
	}
	console.log("totalDayExpenses", totalDayExpenses);
	function calculateDayTotalExpenses() {
		const { custom_inputs_expenses } = getValues();
		let initVal = 0;
		custom_inputs_expenses.map(
			(eachInput: any) =>
				(initVal = initVal + parseInt(eachInput.value || 0))
		);
		setValue("custom_expenses", initVal);
		const total =
			initVal +
			parseInt(watch("expenses") || 0) +
			parseInt(watch("expensesBassem") || 0) +
			parseInt(watch("expensesEl7ag") || 0);
		setTotalDayExpenses(total);
	}

	useEffect(() => {
		calculateDayTotalIncome();
		calculateDayTotalExpenses();
	}, [
		watch("iron_wash"),
		watch("dye"),
		watch("carpet_blanket_wash"),
		watch("expensesEl7ag"),
		watch("expensesBassem"),
		watch("custom_inputs_expenses")
	]);

	// firebase
	const [currentFetchingMonth, setCurrentFetchingMonth] = useState(
		format(new Date(), "MM-yyyy")
	);
	function submitDayData(data: any) {
		data.expensesEl7ag = data.expensesEl7ag ? data.expensesEl7ag : 0;
		data.expensesBassem = data.expensesBassem ? data.expensesBassem : 0;

		setDoc(doc(database, currentFetchingMonth, data.date), {
			...data,
			created_at: new Date(),
			total_day_income: totalDayIncome,
			total_day_expenses: totalDayExpenses,
			total_cash: totalDayIncome - totalDayExpenses
		});
		setSuccess(true);
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}

	function getDayString(date: string) {
		const newDate = new Date(date);
		var days = [
			"اﻷحد",
			"اﻷثنين",
			"الثلاثاء",
			"اﻷربعاء",
			"الخميس",
			"الجمعة",
			"السبت"
		];
		// var delDateString = days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ', ' + date.getFullYear();
		return `${days[newDate.getDay()]}`;
	}

	return (
		<>
			<Head>
				<title>دراي كلين الجامعة</title>
			</Head>

			<main>
				<div className="container singlepage-container flex justify-content-center">
					<form
						className="w-full mt-5 bg-gray-200 py-7 rounded-md my-5 px-8"
						onSubmit={handleSubmit(submitDayData)}
					>
						<p className="text-center text-2xl text-blue-700 mb-5">
							<span className="text-center text-2xl text-blue-700 underline mb-5">
								تسجيل ايراد يوم {todaysFormattedDate}!
							</span>
							<p>يوم {getDayString(todaysFormattedDate)}</p>
						</p>
						<div className="relative">
							<label
								htmlFor="date"
								className="font-bold text-lg mb-2"
							>
								اليوم
							</label>
							<input
								{...register("date")}
								value={`${todaysFormattedDate}`}
								required
								id="date"
								type="date"
								className="w-full max-w-[200px] p-2 text-xl rounded-md my-2 border-2 border-gray-400 mb-5"
								placeholder="التاريخ"
								onChange={(e) => {
									setValue("date", e.target.value);
									setTodaysFormattedDate(e.target.value);
									setCurrentFetchingMonth(
										format(
											new Date(e.target.value),
											"MM-yyyy"
										)
									);
								}}
							/>
						</div>

						<div className="inputs-container flex flex-col w-full">
							<div className="border border-black p-4 mb-5">
								<h3 className="font-bold text-lg mb-2">
									تفاصيل الإيراد:
								</h3>
								<div className="mx-5">
									<label
										htmlFor="iron_wash"
										className="text-lg"
									>
										الإيراد الكلي:
									</label>
									<input
										id="iron_wash"
										name="dry-wash"
										required
										type="number"
										min="0"
										onChange={(e) =>
											setValue(
												"iron_wash",
												parseInt(e.target.value)
											)
										}
										inputMode="numeric"
										placeholder="اجمالي ايرادات اليوم"
										className="w-full max-w-[200px] p-2 text-xl rounded-md my-2 border-2 border-gray-400"
									/>
								</div>
								{/* <div className="mx-5">
									<label htmlFor="dye" className="text-lg">
										صبغه:
									</label>
									<input
										id="dye"
										name="dye"
										required
										type="number"
										min="0"
										onChange={(e) =>
											setValue(
												"dye",
												parseInt(e.target.value)
											)
										}
										inputMode="numeric"
										placeholder="اجمالي ايرادات الصبغة"
										className="w-full max-w-[200px] p-2 text-xl rounded-md my-2 border-2 border-gray-400"
									/>
								</div>
								<div className="mx-5">
									<label
										htmlFor="dry-wash"
										className="text-lg"
									>
										غسيل سجاد وبطاطين:
									</label>
									<input
										id="dry-wash"
										name="dry-wash"
										required
										type="number"
										min="0"
										onChange={(e) =>
											setValue(
												"carpet_blanket_wash",
												parseInt(e.target.value)
											)
										}
										inputMode="numeric"
										placeholder="اجمالي ايرادات غسيل السجاد والبطاطين"
										className="w-full max-w-[200px] p-2 text-xl rounded-md my-2 border-2 border-gray-400"
									/>
								</div> */}
							</div>
							<div className="relative">
								<label htmlFor="el7ag" className="text-lg">
									مسحوبات الحج محمد
								</label>
								<input
									{...register("expensesEl7ag")}
									type="number"
									id="el7ag"
									min="0"
									placeholder="مسحوبات الحج محمد"
									className="w-full max-w-[200px] p-2 text-xl rounded-md my-2 border-2 border-gray-400"
									inputMode="numeric"
								/>
							</div>
							<div className="relative">
								<label htmlFor="el7ag" className="text-lg">
									مسحوبات باسم
								</label>
								<input
									{...register("expensesBassem")}
									type="number"
									min="0"
									placeholder="مسحوبات باسم"
									className="w-full max-w-[200px] p-2 text-xl rounded-md my-2 border-2 border-gray-400"
									inputMode="numeric"
								/>
							</div>
							<ExpensesHandler
								setValue={(name: any, value: any) =>
									setValue(name, value)
								}
							/>
							<div className="relative flex justify-between mb-5">
								<p>
									<span>ايرادات اليوم</span>
									<span className="font-bold px-5 text-xl">
										{totalDayIncome} <sub>ج.م</sub>
									</span>
								</p>
								<p>
									<span>مصروفات اليوم</span>
									<span className="font-bold px-5 text-xl">
										{totalDayExpenses} <sub>ج.م</sub>
									</span>
								</p>
							</div>
							{totalDayExpenses && totalDayIncome ? (
								<p className="text-xl font-semibold text-center">
									اجمالي النقدي:{" "}
									{totalDayIncome - totalDayExpenses}{" "}
									<sub>ج.م</sub>
								</p>
							) : null}
							{success ? (
								<p className="text-green-500 text-xl text-center py-4">
									تم إضافة البيانات بنجاح
								</p>
							) : (
								<button className="py-4 px-10 focus:bg-blue-400 bg-blue-600 self-center text-center text-white font-black rounded-md my-4">
									حفظ البيانات
								</button>
							)}
						</div>
					</form>
				</div>
			</main>
		</>
	);
};

export default Home;
