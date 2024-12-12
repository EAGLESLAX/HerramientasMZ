document.addEventListener('DOMContentLoaded', function() {
    loadDataFromLocalStorage();
    updateTotals();
});

document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addExpense();
    updateTotals();
});

document.getElementById('import-btn').addEventListener('click', function() {
    document.getElementById('import-csv').click();
});

document.getElementById('import-csv').addEventListener('change', function(event) {
    importCSV(event);
    updateTotals();
});

document.getElementById('export-btn').addEventListener('click', function() {
    exportCSV();
});

function addExpense() {
    const type = document.getElementById('type').value;
    const name = document.getElementById('name').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const table = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    const cellIcon = row.insertCell(0);
    const cell1 = row.insertCell(1);
    const cell2 = row.insertCell(2);
    const cell3 = row.insertCell(3);
    const cell4 = row.insertCell(4);

    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.innerHTML = type === 'Ingreso' ? '+' : '-';
    icon.classList.add(type === 'Ingreso' ? 'icon-ingreso' : 'icon-egreso');
    icon.addEventListener('click', function() {
        table.deleteRow(row.rowIndex - 1); // Eliminar la fila al hacer clic en el icono
        updateTotals();
        saveDataToLocalStorage();
    });
    cellIcon.appendChild(icon);

    cell1.textContent = type;
    cell2.textContent = name;
    cell3.textContent = amount.toFixed(2);
    cell4.textContent = date;

    document.getElementById('expense-form').reset();
    saveDataToLocalStorage();
    updateTotals();
}

function saveDataToLocalStorage() {
    const table = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
    const data = [];
    for (const row of table.rows) {
        const cells = Array.from(row.cells).slice(1); // Excluir la primera celda (icono)
        const rowData = cells.map(cell => cell.textContent);
        data.push(rowData);
    }
    localStorage.setItem('expenses', JSON.stringify(data));
}

function loadDataFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('expenses')) || [];
    const table = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
    for (const rowData of data) {
        const row = table.insertRow();
        const cellIcon = row.insertCell(0);
        const cell1 = row.insertCell(1);
        const cell2 = row.insertCell(2);
        const cell3 = row.insertCell(3);
        const cell4 = row.insertCell(4);

        const icon = document.createElement('span');
        icon.className = 'icon';
        icon.innerHTML = rowData[0] === 'Ingreso' ? '+' : '-';
        icon.classList.add(rowData[0] === 'Ingreso' ? 'icon-ingreso' : 'icon-egreso');
        icon.addEventListener('click', function() {
            table.deleteRow(row.rowIndex - 1); // Eliminar la fila al hacer clic en el icono
            saveDataToLocalStorage();
            updateTotals();
        });
        cellIcon.appendChild(icon);

        cell1.textContent = rowData[0];
        cell2.textContent = rowData[1];
        cell3.textContent = parseFloat(rowData[2]).toFixed(2);
        cell4.textContent = rowData[3];
    }
    updateTotals();
}

function updateTotals() {
    const table = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
    let totalIngresos = 0;
    let totalEgresos = 0;

    for (const row of table.rows) {
        const type = row.cells[1].textContent;
        const amount = parseFloat(row.cells[3].textContent);
        if (type === 'Ingreso') {
            totalIngresos += amount;
        } else {
            totalEgresos += amount;
        }
    }

    const balance = totalIngresos - totalEgresos;

    document.getElementById('total-ingresos').textContent = totalIngresos.toFixed(2);
    document.getElementById('total-egresos').textContent = totalEgresos.toFixed(2);
    document.getElementById('total-balance').textContent = balance.toFixed(2);
}

function importCSV(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvData = e.target.result;
            const rows = csvData.split('\n');
            const table = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
            for (const row of rows) {
                if (row.trim()) {
                    const [type, name, amount, date] = row.split(',');
                    const newRow = table.insertRow();
                    const cellIcon = newRow.insertCell(0);
                    const cell1 = newRow.insertCell(1);
                    const cell2 = newRow.insertCell(2);
                    const cell3 = newRow.insertCell(3);
                    const cell4 = newRow.insertCell(4);

                    const icon = document.createElement('span');
                    icon.className = 'icon';
                    icon.innerHTML = type === 'Ingreso' ? '+' : '-';
                    icon.classList.add(type === 'Ingreso' ? 'icon-ingreso' : 'icon-egreso');
                    icon.addEventListener('click', function() {
                        table.deleteRow(newRow.rowIndex - 1); // Eliminar la fila al hacer clic en el icono
                        saveDataToLocalStorage();
                        updateTotals();
                    });
                    cellIcon.appendChild(icon);

                    cell1.textContent = type;
                    cell2.textContent = name;
                    cell3.textContent = parseFloat(amount).toFixed(2);
                    cell4.textContent = date;
                }
            }
            saveDataToLocalStorage();
            updateTotals();
        };
        reader.readAsText(file);
    }
}

function exportCSV() {
    const table = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
    let csvContent = '';
    for (const row of table.rows) {
        const cells = Array.from(row.cells).slice(1); // Excluir la primera celda (icono)
        const csvRow = cells.map(cell => cell.textContent).join(',');
        csvContent += csvRow + '\n';
    }
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bitacora.csv';
    link.click();
}
