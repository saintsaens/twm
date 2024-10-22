import React, { useState, useEffect } from 'react';

function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/items/')
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  return (
    <div>
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.type} - {item.rarity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Items;
