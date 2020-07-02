import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);

  const product = {
    name: 'Fidget Spinner',
    price: 9.99,
    img:
      'https://3gstore.rs/p/120/120029/fidget-spinner-crveni-106287-47631-95063.png',
  };

  let paypalRef = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: product.name,
                amount: {
                  currency_code: 'USD',
                  value: product.price,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          setPaidFor(true);
          console.log({ data, order });
        },
        onError: (err) => {
          setError(err);
          console.error(err);
        },
      })
      .render(paypalRef.current);
  }, [product.name, product.price]);

  return (
    <div className='App'>
      {paidFor ? (
        <div>
          <h1>Thank You for Buying {product.name} from Us!</h1>
          <img
            src='https://image.freepik.com/free-vector/thank-you-lettering-with-curls_1262-6964.jpg'
            alt='Thank You'
          />
        </div>
      ) : (
        <div>
          {error && <span>Uh oh, an error occurred! {error.message}</span>}
          <h1>
            Buy {product.name} for ${product.price}
          </h1>
          <img src={product.img} alt={product.name} width='200' />
          <div ref={paypalRef} />
        </div>
      )}
    </div>
  );
}

export default App;
