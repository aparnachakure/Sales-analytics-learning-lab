const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = process.env.PORT || 3000;
const root = __dirname;
const dataPath = path.join(root, "data", "sales_data_for_excel.csv");

function round(value) {
  return Math.round(value * 100) / 100;
}

function loadSales() {
  const [headerLine, ...lines] = fs
    .readFileSync(dataPath, "utf8")
    .trim()
    .split(/\r?\n/);
  const headers = headerLine.split(",");

  return lines.filter(Boolean).map((line) => {
    const values = line.split(",");
    const row = Object.fromEntries(
      headers.map((header, index) => [header, values[index]]),
    );

    return {
      orderId: row.order_id,
      orderDate: row.order_date,
      customer: row.customer,
      region: row.region,
      category: row.category,
      product: row.product,
      units: Number(row.units),
      unitPrice: Number(row.unit_price),
      discount: Number(row.discount),
      revenue: Number(row.revenue),
      cost: Number(row.cost),
      profit: Number(row.profit),
    };
  });
}

function groupSales(rows, getKey) {
  const groups = new Map();

  for (const row of rows) {
    const key = getKey(row);
    const current = groups.get(key) || {
      key,
      revenue: 0,
      profit: 0,
      orders: 0,
      units: 0,
      category: row.category,
    };

    current.revenue += row.revenue;
    current.profit += row.profit;
    current.orders += 1;
    current.units += row.units;
    groups.set(key, current);
  }

  return [...groups.values()].map((item) => ({
    ...item,
    revenue: round(item.revenue),
    profit: round(item.profit),
  }));
}

function getApiData(pathname) {
  const rows = loadSales();

  if (pathname === "/api/summary") {
    const totalRevenue = rows.reduce((sum, row) => sum + row.revenue, 0);
    const totalProfit = rows.reduce((sum, row) => sum + row.profit, 0);
    return {
      totalRevenue: round(totalRevenue),
      totalProfit: round(totalProfit),
      totalOrders: rows.length,
      averageOrderValue: round(totalRevenue / rows.length),
      profitMargin: round((totalProfit / totalRevenue) * 100),
      dateFrom: rows[0].orderDate,
      dateTo: rows[rows.length - 1].orderDate,
    };
  }

  if (pathname === "/api/monthly") {
    return groupSales(rows, (row) => row.orderDate.slice(0, 7))
      .map(({ key, revenue, profit, orders }) => ({
        month: key,
        revenue,
        profit,
        orders,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  if (pathname === "/api/category") {
    return groupSales(rows, (row) => row.category)
      .map(({ key, revenue, profit, orders }) => ({
        category: key,
        revenue,
        profit,
        orders,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  if (pathname === "/api/region") {
    return groupSales(rows, (row) => row.region)
      .map(({ key, revenue, profit, orders }) => ({
        region: key,
        revenue,
        profit,
        orders,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  if (pathname === "/api/products") {
    return groupSales(rows, (row) => row.product)
      .map(({ key, category, revenue, profit, units }) => ({
        product: key,
        category,
        revenue,
        profit,
        units,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  if (pathname === "/api/rows") {
    return rows;
  }

  return null;
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".sql": "text/plain; charset=utf-8",
};

function sendJson(response, data, statusCode = 200) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(data));
}

function sendStatic(response, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(response, { error: "File not found" }, 404);
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
    });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url || "/", `http://${request.headers.host}`).pathname;

  if (pathname.startsWith("/api/")) {
    try {
      const data = getApiData(pathname);
      sendJson(response, data, data === null ? 404 : 200);
    } catch (error) {
      sendJson(response, { error: error.message }, 500);
    }
    return;
  }

  let filePath;
  if (pathname.startsWith("/data/")) {
    filePath = path.join(root, pathname);
  } else if (pathname.startsWith("/sql/")) {
    filePath = path.join(root, pathname);
  } else {
    const publicFile = pathname === "/" ? "/index.html" : pathname;
    filePath = path.join(root, "public", publicFile);
  }

  sendStatic(response, filePath);
});

server.listen(PORT, () => {
  console.log(`Sales Analytics Lab running at http://localhost:${PORT}`);
});