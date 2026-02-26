/**
 * One-time migration: resets all content and translations to the Sun Dizayn brand.
 * Run once from the server/ directory: node scripts/reset-to-sundizayn.js
 *
 * What this script does:
 *  - Replaces the 5 products with the new Sun Dizayn product lineup
 *  - Replaces product categories with the 5 new categories
 *  - Clears old dummy blogs, projects, reviews
 *  - Resets sliders to 5 empty slots (upload images via admin panel)
 *  - Updates translations (TR + EN) with new corporate texts and product descriptions
 */
import dotenv from 'dotenv';
dotenv.config();
import { pool } from '../db.js';

// ─── NEW PRODUCTS ────────────────────────────────────────────────────────────
const newProducts = [
  { id: 1, titleKey: 'prod_alu_cephe',   descriptionKey: 'prod_alu_cephe_desc',   category: 'alu_cephe', image: '' },
  { id: 2, titleKey: 'prod_sil_cephe',   descriptionKey: 'prod_sil_cephe_desc',   category: 'sil_cephe', image: '' },
  { id: 3, titleKey: 'prod_alu_korkuluk',descriptionKey: 'prod_alu_korkuluk_desc',category: 'alu_korkuluk', image: '' },
  { id: 4, titleKey: 'prod_pvc_dograma', descriptionKey: 'prod_pvc_dograma_desc', category: 'pvc', image: '' },
  { id: 5, titleKey: 'prod_sineklik',    descriptionKey: 'prod_sineklik_desc',    category: 'sineklik', image: '' }
];

// ─── NEW CATEGORIES ──────────────────────────────────────────────────────────
const newCategories = {
  blogs:    {},
  projects: {},
  reviews:  {},
  products: {
    alu_cephe:   { tr: 'Alüminyum Cephe',   en: 'Aluminium Facade' },
    sil_cephe:   { tr: 'Silikon Cephe',     en: 'Silicon Facade' },
    alu_korkuluk:{ tr: 'Alüminyum Korkuluk',en: 'Aluminium Railing' },
    pvc:         { tr: 'PVC Doğrama',       en: 'PVC Joinery' },
    sineklik:    { tr: 'Sineklik',          en: 'Fly Screen' }
  }
};

