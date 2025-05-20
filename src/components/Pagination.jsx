export default function Pagination({
  usersPerPage,
  totalUsers,
  setCurrentPage,
  currentPage,
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber, e) => {
    e.preventDefault();
    setCurrentPage(pageNumber);
  };

  return (
    <nav>
      <ul style={{display: "flex", listStyle: "none"}}>
        {pageNumbers.map((number) => (
          <li style={{margin: "10px"}}
            key={number}
          >
            <a
              onClick={(e) => paginate(number, e)}
              href="!#"
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};