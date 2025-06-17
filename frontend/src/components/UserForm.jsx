import { useState } from 'react';
import axios from 'axios';

function UserForm({ apiUrl }) {
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/users`, { name });
            alert('User created!');
            setName(''); // Clear the input after successful creation
        } catch {
            alert('Error creating user');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                    Create User
                </button>
            </form>
        </div>
    );
}

export default UserForm;