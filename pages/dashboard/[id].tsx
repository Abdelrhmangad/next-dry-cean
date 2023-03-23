/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { format } from "date-fns";
import { database } from "../../lib/firebaseConfig";
import Head from "next/head";
import Link from "next/link";

export default function EachDayDetailsPage() {
	const { query } = useRouter();

	const [currentFetchingMonth, setCurrentFetchingMonth] = useState(
		format(new Date(), "MM-yyyy")
	);
	const [currentMonth, setCurrentMonth] = useState("");

	useEffect(() => {
		if (query.id) {
			const [year, month, day] = (query.id as string).split("-");
			setCurrentFetchingMonth(`${month}-${year}`);
		}
	}, []);
	const [dayData, setDayData] = useState<any>(null);
	const dbInstance = collection(database, `${currentFetchingMonth}`);
	useEffect(() => {
		(async function () {
			const docReference = doc(dbInstance, `${query.id}`);
			await getDoc(docReference).then((res) => {
				setDayData(res.data());
			});
		})();
	}, [query.id]);
	return (
		<>
			<Head>
				<title>دراي كلين الجامعة</title>
			</Head>
			<div className="container py-7">
				<h1 className="text-xl text-center text-blue-700 font-bold">
					تفاصيل يوم {query.id}
				</h1>
				<div className="border mt-5 p-2 flex flex-col justify-center">
					<div className="grid grid-cols-8 border-b w-full mx-auto pb-1">
						<p className="col-span-4 text-right p-2 text-xl font-semibold">
							إيرادات اليوم
						</p>
						<p className="col-span-4 text-left p-2 text-xl font-semibold">
							{dayData?.total_day_income} <sub>ج.م</sub>
						</p>
						<div className="col-span-8">
							<p className="text-right p-2 text-md font-semibold">
								تفاصيل الايراد
							</p>
							<ul className="list-disc md:mr-14 mr-5 mb-10">
								<li className="flex items-center justify-between max-w-xs">
									<span>غسيل سجاد وبطاطين</span>
									<span>
										{dayData?.carpet_blanket_wash || 0}{" "}
										<sub>ج.م</sub>
									</span>
								</li>
								<li className="flex items-center justify-between max-w-xs">
									<span>صبغه</span>
									<span>
										{dayData?.dye || 0} <sub>ج.م</sub>
									</span>
								</li>
								<li className="flex items-center justify-between max-w-xs">
									<span>مكواه</span>
									<span>
										{dayData?.iron_wash || 0} <sub>ج.م</sub>
									</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="grid grid-cols-8 border-b w-full mx-auto pb-1">
						<p className="col-span-4 text-right p-2 text-xl font-semibold">
							مصاريف اليوم
						</p>
						<p className="col-span-4 text-left p-2 text-xl font-semibold">
							{dayData?.total_day_expenses} <sub>ج.م</sub>
						</p>
					</div>
					<div className="grid grid-cols-8 border-b w-full mx-auto pb-1">
						<p className="col-span-4 text-right p-2 text-xl font-semibold">
							إجمالي ايراد اليوم
						</p>
						<p className="col-span-4 text-left p-2 text-xl font-semibold">
							{dayData?.total_cash} <sub>ج.م</sub>
						</p>
					</div>
					<div className="grid grid-cols-8 border-b w-full mx-auto pb-1">
						<p className="col-span-4 text-right p-2 text-xl font-semibold">
							مسحوبات الحج محمد
						</p>
						<p className="col-span-4 text-left p-2 text-xl font-semibold">
							{dayData?.expensesEl7ag} <sub>ج.م</sub>
						</p>
					</div>
					<div className="grid grid-cols-8 border-b w-full mx-auto pb-1">
						<p className="col-span-4 text-right p-2 text-xl font-semibold">
							مسحوبات باسم
						</p>
						<p className="col-span-4 text-left p-2 text-xl font-semibold">
							{dayData?.expensesBassem} <sub>ج.م</sub>
						</p>
					</div>
					<div className="grid grid-cols-8 w-full mx-auto pb-1">
						<p className="col-span-4 text-right p-2 text-xl font-semibold">
							مصروفات متنوعه
						</p>
						<p className="col-span-4 text-left p-2 text-xl font-semibold">
							{dayData?.custom_expenses} <sub>ج.م</sub>
						</p>
						{dayData?.custom_inputs_expenses.length ? (
							<div className="col-span-8">
								<p className="text-right p-2 text-md font-semibold">
									تفاصيل المصروفات
								</p>
								<ul className="list-disc md:mr-14 mr-5 mb-10">
									{dayData?.custom_inputs_expenses.map(
										(eachExpense: any) => (
											<li
												key={eachExpense.title}
												className="flex items-center justify-between max-w-xs"
											>
												<span>{eachExpense.title}</span>
												<span>
													{eachExpense.value || 0}
													<sub>ج.م</sub>
												</span>
											</li>
										)
									)}
								</ul>
							</div>
						) : null}
					</div>
				</div>
				<div className="mt-5 grid place-items-center">
					<Link href={"/dashboard"} passHref>
						<a className="border p-2 pb-3 px-5 bg-blue-700 text-white">
							الرجوع لصفحة الشهر
						</a>
					</Link>
				</div>
			</div>
		</>
	);
}