// ─── 5 EMPTY SLIDER SLOTS ────────────────────────────────────────────────────
const newSliders = [
  { image: '', hotspots: [] },
  { image: '', hotspots: [] },
  { image: '', hotspots: [] },
  { image: '', hotspots: [] },
  { image: '', hotspots: [] }
];

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const newTranslations = {
  tr: {
    about: 'Hakkımızda',
    aboutTitle: 'Şirketimiz Hakkında',
    about_intro: 'Sun Dizayn olarak, modern mimarinin estetik ve teknik gereksinimlerini en üst düzeyde karşılayan yenilikçi dış cephe ve doğrama çözümleri sunuyoruz. Alüminyum ve silikon cephe sistemlerinden, yüksek yalıtımlı PVC doğramalara ve estetik korkuluk sistemlerine kadar geniş bir yelpazede hizmet vermekteyiz. Amacımız; yalnızca binaların dış görünüşünü güzelleştirmek değil, aynı zamanda ısı ve ses yalıtımı sağlayarak uzun ömürlü, güvenli ve çevre dostu yaşam alanları inşa etmektir.',
    admin_actions: 'İşlemler',
    admin_add: 'Ekle',
    admin_add_category: 'Kategori Ekle',
    admin_category: 'Kategori',
    admin_delete: 'Sil',
    admin_rename: 'Yeniden Adlandır',
    admin_image: 'Görsel',
    admin_language: 'Dil',
    admin_save_all: 'Tümünü Kaydet',
    admin_saved: 'Kaydedildi',
    admin_duplicate_id: "Aynı ID'ler",
    admin_duplicate_title: 'Aynı başlıklar',
    admin_text: 'Metin',
    admin_title: 'İçerik Yönetimi',
    admin_title_label: 'Başlık',
    basic: 'Temel',
    blogs: 'Bloglar',
    calculator: 'Hesaplama',
    categories: 'Kategoriler',
    choose_file: 'Dosya Seç',
    calculate: 'Hesapla',
    loading: 'Yükleniyor...',
    admin_save_error: 'Kaydedilemedi',
    login: 'Giriş',
    login_error: 'Şifre yanlış',
    login_success: 'Giriş başarılı',
    user_not_found: 'Kullanıcı bulunamadı',
    password_incorrect: 'Şifre yanlış',
    contact: 'İletişim',
    contact_email_label: 'E-posta',
    contact_email_placeholder: 'E-posta adresinizi girin',
    contact_form_heading: 'İletişime Geçin',
    contact_message_label: 'Mesaj',
    contact_message_placeholder: 'Mesajınızı buraya yazın',
    contact_name_label: 'Ad',
    contact_name_placeholder: 'Adınızı girin',
    contact_submit: 'Gönder',
    contact_success: 'Mesaj başarıyla gönderildi!',
    contact_error: 'Mesaj gönderilemedi.',
    copyright: 'Tüm hakları saklıdır',
    estimated_price: 'Tahmini Fiyat',
    filter_all: 'Tümü',
    footer_about: 'Sun Dizayn - modern dış cephe ve doğrama sistemleri çözümleri.',
    footer_contact: 'İletişim',
    footer_menu: 'Menü',
    height_cm: 'Yükseklik (cm)',
    highlight_projects: 'Öne Çıkan Projeler',
    home: 'Anasayfa',
    left_section_text: 'Ürünlerimiz hakkında bilgi almak için ürün kartlarına tıklayın.',
    left_section_title: 'Tanıtım Yazısı',
    mission: 'Misyonumuz',
    mission_text: 'Müşterilerimizin ihtiyaçlarına özel, enerji verimliliği yüksek, dayanıklı ve şık mimari çözümler üretmek. Her projede kalite standartlarından ödün vermeden, yaşam ve çalışma alanlarını daha güvenli ve estetik bir hale getirmek için titizlikle çalışmak.',
    mission_text_label: 'Misyon Metni',
    no_file_selected: 'Dosya seçilmedi',
    pricing_error: 'Fiyat verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.',
    prod_alu_cephe: 'Alüminyum Cephe Giydirme',
    prod_alu_cephe_desc: 'Modern mimarinin vazgeçilmez unsurlarından biri olan alüminyum cephe giydirme sistemleri, estetik görünüm, dayanıklılık ve enerji verimliliğini bir araya getirir. Sun Dizayn olarak, çağdaş yapılara değer katan cephe çözümleri sunuyoruz. Yüksek kaliteli alüminyum profiller ile tasarlanan sistemlerimiz; ısı ve ses yalıtımı sağlar, dış etkenlere karşı maksimum dayanıklılık sunar, binalara modern ve şık bir görünüm kazandırır. Giydirme cephe uygulamalarımız, projeye özel mühendislik hesaplamaları ve profesyonel montaj ile desteklenerek, uzun ömürlü ve sorunsuz çözümler sunar. AVM\'ler, iş merkezleri, oteller ve konut projeleri başta olmak üzere birçok yapıya özel tasarım imkânı sağlıyoruz. Estetik tasarım, teknik kalite ve profesyonellik arayanlar için Sun Dizayn yanınızda.',
    prod_sil_cephe: 'Silikon Cephe Sistemleri',
    prod_sil_cephe_desc: "Modern yaşam alanlarınız için en iyi çözüm. Sun Dizayn Kalitesiyle Estetik ve Güvenli Dış Cephe Çözümleri. Modern mimarinin vazgeçilmez bir parçası olan silikon cephe sistemleri, Sun Dizayn'ın uzmanlığıyla hem estetik hem de teknik açıdan üst düzey bir çözüm sunar. Bu sistemde cam yüzeyler özel silikon yapıştırıcılarla taşıyıcı alüminyum karkasa monte edilir. Dışarıdan bakıldığında yalnızca şık ve düz bir cam yüzeyi görünür, böylece yapılarınıza çağdaş ve prestijli bir görünüm kazandırılır.",
    prod_alu_korkuluk: 'Alüminyum Korkuluk Sistemleri',
    prod_alu_korkuluk_desc: 'Dikey Hareketli Konfor ve Güvenlik Çözümü. Güvenlik, Estetik ve Dayanıklılığı Bir Arada Sunar. Alüminyum korkuluk sistemleri; merdiven, balkon, teras ve bina çevrelerinde hem güvenliği sağlar hem de modern bir görünüm kazandırır. Sun Dizayn tarafından sunulan korkuluk çözümleri, paslanmaz yapısı ve şık tasarımıyla uzun ömürlü kullanım sunar.',
    prod_pvc_dograma: 'Plastik Doğrama',
    prod_pvc_dograma_desc: 'Plastik doğrama sistemleri; ses ve ısı yalıtımıyla konforlu yaşam alanları sunarken, estetik tasarımıyla modern yapılarla mükemmel uyum sağlar. Sun Dizayn olarak sunduğumuz PVC doğrama çözümleri; uzun ömürlü, düşük bakım gerektiren ve çevre dostu ürünlerden oluşur. Avantajlar: Mükemmel ısı ve ses yalıtımı, farklı renk ve tasarım seçenekleri, sızdırmaz ve hava koşullarına dayanıklı yapı, ekonomik ve uzun ömürlü kullanım. Kullanım Alanları: Ev, ofis, balkon, kış bahçesi ve çok daha fazlası… Güvenilir, kaliteli ve estetik PVC doğrama çözümleri için Sun Dizayn yanınızda.',
    prod_sineklik: 'Sineklik',
    prod_sineklik_desc: 'Yavaş yavaş yaklaşan sıcak mevsimin davetsiz misafirleri yani sinek ve tüm uçan haşereler artık diledikleri gibi kapı ve pencerelerden giremeyecek. Sun Dizayn Kocaeli ve Doğu Marmara Bölgesi\'nde sizler için sağlığınıza zararlı olan ilaçların yerine her ebat ve ölçüde sineklikler ile mücadele ediyor. Ayrıntılı bilgi almak için lütfen bizimle irtibata geçiniz. Sineklik Sistemi hem pencere hem de kapı olabilecek tarzda geliştirilmiştir. Sistem, kanat olarak açılma ve gerektiğinde takılıp çıkarılabilme avantajını sağlayan kullanım alternatiflerine sahiptir. Kolay monte edilir. Yıkanarak veya silinerek kolayca temizlenebilir.',
    products: 'Ürünler',
    project: 'Proje',
    project_sample_text: 'Proje için kısa açıklama.',
    projects: 'Son Projelerimiz',
    quantity: 'Adet',
    readMore: 'Devamını Oku',
    reviews: 'Müşteri Yorumları',
    values: 'Değerlerimiz',
    values_text: 'Dürüstlük, kalite ve müşteri odaklılık.',
    values_text_label: 'Değerler Metni',
    vision: 'Vizyonumuz',
    vision_text: 'Mimari estetiği, mühendislik kalitesiyle buluşturarak sektörde yenilikçi çözümlerin öncüsü olmak; modern yapılara kattığımız değer ve sağladığımız güven ile en çok tercih edilen yapı sistemleri markası haline gelmek.',
    vision_text_label: 'Vizyon Metni',
    welcome: 'Hoş Geldiniz',
    width_cm: 'Genişlik (cm)',
    pricing: 'Fiyatlandırma',
    admin_product: 'Ürün',
    admin_products: 'Ürünler',
    admin_base_price: 'Birim Fiyat',
    admin_features: 'Özellikler',
    admin_label: 'Etiket',
    admin_description: 'Açıklama',
    admin_multiplier: 'Katsayı',
    admin_add_product: 'Ürün Ekle',
    admin_add_feature: 'Özellik Ekle',
    slider_admin: 'Slider Yönetimi',
    add_slide: 'Slayt Ekle',
    change_image: 'Resmi Değiştir',
    admin_add_hotspot: 'Hotspot Ekle',
    admin_delete_hotspot: 'Hotspot Sil',
    too_many_attempts: 'Çok fazla hatalı giriş denemesi. Lütfen daha sonra tekrar deneyin.',
    page_not_found: 'Sayfa bulunamadı',
    back_home: 'Ana sayfaya dön',
    admin_featured: 'Öne Çıkan'
  },
  en: {
    about: 'About Us',
    aboutTitle: 'About Our Company',
    about_intro: 'At Sun Dizayn, we offer innovative exterior facade and window systems that meet the aesthetic and technical requirements of modern architecture at the highest level. We serve a wide range from aluminium and silicon facade systems to highly insulated PVC windows and elegant railing systems. Our goal is not only to beautify the exteriors of buildings, but also to create long-lasting, safe and eco-friendly living spaces by providing thermal and sound insulation.',
    admin_actions: 'Actions',
    admin_add: 'Add',
    admin_add_category: 'Add Category',
    admin_category: 'Category',
    admin_delete: 'Delete',
    admin_rename: 'Rename',
    admin_image: 'Image',
    admin_language: 'Language',
    admin_save_all: 'Save All',
    admin_saved: 'Saved',
    admin_duplicate_id: 'Duplicate IDs',
    admin_duplicate_title: 'Duplicate titles',
    admin_text: 'Text',
    admin_title: 'Content Admin',
    admin_title_label: 'Title',
    basic: 'Basic',
    blogs: 'Blogs',
    calculator: 'Calculator',
    categories: 'Categories',
    choose_file: 'Choose File',
    calculate: 'Calculate',
    loading: 'Loading...',
    admin_save_error: 'Failed to save',
    login: 'Login',
    login_error: 'Incorrect password',
    login_success: 'Login successful',
    user_not_found: 'User not found',
    password_incorrect: 'Password incorrect',
    contact: 'Contact',
    contact_email_label: 'Email',
    contact_email_placeholder: 'Enter your email address',
    contact_form_heading: 'Get in Touch',
    contact_message_label: 'Message',
    contact_message_placeholder: 'Write your message here',
    contact_name_label: 'Name',
    contact_name_placeholder: 'Enter your name',
    contact_submit: 'Send',
    contact_success: 'Message sent successfully!',
    contact_error: 'Failed to send message.',
    copyright: 'All rights reserved',
    estimated_price: 'Estimated Price',
    filter_all: 'All',
    footer_about: 'Sun Dizayn - innovative exterior facade and window system solutions.',
    footer_contact: 'Contact',
    footer_menu: 'Menu',
    height_cm: 'Height (cm)',
    highlight_projects: 'Highlighted Projects',
    home: 'Home',
    left_section_text: 'Click on the product cards to learn more about our products.',
    left_section_title: 'Introductory Text',
    mission: 'Our Mission',
    mission_text: 'To develop custom, energy-efficient, durable and elegant architectural solutions for our clients. To work meticulously to make living and working spaces safer and more aesthetic without compromising quality standards in every project.',
    mission_text_label: 'Mission Text',
    no_file_selected: 'No file selected',
    pricing_error: 'Unable to load pricing data. Please try again later.',
    prod_alu_cephe: 'Aluminium Facade Cladding',
    prod_alu_cephe_desc: 'One of the indispensable elements of modern architecture, aluminium facade cladding systems combine aesthetic appearance, durability and energy efficiency. At Sun Dizayn, we offer facade solutions that add value to contemporary buildings. Our systems designed with high quality aluminium profiles provide heat and sound insulation, offer maximum durability against external factors, and give buildings a modern and elegant appearance. Our cladding facade applications are supported by project-specific engineering calculations and professional installation, offering long-lasting and trouble-free solutions. We provide custom design possibilities for many structures including shopping centres, business centres, hotels and residential projects. Sun Dizayn is by your side for those seeking aesthetic design, technical quality and professionalism.',
    prod_sil_cephe: 'Silicon Facade Systems',
    prod_sil_cephe_desc: "The best solution for your modern living spaces. Aesthetic and Safe Exterior Facade Solutions with Sun Dizayn Quality. Silicon facade systems, an indispensable part of modern architecture, offer a top-level solution both aesthetically and technically with Sun Dizayn's expertise. In this system, glass surfaces are mounted to the load-bearing aluminium frame with special silicone adhesives. When viewed from outside, only a sleek and flat glass surface is visible, giving your buildings a contemporary and prestigious appearance.",
    prod_alu_korkuluk: 'Aluminium Railing Systems',
    prod_alu_korkuluk_desc: 'Vertical Mobile Comfort and Safety Solution. Combines Safety, Aesthetics and Durability. Aluminium railing systems provide both safety and a modern appearance on stairs, balconies, terraces and building surroundings. The railing solutions offered by Sun Dizayn provide long-lasting use with their rust-free structure and elegant design.',
    prod_pvc_dograma: 'PVC Joinery',
    prod_pvc_dograma_desc: 'PVC window and door systems offer comfortable living spaces with sound and heat insulation, while perfectly harmonising with modern structures with their aesthetic design. The PVC joinery solutions we offer at Sun Dizayn consist of long-lasting, low-maintenance and eco-friendly products. Advantages: excellent heat and sound insulation, various colour and design options, airtight and weather-resistant structure, economical and long-lasting use. Usage Areas: Home, office, balcony, winter garden and much more. Sun Dizayn is by your side for reliable, quality and aesthetic PVC joinery solutions.',
    prod_sineklik: 'Fly Screen Systems',
    prod_sineklik_desc: "The unwanted guests of the slowly approaching hot season — flies and all flying insects — will no longer be able to enter through doors and windows as they please. Sun Dizayn fights against insects in Kocaeli and the Eastern Marmara Region with fly screens in every size and dimension instead of medicines harmful to your health. Please contact us for detailed information. The Fly Screen System has been developed to be used as both a window and a door. The system has usage alternatives that provide the advantage of opening as a wing and being removable when needed. Easy to install. Can be easily cleaned by washing or wiping.",
    products: 'Products',
    project: 'Project',
    project_sample_text: 'Short project description.',
    projects: 'Our Latest Projects',
    quantity: 'Quantity',
    readMore: 'Read More',
    reviews: 'Customer Reviews',
    values: 'Our Values',
    values_text: 'Integrity, quality and customer focus.',
    values_text_label: 'Values Text',
    vision: 'Our Vision',
    vision_text: 'To be a pioneer of innovative solutions in the industry by combining architectural aesthetics with engineering quality; to become the most preferred building systems brand with the value we add to modern structures and the trust we provide.',
    vision_text_label: 'Vision Text',
    welcome: 'Welcome',
    width_cm: 'Width (cm)',
    pricing: 'Pricing',
    admin_product: 'Product',
    admin_products: 'Products',
    admin_base_price: 'Base Price',
    admin_features: 'Features',
    admin_label: 'Label',
    admin_description: 'Description',
    admin_multiplier: 'Multiplier',
    admin_add_product: 'Add Product',
    admin_add_feature: 'Add Feature',
    slider_admin: 'Slider Admin',
    add_slide: 'Add Slide',
    change_image: 'Change Image',
    admin_add_hotspot: 'Add Hotspot',
    admin_delete_hotspot: 'Delete Hotspot',
    too_many_attempts: 'Too many login attempts. Please try again later.',
    page_not_found: 'Page not found',
    back_home: 'Go back home',
    admin_featured: 'Featured'
  }
};

// ─── RUN MIGRATION ────────────────────────────────────────────────────────────
console.log('Starting Sun Dizayn content migration...\n');

// 1. Fetch current content to preserve non-product fields
const [cRows] = await pool.query('SELECT data FROM content WHERE id = 1');
const currentContent = cRows.length ? (typeof cRows[0].data === 'string' ? JSON.parse(cRows[0].data) : cRows[0].data) : {};

// 2. Build new content (preserve blogs/projects/reviews structure but clear entries)
const newContent = {
  ...currentContent,
  blogs: [],
  projects: [],
  reviews: [],
  products: newProducts,
  categories: newCategories,
  sliders: newSliders
};

// 3. Update content table
await pool.query('UPDATE content SET data = ? WHERE id = 1', [JSON.stringify(newContent)]);
console.log('✓ content table updated (products, categories, sliders, blogs, projects, reviews reset)');

// 4. Update translations table
await pool.query('UPDATE translations SET data = ? WHERE id = 1', [JSON.stringify(newTranslations)]);
console.log('✓ translations table updated (TR + EN)');

console.log('\nMigration complete. Restart the server for changes to take effect.');
await pool.end();
