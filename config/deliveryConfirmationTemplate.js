import { DateTime } from 'luxon';

const renderItems = (purchaseData) => {
  return purchaseData?.items?.map((item, index) => (
    ` <li>
      <div class="item-cont">

          <h3 class="mb-0 me-2 d-inline">${item.title}</h3>
          <span>${item.quantity} x $${item.unit_price}</span>
      </div>
      <p>${item.description}</p>
    </li>`
  ))
}


export const deliveryConfirmationTemplate = (userData, purchaseData) => {
  return `
<html>
<head>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

  <style>
  :root {
    --main-blue: #284277;
    --main-grey: #9B9FA3;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #284277;
  }

  .item-cont h3 {
    margin-bottom: 0;
  }

  .negritas {
    font-weight: bold;
  }


  .purchase-items {
    flex-grow: 1;
  }

  .purchase-items ul {
    padding: 0;
  }

  .purchase-items li {
    display: block;
    margin-left: 0;
    width: 250px;
    border: 1px solid lightgray;
    list-style-type: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: white;
    margin-bottom: 0.5rem;
  }
  </style>
</head>

<body>
  <img src="https://res.cloudinary.com/du6q3fppu/image/upload/f_auto,q_auto/jyyj80spczglaugxmyj5"
    alt="Logo de Cándida Gres" style="width: 100%; max-width: 150px; display: block;">
  <h1>¡Recibiste tu compra, ${userData.first_name ?? userData.email}!</h1>
  <p>Podés ver <a href='${process.env.FRONT_URL}/store/purchases/${userData._id}'>tus compras acá.</a></p>
  <div>
    <h2>Resumen</h2>
    <p class='mb-0'><span class='negritas'>Usuario:</span> ${userData?.first_name + ' ' + userData?.last_name}
      (${userData?.email})</p>
    <p class='mb-0'><span class='negritas'>Importe Total:</span> $${purchaseData?.totalCost}</p>
    <p class='mb-0'><span class='negritas'>Cantidad de Items:</span> ${purchaseData?.totalQuantity}
      artículo${purchaseData?.totalQuantity > 1 ? 's' : ''}</p>
    <p class='mb-0'><span class='negritas'>Fecha de entrega:</span> ${DateTime.fromISO(purchaseData?.delivered_at, { setZone: true }).toFormat('dd-MM-yyyy')}</p>
  </div>
  <div class='purchase-items'>
    <h2>Detalle de artículos</h2>
    <ul>
      ${renderItems(purchaseData)?.join('')}
    </ul>
  </div>

</body>

</html>
`;
};