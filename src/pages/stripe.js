// import React from 'react';
// import StripeCheckout from 'react-stripe-checkout';

// function TakeMoney() {
//   const onToken = (token) => {
//     fetch('/charge', {
//       method: 'POST',
//       body: JSON.stringify(token),
//     }).then(response => {
//       response.json().then(data => {
//         alert(`We are in business, ${data.email}`);
//       });
//     });
//   }

//   return (
//     <StripeCheckout
//       token={onToken}
//       stripeKey="pk_test_51NUTGeSIumqhegZiJ8KVV7FwNrNEEk9JDWghGuW4IgwsNcFkHaExBt5OYo0TYi5LSpmHa6UQnx9hE3Bgyjih9Nyu00wF1xAnYm"
//     />
//   )
// }

// export default TakeMoney;