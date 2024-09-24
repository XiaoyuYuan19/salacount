const exchangeRate = 7.8;
let euroChart, cnyChart;

function addRow() {
    const euroTable = document.getElementById('euroTable').getElementsByTagName('tbody')[0];
    const cnyTable = document.getElementById('cnyTable').getElementsByTagName('tbody')[0];

    const euroRow = euroTable.insertRow();
    const cnyRow = cnyTable.insertRow();

    for (let i = 0; i < 9; i++) {
        let euroCell = euroRow.insertCell(i);
        let cnyCell = cnyRow.insertCell(i);

        if (i === 0) { // ID
            euroCell.innerHTML = euroTable.rows.length;
            cnyCell.innerHTML = cnyTable.rows.length;
        } else if (i === 1) { // 工作名称
            let euroInput = document.createElement('input');
            let cnyInput = document.createElement('input');
            euroInput.type = 'text';
            cnyInput.type = 'text';

            euroInput.oninput = function () {
                cnyInput.value = euroInput.value;
                updateCharts(); // 实时更新图表
            };
            cnyInput.oninput = function () {
                euroInput.value = cnyInput.value;
                updateCharts(); // 实时更新图表
            };

            euroCell.appendChild(euroInput);
            cnyCell.appendChild(cnyInput);
        } else if (i === 8) { // 操作列，添加删除按钮
            let deleteBtn = document.createElement('button');
            deleteBtn.textContent = "删";
            deleteBtn.onclick = function () {
                deleteRow(euroRow, cnyRow);
                updateCharts(); // 删除后更新图表
            };
            euroCell.appendChild(deleteBtn);

            let deleteBtnCny = document.createElement('button');
            deleteBtnCny.textContent = "删";
            deleteBtnCny.onclick = function () {
                deleteRow(euroRow, cnyRow);
                updateCharts(); // 删除后更新图表
            };
            cnyCell.appendChild(deleteBtnCny);
        } else {
            let euroInput = document.createElement('input');
            euroInput.type = 'text';
            euroInput.oninput = function() {
                calculateRow();
                updateCharts();  // 实时更新图表
            };
            euroCell.appendChild(euroInput);

            let cnyInput = document.createElement('input');
            cnyInput.type = 'text';
            cnyInput.oninput = function() {
                calculateRow();
                updateCharts();  // 实时更新图表
            };
            cnyCell.appendChild(cnyInput);
        }
    }

    calculateRow();
    updateCharts();  // 添加行后更新图表
}


