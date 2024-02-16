function forAppointmentReminder(appointment) {
  // Format date
  const formattedDate = new Date(appointment.appointmentDate).toLocaleString();

  // Format prices
  const formattedElements = appointment.elements.map(element => {
    const formattedPrice = element.service.price.toLocaleString() + " Ar";
    return `
            <tr>
                <td>${element.service.name}</td>
                <td>${element.employee.name}</td>
                <td>${new Date(element.startDate).toLocaleString()}</td>
                <td>${formattedPrice}</td>
            </tr>
        `;
  }).join('');

  // Salutations et formules courtoises
  const greetings = `
        <p>Bonjour ${appointment.client.name},</p>
        <p>Nous vous rappelons votre rendez-vous prévu le ${formattedDate}.</p>
    `;

  // HTML template
  return `
        <style>
          td,th {
            padding: 7px;
            border: 1px solid black; border-collapse: collapse;
          }
          th {
            text-align: left;
          }
        </style>
        <div>
            ${greetings}

            <h2>Détails du Rendez-vous</h2>
            <table>
                <tr>
                    <th>Service</th>
                    <th>Employé</th>
                    <th>Date et Heure</th>
                    <th>Prix</th>
                </tr>
                ${formattedElements}
            </table>

            <p>Merci de votre confiance, et à bientôt !</p>
        </div>
    `;
}

export const mailContentBuilder = {
  forAppointmentReminder
}
