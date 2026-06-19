function ItemList({ items, onDelete }) {
  return (
    <>
      <h2>Inventory Items</h2>

      {items.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h3>{item.name}</h3>

          <p>Price: {item.price}</p>

          <p>Quantity: {item.quantity}</p>

          <button onClick={() => onDelete(item._id)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
}

export default ItemList;