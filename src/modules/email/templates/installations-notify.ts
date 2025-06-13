interface Address {
  street: string;
  number: string | number;
  city: {
    name: string;
    province: { name: string };
  };
}

interface InstallationTemplateOptions {
  title?: string;
  intro?: string;
  address: Address;
  extraMessage?: string;
  imageLinks?: string[];
}

export function generateInstallationHTML({
  title,
  intro,
  address,
  extraMessage,
  imageLinks = [],
}: InstallationTemplateOptions): string {
  return `
    <div style="font-family: Arial, sans-serif; padding: 16px;">
      ${title ? `<h2>${title}</h2>` : ''}
      ${intro ? `<p>${intro}</p>` : ''}
      <p><strong>Dirección:</strong> ${address.street} ${address.number}</p>
      <p><strong>Ciudad:</strong> ${address.city.name}</p>
      <p><strong>Provincia:</strong> ${address.city.province.name}</p>
      ${extraMessage ? `<p>${extraMessage}</p>` : ''}
      ${
        imageLinks.length
          ? `
            <h3>Imágenes:</h3>
            ${imageLinks
              .map(
                (url) =>
                  `<img src="${url}" alt="Imagen de instalación" style="max-width: 100%; margin-bottom: 12px;" />`,
              )
              .join('')}
          `
          : ''
      }
    </div>
  `;
}
