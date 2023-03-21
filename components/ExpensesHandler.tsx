import React, { useState } from "react";

export default function ExpensesHandler({ setValue }: any) {
	const [expensesInputs, setExpensesInputs] = useState<
		{ title: string; value: number }[]
	>([]);

	function addExpensesInput() {
		setExpensesInputs((prevInputs: any) => {
			return [...prevInputs, { title: "", value: "" }];
		});
	}

	const updateInputTitle = (inputIndex: any, inputTitle: any) => {
		setExpensesInputs(
			expensesInputs.map((input, index) =>
				index === inputIndex ? { ...input, title: inputTitle } : input
			)
		);
	};

	const updateInputValue = (inputIndex: any, inputTitle: any) => {
		setExpensesInputs(
			expensesInputs.map((input, index) =>
				index === inputIndex ? { ...input, value: inputTitle } : input
			)
		);
	};
	console.log("EXPENSES", expensesInputs);
	return (
		<div className="border border-black p-4 my-5">
			<div className="flex items-center justify-between">
				<h3 className="font-bold text-lg mb-2">تفاصيل المصاريف:</h3>
				<button
					onClick={addExpensesInput}
					type="button"
					className="border p-2 pt-1 pl-4 bg-blue-500 rounded-md text-white"
				>
					<span className="text-xl pl-4 pr-2">+</span>
					<span>إضافة مصروفات</span>
				</button>
			</div>
			{expensesInputs.map((eachExpensesInput, index) => (
				<div
					className="mx-5 border-b-4 border-blue-400 py-4"
					key={index}
				>
					<div className="flex flex-col gap-1 mb-3">
						<label htmlFor={`label-for-${index}`}>
							اسم المصروفات
						</label>
						<input
							id={`label-for-${index}`}
							required
							type="text"
							value={eachExpensesInput.title}
							onChange={(e) => {
								console.log("TITLE", e.target.value);
								updateInputTitle(index, e.target.value);
							}}
							className="text-lg border rounded-md p-1"
						/>
					</div>
					<div className="flex flex-col">
						<label htmlFor={`input-for-${index}`}>
							قيمة المصروفات
						</label>
						<input
							id={`input-for-${index}`}
							required
							type="number"
							min="0"
							value={eachExpensesInput.value}
							onChange={(e) =>
								updateInputValue(index, e.target.value)
							}
							className="w-full max-w-[200px] p-2 text-xl rounded-md my-2 border-2 border-gray-400"
						/>
					</div>
				</div>
			))}
		</div>
	);
}
