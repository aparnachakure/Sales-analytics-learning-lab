const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const exactMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

async function getJSON(endpoint) {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Could not load ${endpoint}`);
  return response.json();
}

function setContent(id, html) {
  document.getElementById(id).innerHTML = html;
}

function renderKpis(summary) {
  const cards = [
    ["Total revenue", money.format(summary.totalRevenue), "Full sales picture"],
    ["Profit earned", money.format(summary.totalProfit), `${summary.profitMargin}% margin`],
    ["Orders", summary.totalOrders, "Completed customer orders"],
    ["Average order value", exactMoney.format(summary.averageOrderValue), "Average basket size"],
    ["Profit margin", `${summary.profitMargin}%`, "Revenue that became profit"],
  ];

  setContent(
    "kpis",
    cards
      .map(
        ([label, value, note]) => `
          <article class="kpi">
            <p>${label}</p>
            <strong>${value}</strong>
            <span>${note}</span>
          </article>`,
      )
      .join(""),
  );
}

function renderMonthly(months) {
  const max = Math.max(...months.map((item) => item.revenue));
  setContent(
    "monthly-chart",
    `<div class="column-chart">
      ${months
        .map(
          (item) => `
            <div class="column-item">
              <span class="column-value">${money.format(item.revenue)}</span>
              <div class="column" style="height: ${(item.revenue / max) * 180}px"></div>
              <span>${item.month.slice(5)}</span>
            </div>`,
        )
        .join("")}
    </div>`,
  );
}

function renderBars(id, items, labelKey) {
  const max = Math.max(...items.map((item) => item.revenue));
  setContent(
    id,
    items
      .map(
        (item) => `
          <div class="bar-row">
            <div class="bar-label"><span>${item[labelKey]}</span><strong>${money.format(item.revenue)}</strong></div>
            <div class="bar-track"><div class="bar-fill" style="width: ${(item.revenue / max) * 100}%"></div></div>
          </div>`,
      )
      .join(""),
  );
}

function renderRows(rows) {
  const query = document.getElementById("search").value.toLowerCase();
  const visibleRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(query),
    ),
  );

  document.getElementById("rows-table").innerHTML = visibleRows
    .map(
      (row) => `
        <tr>
          <td><strong>${row.orderId}</strong></td>
          <td>${row.orderDate}</td>
          <td>${row.customer}</td>
          <td>${row.region}</td>
          <td>${row.product}</td>
          <td>${exactMoney.format(row.revenue)}</td>
          <td class="profit">${exactMoney.format(row.profit)}</td>
        </tr>`,
    )
    .join("");
}

async function loadDashboard() {
  try {
    const [summary, monthly, categories, regions, products, rows] =
      await Promise.all([
        getJSON("/api/summary"),
        getJSON("/api/monthly"),
        getJSON("/api/category"),
        getJSON("/api/region"),
        getJSON("/api/products"),
        getJSON("/api/rows"),
      ]);

    renderKpis(summary);
    renderMonthly(monthly);
    renderBars("category-chart", categories, "category");
    renderBars("region-chart", regions, "region");
    renderBars("product-chart", products.slice(0, 6), "product");
    renderRows(rows);
    document.getElementById("search").addEventListener("input", () => renderRows(rows));
  } catch (error) {
    document.querySelector(".page").insertAdjacentHTML(
      "afterbegin",
      `<div class="error">${error.message}. Check that the server is running.</div>`,
    );
  }
}

loadDashboard();