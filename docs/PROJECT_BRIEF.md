# 💞 Project Brief – Glass Company Website (TR / EN)

## 🔹 PURPOSE

This project is a corporate showcase website for a company that sells glass, PVC (pimapen), and construction-related products. The goal is to build a modern, responsive, multilingual website that guides visitors directly to products or relevant information.

---

## 🔹 TECH STACK & STRUCTURE

* **Frontend:** React + TypeScript + TailwindCSS + shadcn/ui
* **Backend:** Express + PostgreSQL
* **Language Support:** Turkish and English (via i18next)
* **Admin Panel:** Custom SPA in React
* **Hosting:** cPanel (with PostgreSQL support)
* **Image Management:** Initially local storage, later via Cloudinary
* **Design:** Fully responsive, mobile-friendly, and clean modern UI

---

## 🔹 NAVBAR STRUCTURE

The navbar is fixed to the top of the screen and includes the following links:

* **Home** (`/`)
* **Products** (`/products`)
* **Calculator** (`/calculator`) → For users to calculate pricing (e.g., glass cutting)
* **Blogs** (`/blogs`)
* **Contact** (`/contact`)
* **Language Toggle Buttons** (TR | EN) → Placed at the top-right corner

On mobile, the navbar collapses into a hamburger menu. The selected language is stored locally for consistency.

---

## 🔹 HOMEPAGE STRUCTURE

**Top-to-bottom layout:**

1. **Welcome Header** – Large, centered headline with modern typography
2. **Slider + Text Section**
   * Left: Introductory text (language-supported)
   * Right: A Swiper.js-based image slider with interactive **hotspots**
3. **Latest Blog Posts** – Automatically shows the 3 most recent blog entries
4. **Recent Projects** – Displays 3 dynamic projects
5. **Product Highlights** – Example: Glass and PVC
6. **Footer** – About Us, navigation links, contact info, year + “All rights reserved”

All sections are multilingual, and cards are fully clickable.

---

## 🔹 MULTILINGUAL SUPPORT

* All text content is translated via `translation.json`
* Language switches instantly on toggle
* Auto-detects browser language on first visit

---

## 🔹 DYNAMIC CONTENT

* `/api/blogs?limit=3` → Latest blogs
* `/api/projects?limit=3` → Latest projects
* `/api/products?limit=2` → Example products (Glass, PVC)

Changes in the admin panel automatically update the homepage.

---

## 🔹 CLICKABLE INTERACTIONS & ROUTING

* Blog, project, and product cards are fully clickable
* Routing examples:
  * `/blogs/:id`
  * `/projects/:id`
  * `/products/:category`

---

## 🔹 ADMIN PANEL (Future Phase)

* JWT-protected login system
* CRUD for blogs, projects, and products
* Image uploads (initially local, later Cloudinary)
* Updates instantly reflect on the frontend

---

## 🔹 MOBILE-FRIENDLY & RESPONSIVE DESIGN

* Tailwind-based grid system
* Navbar becomes a hamburger menu on small screens
* Cards stack vertically for mobile

---

## 🔹 UPCOMING FEATURES

* [ ] Fully functional admin panel
* [ ] Blog detail pages
* [ ] SEO + Google Analytics
* [ ] Email system via Nodemailer
* [ ] Advanced price calculator with backend logic
* [ ] Image optimization with CDN

---

## ➕ CALCULATOR PAGE (`/calculator`)

### Purpose
Provide users with an intuitive tool to estimate pricing for glass, PVC, or balcony products.

### Layout
1. **Header & Intro**
2. **Product Type Selector** (`Glass`, `PVC`, `Balcony`)
3. **Input Fields**: width, height, quantity, optional selections (tempered, colored, double glazing, etc.)
4. **Calculate Button** → Shows estimated price below
5. **Results Panel**
6. **Responsive Design** via Tailwind

### Future Expansion
* Email offer form
* Admin-adjustable pricing formulas

---

## 🏛️ ABOUT US PAGE (`/about`)

### Purpose
Build trust by explaining the company’s history, mission, experience, and past projects.

### Layout
1. Header & Introduction
2. Mission – Vision – Core Values (3 cards)
3. Company Overview or Timeline
4. Featured Projects
5. Photo Gallery (optional)
6. Why Choose Us?

Projects are fetched via `GET /api/projects?highlight=true`.

---

## 🔺 Page Summary

| Page | Description |
|------|-------------|
| `/calculator` | Pricing calculator based on dimensions and options |
| `/about` | Company introduction, mission/vision, project highlights |

---

## 👉 NEXT STEPS

* [ ] Create `CalculatorForm.tsx` component
* [ ] Build `/api/projects?highlight=true` endpoint
* [ ] Bind dynamic data to `/about` route
* [ ] (Optional) Add Markdown/CMS support for blog/about pages

---

## 💡 Price Calculation Algorithm (Concept)

1. **User Input**
   * Product type (`Glass`, `PVC`, `Balcony`)
   * Width, height, quantity
   * Optional features (tempered glass, double glazing, color, etc.)
2. **Fetch Pricing Settings**
   * Frontend requests `GET /api/pricing` to obtain base prices and feature multipliers defined in the admin panel.
3. **Calculate Area**
   * `area = width × height ÷ 10,000` (convert cm² to m²)
4. **Base Price**
   * `basePrice = pricingSettings[productType].pricePerSquareMeter`
5. **Feature Multipliers**
   * Start with `multiplier = 1`
   * For each selected feature, multiply by its configured value (e.g., Tempered Glass = `1.25`)
6. **Total Cost**
   * `total = area × basePrice × multiplier × quantity`
7. **Display Result**
   * Show formatted total (e.g., `Estimated Price: ₺3500`)

All pricing values and feature availability are managed by the admin panel, so no frontend changes are needed when prices or options change.

