import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Pagination from './components/Pagination.jsx';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortDirection, setSortDirection] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(8);

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://dummyjson.com/users');
        if (!response.ok) {
          throw new Error('Unable to fetch users, please try again later.');
        }
        const resData = await response.json();
        setUsers(resData.users);
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
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  useEffect(() => {
    setFilteredUsers([...filteredUsers]
      .sort((userA, userB) => {
        const lastNameA = userA.lastName.toLowerCase();
        const lastNameB = userB.lastName.toLowerCase();
        if (lastNameA < lastNameB) return sortDirection === 'asc' ? -1 : 1;
        if (lastNameB < lastNameA) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    );
  }, [sortDirection]);

  const handleChangeSearchInput = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleSortByLastName = (e) => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <input
        type="text"
        placeholder="Search by last name..."
        value={searchTerm}
        onChange={handleChangeSearchInput}
      />
      <h1>Buck Harbor Outfitters Customers</h1>
      {loading && <p>Loading...</p>}
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th onClick={handleSortByLastName}>Last Name</th>
            <th>Email</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {!loading && currentUsers.length == 0 &&
            <tr>
              <td colSpan="5">No users found.</td>
            </tr>
          }
          {!loading && currentUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.company.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        usersPerPage={usersPerPage}
        totalUsers={users.length}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  )
}