function calculateRow() {
    const euroTable = document.getElementById('euroTable').getElementsByTagName('tbody')[0];
    const cnyTable = document.getElementById('cnyTable').getElementsByTagName('tbody')[0];

    for (let i = 0; i < euroTable.rows.length; i++) {
        const euroInputs = euroTable.rows[i].getElementsByTagName('input');
        const cnyInputs = cnyTable.rows[i].getElementsByTagName('input');

        const [jobNameEuro, yearEuro, monthEuro, rentEuro, foodEuro, remainMonthEuro, remainYearEuro] = euroInputs;
        const [jobNameCny, yearCny, monthCny, rentCny, foodCny, remainMonthCny, remainYearCny] = cnyInputs;

        // 修正后的年薪与月薪的双向绑定逻辑
        yearEuro.oninput = function() {
            if (yearEuro.value) {
                monthEuro.value = (parseFloat(yearEuro.value) * 10000 / 12).toFixed(2);  // 年薪转换为月薪
                yearCny.value = (parseFloat(yearEuro.value) * exchangeRate).toFixed(2);  // 欧元转换为人民币
                monthCny.value = (parseFloat(monthEuro.value) * exchangeRate).toFixed(2); // 同时更新人民币月薪
            }
            calculateRemaining(i);  // 更新剩余
        };

        monthEuro.oninput = function() {
            if (monthEuro.value) {
                yearEuro.value = (parseFloat(monthEuro.value) * 12 / 10000).toFixed(2);  // 月薪转换为年薪
                yearCny.value = (parseFloat(yearEuro.value) * exchangeRate).toFixed(2);  // 欧元转换为人民币
                monthCny.value = (parseFloat(monthEuro.value) * exchangeRate).toFixed(2); // 同时更新人民币月薪
            }
            calculateRemaining(i);  // 更新剩余
        };

        yearCny.oninput = function() {
            if (yearCny.value) {
                monthCny.value = (parseFloat(yearCny.value) * 10000 / 12).toFixed(2);  // 人民币年薪转换为月薪
                yearEuro.value = (parseFloat(yearCny.value) / exchangeRate).toFixed(2);  // 人民币转换为欧元
                monthEuro.value = (parseFloat(monthCny.value) / exchangeRate).toFixed(2); // 同时更新欧元月薪
            }
            calculateRemaining(i);  // 更新剩余
        };

        monthCny.oninput = function() {
            if (monthCny.value) {
                yearCny.value = (parseFloat(monthCny.value) * 12 / 10000).toFixed(2);  // 人民币月薪转换为年薪
                yearEuro.value = (parseFloat(yearCny.value) / exchangeRate).toFixed(2);  // 人民币转换为欧元
                monthEuro.value = (parseFloat(monthCny.value) / exchangeRate).toFixed(2); // 同时更新欧元月薪
            }
            calculateRemaining(i);  // 更新剩余
        };

        // 处理租房费用双向更新
        rentEuro.oninput = function() {
            rentCny.value = (parseFloat(rentEuro.value) * exchangeRate).toFixed(2);  // 欧元转换为人民币
            calculateRemaining(i);  // 更新剩余
        };

        rentCny.oninput = function() {
            rentEuro.value = (parseFloat(rentCny.value) / exchangeRate).toFixed(2);  // 人民币转换为欧元
            calculateRemaining(i);  // 更新剩余
        };

        // 处理吃饭费用双向更新
        foodEuro.oninput = function() {
            foodCny.value = (parseFloat(foodEuro.value) * exchangeRate).toFixed(2);  // 欧元转换为人民币
            calculateRemaining(i);  // 更新剩余
        };

        foodCny.oninput = function() {
            foodEuro.value = (parseFloat(foodCny.value) / exchangeRate).toFixed(2);  // 人民币转换为欧元
            calculateRemaining(i);  // 更新剩余
        };
    }
	updateCharts();  // 更新数据后更新图表
}





function calculateRemaining(rowIndex) {
    const euroTable = document.getElementById('euroTable').getElementsByTagName('tbody')[0];
    const cnyTable = document.getElementById('cnyTable').getElementsByTagName('tbody')[0];

    const euroInputs = euroTable.rows[rowIndex].getElementsByTagName('input');
    const cnyInputs = cnyTable.rows[rowIndex].getElementsByTagName('input');

    const [jobNameEuro, yearEuro, monthEuro, rentEuro, foodEuro, remainMonthEuro, remainYearEuro] = euroInputs;
    const [jobNameCny, yearCny, monthCny, rentCny, foodCny, remainMonthCny, remainYearCny] = cnyInputs;

    // 使用 0 作为默认值进行计算，以避免 NaN 错误
    const euroMonthValue = parseFloat(monthEuro.value) || 0;
    const euroRentValue = parseFloat(rentEuro.value) || 0;
    const euroFoodValue = parseFloat(foodEuro.value) || 0;

    const cnyMonthValue = parseFloat(monthCny.value) || 0;
    const cnyRentValue = parseFloat(rentCny.value) || 0;
    const cnyFoodValue = parseFloat(foodCny.value) || 0;

    // 计算欧元剩余月收入
    remainMonthEuro.value = (euroMonthValue - euroRentValue - euroFoodValue).toFixed(2);

    // 计算人民币剩余月收入
    remainMonthCny.value = (cnyMonthValue - cnyRentValue - cnyFoodValue).toFixed(2);

    // 计算欧元剩余年收入 (根据剩余月收入计算)
    remainYearEuro.value = (parseFloat(remainMonthEuro.value) * 12 / 10000).toFixed(2);  // 转换为万单位

    // 计算人民币剩余年收入 (根据剩余月收入计算)
    remainYearCny.value = (parseFloat(remainMonthCny.value) * 12 / 10000).toFixed(2);  // 转换为万单位

    updateCharts();  // 更新数据后更新图表
}

