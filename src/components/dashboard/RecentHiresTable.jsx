const RecentHiresTable = () => {
  const hires = [
    { name: 'Sok Dara', position: 'HR Officer', date: '2025-08-01' },
    { name: 'Chantha Meas', position: 'Developer', date: '2025-07-28' },
    { name: 'Sopheak', position: 'Accountant', date: '2025-07-25' },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mt-6">
      <h3 className="text-lg font-semibold mb-3">Recent Hires</h3>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Position</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {hires.map((hire, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{hire.name}</td>
              <td className="py-2">{hire.position}</td>
              <td className="py-2">{hire.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentHiresTable;
