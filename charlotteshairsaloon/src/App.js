import React, { useState, useEffect } from 'react';
import styles from './App.css';
import numeral from 'numeral'; // Import Numeral.js
import { round } from 'lodash'; // Import Lodash's round function

const GST = 1.15;
const markUp = 1.5;
const ServiceWorkflow = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [amount, setAmount] = useState(0);
  const [order, setOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5001/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const addProductToOrder = () => {
    const product = products.find(p => p.Description === selectedProduct);
    if (product) {
      const unitVolume = product['Volume (ml) /Weigh (g)'];
      const productTotalPrice = round((amount / unitVolume) * product['UnitPrice EX GST'] * GST * markUp);
      const updatedOrder = [
        ...order,
        {
          description: product.Description,
          amount,
          unit: unitVolume === 'ml' ? 'ml' : 'g',
          pricePerUnit: product['UnitPrice EX GST']/1000,
          totalPrice: productTotalPrice
        }
      ];
      setOrder(updatedOrder);
      setTotalPrice(totalPrice + productTotalPrice);
      setSelectedProduct('');
      setAmount(0);
    }
  };

  const removeProductFromOrder = (index) => {
    const updatedOrder = [...order];
    const productPrice = updatedOrder[index].totalPrice;
    updatedOrder.splice(index, 1);
    setOrder(updatedOrder);
    setTotalPrice(totalPrice - productPrice);
  };

  return (
    <div className={styles.container}>
      <h1>Service Workflow</h1>

      <label htmlFor="product-select">Select a Product:</label>
      <select
        id="product-select"
        value={selectedProduct}
        onChange={handleProductChange}
      >
        <option value="">--Choose a product--</option>
        {products.map((product, index) => (
          <option key={index} value={product.Description}>
            {product.Description} - {product['Volume (ml) /Weigh (g)']} ml or g
          </option>
        ))}
      </select>

      <br />

      <label htmlFor="amount">Amount (in ml or g):</label>
      <input
        type="number"
        id="amount"
        value={amount}
        min="1"
        onChange={handleAmountChange}
      />

      <br />
      <button onClick={addProductToOrder}>Add to Order</button>

      <h3>Order Summary</h3>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount (ml/g)</th>
            <th>Price per Unit (EX GST)</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {order.map((item, index) => (
            <tr key={index}>
              <td>{item.description}</td>
              <td>{item.amount} {item.unit}</td>
              <td>{item.pricePerUnit}</td>
              <td>{item.totalPrice}</td>
              <td>
                <button onClick={() => removeProductFromOrder(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Total Price: {totalPrice}</h4>
    </div>
  );
};

export default ServiceWorkflow;