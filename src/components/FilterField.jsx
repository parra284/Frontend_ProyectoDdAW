import transformText from "../utils/transformText";

export default function FilterField( {name, options, onChange }) {
  return (
    <div className="my-5">
      <label>{transformText(name)}</label>
      <select name={name} className="w-full p-2 mt-2 rounded bg-amber-400" onChange={onChange}>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          label={option.label}
        />
      ))}
    </select>
    </div>
  )
}
