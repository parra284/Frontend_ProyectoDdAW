export default function Button({ type = "button", label, onClick, width = "w-100" }) {

  return (
    <button 
      className={`bg-dark-blue p-2.5 rounded-lg text-white border-2 hover:!bg-white hover:text-dark-blue hover:border-dark-blue hover:cursor-pointer ${width} my-5`}
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  )
};