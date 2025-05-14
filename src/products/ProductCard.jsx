export default function ProductCard( {name, category, price, availability, location, image, stock, button} ) {
  return (
    <div className="border p-4 rounded shadow w-1/3">
      <img src={image} alt={name} className="w-full h-32 object-cover rounded" />
      <h2 className="text-lg font-bold mt-2">{name}</h2>
      <p>Category: {category}</p>
      <p>Price: ${price}</p>
      <p>Availability: {availability}</p>
      <p>Location: {location}</p>
      <p>Stock: {stock}</p>
      {button}
    </div>
  )
}