function updateCharts() {
    const euroTable = document.getElementById('euroTable').getElementsByTagName('tbody')[0];
    const cnyTable = document.getElementById('cnyTable').getElementsByTagName('tbody')[0];

    const euroData = {
        monthSalaries: [],
        rents: [],
        foods: [],
        remainMonths: []
    };

    const cnyData = {
        monthSalaries: [],
        rents: [],
        foods: [],
        remainMonths: []
    };

    for (let i = 0; i < euroTable.rows.length; i++) {
        const euroInputs = euroTable.rows[i].getElementsByTagName('input');
        const cnyInputs = cnyTable.rows[i].getElementsByTagName('input');

        const [, , monthEuro, rentEuro, foodEuro, remainMonthEuro] = euroInputs;
        const [, , monthCny, rentCny, foodCny, remainMonthCny] = cnyInputs;

        euroData.monthSalaries.push(parseFloat(monthEuro.value) || 0);
        euroData.rents.push(parseFloat(rentEuro.value) || 0);
        euroData.foods.push(parseFloat(foodEuro.value) || 0);
        euroData.remainMonths.push(parseFloat(remainMonthEuro.value) || 0);

        cnyData.monthSalaries.push(parseFloat(monthCny.value) || 0);
        cnyData.rents.push(parseFloat(rentCny.value) || 0);
        cnyData.foods.push(parseFloat(foodCny.value) || 0);
        cnyData.remainMonths.push(parseFloat(remainMonthCny.value) || 0);
    }

    // 更新欧元图表，确保每一列的颜色严格对应
    if (euroChart) {
        euroChart.destroy();
    }
    euroChart = new Chart(document.getElementById('euroChart'), {
        type: 'line',
        data: {
            labels: euroData.monthSalaries.map((_, index) => `Row ${index + 1}`),
            datasets: [
                { 
                    label: '月薪 (€)', 
                    data: euroData.monthSalaries, 
                    borderColor: '#1f77b4', // 蓝色对应月薪
                    borderWidth: 2,
                    fill: false,
                    tension: 0.2
                },
                { 
                    label: '租房 (€)', 
                    data: euroData.rents, 
                    borderColor: '#2ca02c', // 绿色对应租房
                    borderWidth: 2,
                    fill: false,
                    tension: 0.2
                },
                { 
                    label: '吃饭 (€)', 
                    data: euroData.foods, 
                    borderColor: '#ff7f0e', // 橙色对应吃饭
                    borderWidth: 2,
                    fill: false,
                    tension: 0.2
                },
                { 
                    label: '剩余月 (€)', 
                    data: euroData.remainMonths, 
                    borderColor: '#9467bd', // 紫色对应剩余月
                    borderWidth: 2,
                    fill: false,
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
			devicePixelRatio: 3,  // 提升图表清晰度
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        },
                        color: '#333'
                    }
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '金额 (€)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.5)',
                    }
                }
            }
        }
    });

    // 更新人民币图表，确保每一列的颜色严格对应
    if (cnyChart) {
        cnyChart.destroy();
    }
    cnyChart = new Chart(document.getElementById('cnyChart'), {
        type: 'line',
        data: {
            labels: cnyData.monthSalaries.map((_, index) => `Row ${index + 1}`),
            datasets: [
                { 
                    label: '月薪 (￥)', 
                    data: cnyData.monthSalaries, 
                    borderColor: '#1f77b4', // 蓝色对应月薪
                    borderWidth: 2,
                    fill: false,
                    tension: 0.2 
                },
                { 
                    label: '租房 (￥)', 
                    data: cnyData.rents, 
                    borderColor: '#2ca02c', // 绿色对应租房
                    borderWidth: 2,
                    fill: false,
                    tension: 0.2 
                },
                { 
                    label: '吃饭 (￥)', 
                    data: cnyData.foods, 
                    borderColor: '#ff7f0e', // 橙色对应吃饭
                    borderWidth: 2,
                    fill: false,
                    tension: 0.2 
                },
                { 
                    label: '剩余月 (￥)', 
                    data: cnyData.remainMonths, 
                    borderColor: '#9467bd', // 紫色对应剩余月
                    borderWidth: 2,
                    fill: false,
                    tension: 0.2 
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        },
                        color: '#333'
                    }
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '金额 (￥)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.5)',
                    }
                }
            }
        }
    });
}




