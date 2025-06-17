import { useState, useEffect } from "react";
import axios from "axios";

function BalanceDisplay({ groups }) {
    const [balances, setBalances] = useState([]);

    useEffect(() => {
        if (groups.length > 0) {
            axios
                .get(`http://localhost:8000/groups/${groups[0].id}/balances`)
                .then((res) => setBalances(res.data));
        }
    }, [groups]);

    return (
        <div className="mt-4">
            <h2 className="text-2xl font-bold">Group Balances</h2>
            {balances.map((balance) => (
                <p key={balance.user_id}>
                    {balance.name} {balance.amount_owed >= 0 ? "is owed" : "owes"}{" "}
                    {Math.abs(balance.amount_owed)} INR
                </p>
            ))}
        </div>
    );
}

export default BalanceDisplay;