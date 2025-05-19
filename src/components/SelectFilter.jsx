export default function SelectFilter({ label, name, value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1 font-medium">{label}</label>
      <select
        name={name}
        className="w-full p-2 rounded text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
        value={value}
        onChange={onChange}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt[0].toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}