export default function ShowTable({ shows, onEdit, onDelete }) {
  return (
    <div className="bg-[#0a1f2d] border border-[#1e4152] rounded-xl overflow-hidden">
      <table className="w-full text-left text-white">
        <thead className="bg-[#0f2b3a]">
          <tr>
            <th className="p-3">Show Name</th>
            <th className="p-3">Date & Time</th>
            <th className="p-3">Location</th>
            <th className="p-3">Screen</th>
            <th className="p-3">Adult Price</th>
            <th className="p-3">Kid Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {shows.map((show) => (
            <tr key={show.id} className="border-t border-[#1e4152]">
              <td className="p-3">{show.name}</td>
              <td className="p-3">{show.datetime}</td>
              <td className="p-3">{show.location}</td>
              <td className="p-3">{show.screen}</td>
              <td className="p-3">€{show.adult_price}</td>
              <td className="p-3">€{show.kid_price}</td>

              <td className="p-3 flex gap-4">
                <button
                  onClick={() => onEdit(show)}
                  className="text-sky-400 hover:text-sky-200"
                >
                  ✏️
                </button>

                <button
                  onClick={() => onDelete(show.id)}
                  className="text-red-400 hover:text-red-200"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