function deleteRow(euroRow, cnyRow) {
    const euroTable = document.getElementById('euroTable').getElementsByTagName('tbody')[0];
    const cnyTable = document.getElementById('cnyTable').getElementsByTagName('tbody')[0];
    euroTable.deleteRow(euroRow.rowIndex - 1);
    cnyTable.deleteRow(cnyRow.rowIndex - 1);

    updateRowIds();
}

function updateRowIds() {
    const euroTable = document.getElementById('euroTable').getElementsByTagName('tbody')[0];
    const cnyTable = document.getElementById('cnyTable').getElementsByTagName('tbody')[0];

    for (let i = 0; i < euroTable.rows.length; i++) {
        euroTable.rows[i].cells[0].innerText = i + 1;
        cnyTable.rows[i].cells[0].innerText = i + 1;
    }
}

function downloadExcel() {
    const euroTable = document.getElementById('euroTable').getElementsByTagName('tbody')[0];
    const cnyTable = document.getElementById('cnyTable').getElementsByTagName('tbody')[0];

    const euroData = [];
    const cnyData = [];

    // 添加表头
    euroData.push(['ID', '工作名称', '年薪 (€ 万)', '月薪 (€)', '租房 (€)', '吃饭 (€)', '剩余月 (€)', '剩余年 (€ 万)']);
    cnyData.push(['ID', '工作名称', '年薪 (￥ 万)', '月薪 (￥)', '租房 (￥)', '吃饭 (￥)', '剩余月 (￥)', '剩余年 (￥ 万)']);

    // 遍历欧元表格
    for (let i = 0; i < euroTable.rows.length; i++) {
        const row = euroTable.rows[i].getElementsByTagName('input');
        const rowData = Array.from(row).map(cell => cell.value || 0);  // 确保空值处理
        euroData.push([i + 1, ...rowData]);
    }

    // 遍历人民币表格
    for (let i = 0; i < cnyTable.rows.length; i++) {
        const row = cnyTable.rows[i].getElementsByTagName('input');
        const rowData = Array.from(row).map(cell => cell.value || 0);  // 确保空值处理
        cnyData.push([i + 1, ...rowData]);
    }

    // 创建工作簿
    const wb = XLSX.utils.book_new();

    // 将欧元表格数据转换为工作表
    const euroSheet = XLSX.utils.aoa_to_sheet(euroData);
    XLSX.utils.book_append_sheet(wb, euroSheet, "Euro");

    // 将人民币表格数据转换为工作表
    const cnySheet = XLSX.utils.aoa_to_sheet(cnyData);
    XLSX.utils.book_append_sheet(wb, cnySheet, "CNY");

    // 导出为 Excel 文件
    XLSX.writeFile(wb, "salary_data.xlsx");
}

function downloadChart(chartId, chartName) {
    const chart = document.getElementById(chartId);
    const url = chart.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = chartName + ".png";
    a.click();
}


