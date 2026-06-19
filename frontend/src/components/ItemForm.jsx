import { useState } from "react";

function ItemForm({ onAddItem }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddItem({
      name,
      price: Number(price),
      quantity: Number(quantity)
    });

    setName("");
    setPrice("");
    setQuantity("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Item</h2>

      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <br />
      <br />

      <button type="submit">Add Item</button>
    </form>
  );
}

export default ItemForm;