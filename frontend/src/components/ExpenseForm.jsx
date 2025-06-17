import { useState } from "react";
import axios from "axios";

function ExpenseForm({ groups }) {
    const [groupId, setGroupId] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [paidBy, setPaidBy] = useState("");
    const [splitType, setSplitType] = useState("equal");
    const [splits, setSplits] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const expense = {
            description,
            amount: parseFloat(amount),
            paid_by: parseInt(paidBy),
            split_type: splitType,
            splits: splits.map((split) => ({ [split.user_id]: split.amount || split.percentage })),
        };
        await axios.post(`http://localhost:8000/groups/${groupId}/expenses`, expense);
        setDescription("");
        setAmount("");
        setPaidBy("");
        setSplits([]);
    };

    const handleSplitChange = (userId, value) => {
        setSplits((prev) => {
            const newSplits = [...prev];
            const index = newSplits.findIndex((s) => s.user_id === userId);
            if (index >= 0) {
                newSplits[index] = { user_id: userId, [splitType === "equal" ? "amount" : "percentage"]: value };
            } else {
                newSplits.push({ user_id: userId, [splitType === "equal" ? "amount" : "percentage"]: value });
            }
            return newSplits;
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <h2 className="text-2xl font-bold">Add Expense</h2>
            <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="border p-2 mb-2 w-full"
            >
                <option value="">Select Group</option>
                {Array.isArray(groups) && groups.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="border p-2 mb-2 w-full"
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="border p-2 mb-2 w-full"
            />
            <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="border p-2 mb-2 w-full"
            >
                <option value="">Select Payer</option>
                {Array.isArray(groups) &&
                    groups
                        .find((g) => g.id === parseInt(groupId))
                        ?.users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
            </select>
            <select
                value={splitType}
                onChange={(e) => setSplitType(e.target.value)}
                className="border p-2 mb-2 w-full"
            >
                <option value="equal">Equal Split</option>
                <option value="percentage">Percentage Split</option>
            </select>
            {Array.isArray(groups) &&
                groups
                    .find((g) => g.id === parseInt(groupId))
                    ?.users.map((user) => (
                        <div key={user.id} className="mb-2">
                            <label>{user.name}</label>
                            <input
                                type="number"
                                placeholder={splitType === "equal" ? "Amount" : "Percentage"}
                                onChange={(e) => handleSplitChange(user.id, e.target.value)}
                                className="border p-2 ml-2"
                            />
                        </div>
                    ))}
            <button type="submit" className="bg-blue-500 text-white p-2">
                Add Expense
            </button>
        </form>
    );
}

export default ExpenseForm;