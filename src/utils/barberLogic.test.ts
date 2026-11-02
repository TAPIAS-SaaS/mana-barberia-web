import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_SERVICES,
  formatCopPrice,
  filterServicesByCategory,
  updateServicePrice,
  buildDirectWhatsAppUrl,
} from './barberLogic';

test('formatCopPrice formats Colombian Pesos with dot thousands separators', () => {
  assert.equal(formatCopPrice(25000), '$25.000 COP');
  assert.equal(formatCopPrice(65000), '$65.000 COP');
});

test('filterServicesByCategory separates individual services and combos', () => {
  const servicios = filterServicesByCategory(INITIAL_SERVICES, 'servicios');
  const combos = filterServicesByCategory(INITIAL_SERVICES, 'combos');
  assert.equal(servicios.length, 3);
  assert.equal(combos.length, 3);
});

test('updateServicePrice updates target service price and rejects invalid amounts', () => {
  const updated = updateServicePrice(INITIAL_SERVICES, 'corte-cabello', 28000);
  const target = updated.find((s) => s.id === 'corte-cabello');
  assert.equal(target?.priceCop, 28000);

  assert.throws(() => {
    updateServicePrice(INITIAL_SERVICES, 'corte-cabello', 500);
  }, /mayor o igual a \$1\.000 COP/);
});

test('buildDirectWhatsAppUrl creates valid direct wa.me URL for Maná Barbería', () => {
  const url = buildDirectWhatsAppUrl('Hola Maná Barbería, quiero consultar por el Combo VIP');
  assert.equal(url.startsWith('https://wa.me/573224250545?text='), true);
  assert.equal(decodeURIComponent(url).includes('Combo VIP'), true);
});
