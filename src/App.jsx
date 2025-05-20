import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortDirection, setSortDirection] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Unable to fetch users, please try again later.');
        }
        const resData = await response.json();
        setUsers(resData);
      } catch(error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      let results = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  useEffect(() => {
    setFilteredUsers([...filteredUsers]
      .sort((userA, userB) => {
        const compA = userA.company.name.toLowerCase();
        const compB = userB.company.name.toLowerCase();
        if (compA < compB) return sortDirection === 'asc' ? -1 : 1;
        if (compB < compA) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    );
  }, [sortDirection]);

  const handleChangeSearchInput = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleSortByCompany = (e) => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleChangeSearchInput}
      />
      <h1>Tabular Data</h1>
      {loading && <p>Loading...</p>}
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th onClick={handleSortByCompany}>Company</th>
          </tr>
        </thead>
        <tbody>
          {!loading && filteredUsers.length == 0 &&
            <tr>
              <td colSpan="4">No users found.</td>
            </tr>
          }
          {!loading && filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.company.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
