const initialStartDate = '2013-10-01';
const today = new Date();
today.setDate(today.getDate() - 1);
const initialEndDate = today.toISOString().split('T')[0];
const ctx = document.getElementById('btc-chart').getContext('2d');
let bitcoinData;
let chartInstance = null;

const chartParams = {
  sevenDays: { labels: [], data: [] },
  oneMonth: { labels: [], data: [] },
  sixMonths: { labels: [], data: [] },
  max: { labels: [], data: [] },
};

function createGradient(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 350);
  gradient.addColorStop(0, 'rgba(247, 147, 26, 1)'); // Dunklere orange Farbe am Start
  gradient.addColorStop(1, 'rgba(24, 26, 32, 0.1)'); // Hellere orange Farbe am Ende
  return gradient;
}

function drawChart(labels, data) {
  if (!chartInstance) {
    const gradient = createGradient(ctx);
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'BITCOIN - EURO (BTC - EUR)',
            data: data,
            // backgroundColor: 'rgba(247, 147, 26, 1)',
            backgroundColor: gradient,
            borderColor: 'rgba(247, 147, 26, 1)',
            borderWidth: 2,
            pointRadius: 0, // Keine Kreise anzeigen
            fill: true,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: '#979da8',
            },
            ticks: {
              color: '#979da8',
            },
          },
          x: {
            grid: {
              color: '#979da8',
            },
            ticks: {
              color: '#979da8',
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: '#979da8',
            },
          },
        },
      },
    });
  } else {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;
    chartInstance.update();
  }
}

function testFunction() {
  let objectLength = 1000;
  let number = Math.floor(Math.random() * 9000) + 1000;
  console.log(number);

  let divisor = number / 10;
  console.log(divisor);

  let chartLength = number / divisor;
  console.log(chartLength);

  let chartArray = [0];
  for (let index = divisor; index <= number; index += divisor) {
    chartArray.push(index);
  }
  console.log(chartArray);

  // DeepSeek:
  // let chartData = [];

  // function addDataPoint(newPoint) {
  //   chartData.push(newPoint);
  //   if (chartData.length > 10) {
  //     chartData.shift(); // Entferne den ältesten Eintrag, wenn mehr als 10 Einträge vorhanden sind
  //   }
  // }

  // function getChartDataInSteps() {
  //   let result = [];
  //   for (let i = chartData[0]; i <= chartData[chartData.length - 1]; i += 10) {
  //     result.push(i);
  //   }
  //   return result;
  // }

  // // Beispiel: Füge täglich neue Datenpunkte hinzu
  // for (let i = 1; i <= 15; i++) {
  //   addDataPoint(i * 10); // Hier können Sie einen beliebigen Wert als neuen Datenpunkt hinzufügen
  //   console.log('Aktueller Chart-Daten:', chartData);
  //   console.log('Chart-Daten in Zehnerschritten:', getChartDataInSteps());
  // }
}

function initChartParams() {
  chartParams.sevenDays.labels = Object.keys(bitcoinData).slice(-7);
  chartParams.sevenDays.data = Object.values(bitcoinData).slice(-7);
  chartParams.sixMonths.labels = Object.keys(bitcoinData).slice(-185);
  chartParams.sixMonths.data = Object.values(bitcoinData).slice(-185);

  testFunction();

  // let objectLength = Object.keys(bitcoinData).length;
  // console.log(objectLength);

  // let divisor = Math.floor(objectLength / 48);
  // console.log(divisor);

  // let chartLength = objectLength / divisor;
  // console.log(chartLength);

  for (let i = 0; i < Object.keys(bitcoinData).length; i += 48) {
    chartParams.max.labels.push(Object.keys(bitcoinData)[i]);
    chartParams.max.data.push(Object.values(bitcoinData)[i]);
  }
}

function addButtonEventListener(buttonId, labels, data) {
  const button = document.getElementById(buttonId);
  button.addEventListener('click', () => {
    drawChart(labels, data);
  });
}

function initBtnEventlisteners() {
  addButtonEventListener(
    'seven-days-btn',
    chartParams.sevenDays.labels,
    chartParams.sevenDays.data
  );
  addButtonEventListener(
    'one-month-btn',
    chartParams.oneMonth.labels,
    chartParams.oneMonth.data
  );
  addButtonEventListener(
    'six-month-btn',
    chartParams.sixMonths.labels,
    chartParams.sixMonths.data
  );
  addButtonEventListener(
    'max-btn',
    chartParams.max.labels,
    chartParams.max.data
  );
}

async function fetchBitcoinData(startDate, endDate, currency = 'EUR') {
  const url = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}&currency=${currency}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  const data = await response.json();
  return data.bpi;
}

async function initChart() {
  try {
    bitcoinData = await fetchBitcoinData(initialStartDate, initialEndDate);
    chartParams.oneMonth.labels = Object.keys(bitcoinData).slice(-31);
    chartParams.oneMonth.data = Object.values(bitcoinData).slice(-31);
    drawChart(chartParams.oneMonth.labels, chartParams.oneMonth.data);
    initChartParams();
    initBtnEventlisteners();
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);
    alert('Error loading the Bitcoin data. Please try again later.');
  }
}

initChart();

// clone
