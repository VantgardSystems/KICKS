// Sneaker District: datos de la tienda. Claude Code: usa este archivo tal cual, no lo reescribas.
// Cada color trae su "tema" para el hero: bg (fondo), ink (texto), muted (texto secundario),
// disc (círculo detrás del tenis), big (nombre gigante de fondo), accent (botón) y on (texto del botón).
// Las rutas img/glb se arman solas: assets/img/{slug}-{color}.webp y assets/models/{slug}-{color}.glb

const STORE = {
  name: 'Sneaker District',
  slogan: 'Originales o nada.',
  whatsapp: '52XXXXXXXXXX', // [EDITAR]
  instagram: '[EDITAR]',
  tiktok: '[EDITAR]',
  address: '[EDITAR]',
  payments: 'Transferencia, tarjeta o efectivo en tienda. [EDITAR]',
  shipping: 'Envíos a todo México. [EDITAR]'
};

const SIZES = ['25', '25.5', '26', '26.5', '27', '27.5', '28', '29'];

const W = '#F4F4F4', K = '#1C1C1E', R = '#C8102E', S = '#F4F4F4', GUM = '#B5844F', WH = '#FFFFFF', OW = '#F26B1D';
const T = (bg, ink, muted, disc, big, accent, on) => ({ bg, ink, muted, disc, big, accent, on });
const C = (name, slug, upper, panel, sole, theme) => ({ name, slug, upper, panel, sole, theme });

const PRODUCTS = [
  { id: 'jordan-1-high', brand: 'Nike', name: 'Air Jordan 1 High', short: 'Jordan 1', price: 6499, colors: [
    C('Bred', 'bred', K, R, S, T('#1C1C1E', WH, '#A9AAAE', '#303033', '#27272A', R, WH)),
    C('Chicago', 'chicago', W, R, S, T('#F2EFEA', K, '#5E5A55', '#E6E0D6', '#E9E4DC', R, WH)),
    C('Royal', 'royal', K, '#1F4FA8', S, T('#1F3F8A', WH, '#C3CFEA', '#2C4E9E', '#264794', WH, '#1F3F8A'))] },
  { id: 'nb-550', brand: 'New Balance', name: '550', short: '550', price: 3299, colors: [
    C('Verde', 'verde', W, '#1E6B47', '#EDE8DF', T('#1E5A3F', WH, '#BFD8CB', '#286B4D', '#236246', '#EDE8DF', '#1E5A3F')),
    C('Marino', 'marino', W, '#1E2B44', '#EDE8DF', T('#1E2B44', WH, '#B9C2D3', '#2A3A5A', '#24324E', '#EDE8DF', '#1E2B44'))] },
  { id: 'samba-og', brand: 'Adidas', name: 'Samba OG', short: 'Samba', price: 2699, colors: [
    C('Negro', 'negro', K, W, GUM, T('#EDE3D6', K, '#5E5A55', '#E0D3C1', '#E5DACB', K, WH)),
    C('Blanco', 'blanco', W, K, GUM, T('#B5844F', K, '#2E2318', '#C29563', '#BB8A55', K, WH))] },
  { id: 'ow-out-of-office', brand: 'Off-White', name: 'Out of Office', short: 'Off-White', price: 11900, colors: [
    C('Blanco', 'blanco', W, '#9A9B9F', S, T('#F4F4F4', K, '#5E5F63', '#E6E6E7', '#EBEBEC', OW, K)),
    C('Negro', 'negro', K, '#9A9B9F', S, T('#2B2B2E', WH, '#B4B5B9', '#38383C', '#323235', OW, K))] },
  { id: 'ow-off-court-3-high', brand: 'Off-White', name: 'Off-Court 3.0 High', short: 'Off-Court', price: 13900, colors: [
    C('Blanco', 'blanco', W, K, S, T('#D9D9D6', K, '#4E4F52', '#CDCDC9', '#D2D2CE', OW, K)),
    C('Negro', 'negro', K, '#3A3A3C', S, T('#F26B1D', K, '#3B200E', '#F47E36', '#F37529', K, WH))] },
  { id: 'amiri-ma-1', brand: 'Amiri', name: 'MA-1', short: 'MA-1', price: 14500, colors: [
    C('Blanco', 'blanco', W, K, S, T('#E9E4DC', K, '#5E5A55', '#DCD5C9', '#E1DBD1', K, WH)),
    C('Negro', 'negro', K, '#3A3A3C', S, T('#3A3A3C', WH, '#C4C5C9', '#47474A', '#414143', WH, K))] },
  { id: 'lv-trainer', brand: 'Louis Vuitton', name: 'LV Trainer', short: 'Trainer', price: 27900, colors: [
    C('Blanco', 'blanco', W, '#C9C9CB', S, T('#6B4E37', WH, '#E3D3C4', '#7B5C43', '#73553D', '#E8C690', '#3A2A1D')),
    C('Verde', 'verde', W, '#2F5D3A', S, T('#23472D', WH, '#C7D9CB', '#2E5839', '#285033', '#E8C690', '#23472D'))] },
  { id: 'gucci-ace', brand: 'Gucci', name: 'Ace', short: 'Ace', price: 16900, colors: [
    C('Clásico', 'clasico', W, '#1E6B47', S, T('#0F3D2E', WH, '#BFD3C8', '#184C3A', '#134535', R, WH)),
    C('Rojo', 'rojo', W, R, S, T('#7A0E1C', WH, '#E8C3C8', '#8C1525', '#831120', '#1E6B47', WH))] },
  { id: 'yeezy-350-v2', brand: 'Yeezy', name: 'Boost 350 V2', short: '350', price: 5999, colors: [
    C('Zebra', 'zebra', '#E8E8E8', K, S, T('#E8E8E8', K, '#5E5F63', '#DADADB', '#DFDFE0', K, WH)),
    C('Onyx', 'onyx', '#2A2A2D', K, '#2A2A2D', T('#5F5F63', WH, '#DCDCDE', '#6B6B6F', '#646468', K, WH)),
    C('Bone', 'bone', '#EDE6D8', '#E0D7C5', '#EDE6D8', T('#D9CDB8', K, '#4F4636', '#CDBFA6', '#D3C6AF', K, WH))] }
];

// Rutas de archivos para cada color
PRODUCTS.forEach(p => p.colors.forEach(c => {
  c.img = `assets/img/${p.id}-${c.slug}.webp`;
  c.glb = `assets/models/${p.id}-${c.slug}.glb`;
}));

// Lanzamientos: [id del producto, slug del color, etiqueta]
const DROPS = [
  ['yeezy-350-v2', 'bone', 'Llega esta semana'],
  ['jordan-1-high', 'royal', 'Llega en 2 semanas'],
  ['ow-off-court-3-high', 'negro', 'Próximamente']
];

const REVIEWS = [
  { text: 'Llegaron en dos días, con caja y etiquetas. Ya es mi tienda de confianza.', who: '[Nombre], Monterrey' },
  { text: 'Me ayudaron a elegir la talla por WhatsApp y me quedaron perfectos.', who: '[Nombre], Ciudad de México' },
  { text: 'Me daba miedo que fueran piratas, pero me mandaron fotos de todo antes de pagar.', who: '[Nombre], Guadalajara' }
];

const formatPrice = n => '$' + n.toLocaleString('es-MX') + ' MXN';
