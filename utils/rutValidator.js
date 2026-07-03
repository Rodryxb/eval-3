/**
 * Valida un RUT chileno con dígito verificador.
 * Acepta formatos: 12345678-9, 12.345.678-9, 123456789
 * Retorna true/false.
 */
function validarRut(rutCompleto) {
  if (typeof rutCompleto !== 'string') return false;

  const rutLimpio = rutCompleto.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase();

  if (!/^[0-9]+[0-9K]$/.test(rutLimpio)) return false;
  if (rutLimpio.length < 2) return false;

  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado;
  if (resto === 11) dvEsperado = '0';
  else if (resto === 10) dvEsperado = 'K';
  else dvEsperado = String(resto);

  return dv === dvEsperado;
}

module.exports = { validarRut };
