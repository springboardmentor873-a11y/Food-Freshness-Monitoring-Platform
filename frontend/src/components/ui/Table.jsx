function Table({
  headers,
  children,
}) {
  return (
    <table className="w-full">

      <thead>

        <tr className="border-b">

          {headers.map((header) => (
            <th
              key={header}
              className="py-4 text-left text-sm text-gray-500"
            >
              {header}
            </th>
          ))}

        </tr>

      </thead>

      <tbody>{children}</tbody>

    </table>
  );
}

export default Table;