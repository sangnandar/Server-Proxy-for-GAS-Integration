async function fetchData(name, date, time, place)
{
  const payload = { name, date, time, place };

  try {
    const response = await fetch('/api-proxy.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      if (result.source === 'proxy') {
        console.error('Proxy (cURL) error:', result.message);
      } else {
        console.error('Apps Script error:', result.message);
      }
      return [];
    }

    return result.data || [];

  } catch (e) {
    console.error('Failed to fetch data:', e);
    return [];
  }
}

function drawTable(data, tableId)
{
  if (!data.length) return;

  const table = document.getElementById(tableId);
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');

  const headers = ['CONFIRMATS', 'RESERVES', 'LLISTA D\'ESPERA'];
  const subHeaders = ['Nom del centre', '# Reserva', 'Alumnes', 'Professors'];
  const columnCount = headers.length * subHeaders.length;

  // Create table header
  const headerRow = document.createElement('tr');
  headers.forEach(key => {
    const th = document.createElement('th');
    th.textContent = key;
    th.colSpan = 4;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Create sub-header
  const subHeaderRow = document.createElement('tr');
  for (let i = 0; i < headers.length; i++) {
    subHeaders.forEach(key => {
      const th = document.createElement('th');
      th.textContent = key;
      subHeaderRow.appendChild(th);
    });
  }
  thead.appendChild(subHeaderRow);

  // Create table rows and calculate sums
  const columnSums = Array(columnCount).fill(0);
  data.forEach(item => {
    const row = document.createElement('tr');
    for (let i = 0; i < columnCount; i++) {
      const td = document.createElement('td');
      const value = item[i] ?? '';
      td.textContent = value;
      if ((i % subHeaders.length) - 2 >= 0 && isNumeric(value)) columnSums[i] += Number(value);
      row.appendChild(td);
    }
    tbody.appendChild(row);
  });

  // Create table footer
  const footerRow = document.createElement('tr');
  for (let i = 0; i < columnCount; i++) {
    const td = document.createElement('td');
    if (i % subHeaders.length === 0) {
      td.textContent = 'Suma total';
    } else {
      td.textContent = columnSums[i] !== 0 ? columnSums[i] : '';
    }
    footerRow.appendChild(td);
  }
  tfoot.appendChild(footerRow);
}

/**
 * The equivalent of PHP's is_numeric().
 * 
 * @param {string|number} v 
 * @returns {boolean}
 */
function isNumeric(v)
{
  return !isNaN(parseFloat(v)) && isFinite(v);
}
