import { useEffect, useState } from "react";

import ItemForm from "./components/ItemForm";
import ItemList from "./components/ItemList";

import {
  getItems,
  createItem,
  deleteItem
} from "./services/itemService";

function App() {
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    const data = await getItems();
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddItem = async (item) => {
    await createItem(item);
    loadItems();
  };

  const handleDeleteItem = async (id) => {
    await deleteItem(id);
    loadItems();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Inventory Manager</h1>

      <ItemForm onAddItem={handleAddItem} />

      <hr />

      <ItemList
        items={items}
        onDelete={handleDeleteItem}
      />
    </div>
  );
}

export default App;