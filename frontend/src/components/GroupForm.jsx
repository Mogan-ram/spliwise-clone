import { useState, useEffect } from 'react';
import axios from 'axios';

function GroupForm({ apiUrl, setSelectedGroup }) {
    const [name, setName] = useState('');
    const [userIds, setUserIds] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(`${apiUrl}/users`).then((response) => {
            setUsers(response.data);
        });
    }, [apiUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/groups`, {
                name,
                user_ids: userIds.split(',').map(id => parseInt(id.trim())),
            });
            setSelectedGroup(response.data.id);
            alert('Group created!');
            setName('');
            setUserIds('');
        } catch {
            alert('Error creating group');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create Group</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Group Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">User IDs (comma-separated)</label>
                    <input
                        type="text"
                        value={userIds}
                        onChange={(e) => setUserIds(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="e.g., 1,2,3"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                    Create Group
                </button>
            </form>
        </div>
    );
}

export default GroupForm;