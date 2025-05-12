export default function ProductCard( {id, name, category, price, availability, location }) {
  return (
    <div key={id} className="border p-4 rounded">
      <h2 className="text-lg font-bold">{name}</h2>
      <p>Category: {category}</p>
      <p>Price: ${price}</p>
      <p>Availability: {availability}</p>
      <p>Location: {location}</p>
      <button
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        onClick={() => handleDelete(id)}
      >
        Delete
      </button>
    </div>
  )
}