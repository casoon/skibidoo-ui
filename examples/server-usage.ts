// Example: Server-Side Rendering with UI Framework
// Works with Express, Hono, Cloudflare Workers, etc.

import { createUIFramework } from "@skibidoo/ui";

// Create the UI framework instance
const ui = createUIFramework({
  theme: "light",
  locale: "de",
  hydrationStrategy: "lazy",
});

// Example: Render a data grid
async function renderUserGrid(users: User[]) {
  return ui.renderGrid({
    columns: [
      { field: "id", label: "ID", width: 60, align: "center" },
      { field: "name", label: "Name", sortable: true },
      { field: "email", label: "E-Mail", sortable: true },
      { field: "role", label: "Rolle", width: 120 },
      { field: "createdAt", label: "Erstellt", type: "date", width: 120 },
    ],
    data: users,
    pagination: { pageSize: 10, showTotal: true },
    sorting: true,
    filtering: true,
    selection: "multiple",
    rowKey: "id",
  });
}

// Example: Render a form
async function renderContactForm() {
  return ui.renderForm({
    fields: [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Max Mustermann" },
      { name: "email", label: "E-Mail", type: "email", required: true },
      { name: "phone", label: "Telefon", type: "text" },
      { name: "subject", label: "Betreff", type: "select", required: true, options: [
        { value: "support", label: "Support" },
        { value: "sales", label: "Vertrieb" },
        { value: "other", label: "Sonstiges" },
      ]},
      { name: "message", label: "Nachricht", type: "textarea", required: true },
      { name: "newsletter", label: "Newsletter abonnieren", type: "checkbox" },
    ],
    action: "/api/contact",
    submitLabel: "Nachricht senden",
    showReset: true,
  });
}

// Example: Full page with components
async function renderPage() {
  const gridHtml = await renderUserGrid(users);
  const formHtml = await renderContactForm();

  return `
<!DOCTYPE html>
<html lang="de" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI Framework Demo</title>
  <link rel="stylesheet" href="/node_modules/@skibidoo/ui/dist/styles/index.css">
</head>
<body>
  <div class="container">
    <h1>Benutzer</h1>
    ${gridHtml}

    <h2>Kontakt</h2>
    ${formHtml}
  </div>

  <script type="module">
    import { initUIFramework } from "@skibidoo/ui/client";

    // Initialize with optional configuration
    const ui = initUIFramework();

    // Configure specific components
    ui.configure("grid-abc123", {
      onSort: (field, dir) => console.log("Sort:", field, dir),
      onPageChange: (page) => console.log("Page:", page),
      fetchData: async (state) => {
        const res = await fetch("/api/users?" + new URLSearchParams({
          page: state.currentPage,
          sort: state.sortField || "",
          dir: state.sortDirection,
        }));
        return res.text();
      },
    });

    // Listen to component events
    document.addEventListener("grid:selectionChange", (e) => {
      console.log("Selected rows:", e.detail.selected);
    });

    document.addEventListener("form:submit", (e) => {
      console.log("Form submitted:", e.detail.values);
    });
  </script>
</body>
</html>
  `;
}

// Sample data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const users: User[] = [
  { id: 1, name: "Max Mustermann", email: "max@example.com", role: "Admin", createdAt: "2024-01-15" },
  { id: 2, name: "Erika Musterfrau", email: "erika@example.com", role: "User", createdAt: "2024-02-20" },
  { id: 3, name: "Hans Schmidt", email: "hans@example.com", role: "Editor", createdAt: "2024-03-10" },
];

export { renderPage, renderUserGrid, renderContactForm };
