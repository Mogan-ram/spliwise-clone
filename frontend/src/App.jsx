import { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "./components/UserForm";
import GroupForm from "./components/GroupForm";
import ExpenseForm from "./components/ExpenseForm";
import BalanceDisplay from "./components/BalanceDisplay";

function App() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/users").then((res) => setUsers(res.data));
    axios.get("http://localhost:8000/groups").then((res) => setGroups(res.data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Splitwise Clone</h1>
      <UserForm setUsers={setUsers} />
      <GroupForm users={users} setGroups={setGroups} />
      <ExpenseForm groups={groups} />
      <BalanceDisplay groups={groups} />
    </div>
  );
}

export default App;