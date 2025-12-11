import { useState } from "react";

export default function AddShowModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    movieId: "",
    locationId: "",
    date: "",
    time: "",
    screen: "",
    adultPrice: "",
    childPrice: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-[#0a1f2d] p-6 rounded-xl w-96 border border-[#1e4152]">
        <h2 className="text-xl font-bold mb-4">Add New Show</h2>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            className="mb-2 p-2 w-full bg-[#0f2b3a] border border-[#1e4152] rounded"
            onChange={handleChange}
          />
        ))}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 rounded">
            Cancel
          </button>

          <button
            onClick={() => onSubmit(form)}
            className="px-4 py-2 bg-sky-500 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
