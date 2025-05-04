export default function Button({ type, label }) {
  return (
    <button 
      className="bg-dark-blue p-2.5 rounded-lg w-100 text-white border-2 hover:bg-white hover:text-dark-blue hover:border-dark-blue hover:cursor-pointer"
      type={type}
    >
      {label}
    </button>
  )
};