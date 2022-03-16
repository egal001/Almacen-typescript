interface Almacen {
  nombre: string,
  detalles: DetalleAlmacen[]
}

interface DetalleAlmacen{
  producto: string,
  cantidad: number
}

const alm01: Almacen = {
  nombre: "Almacen 01",
  detalles: []
}

alm01.detalles.push({
  producto: "Galleta ",
  cantidad: 21
});
alm01.detalles.push({
  producto: "Chocolate",
  cantidad: 10
});


let cantidadGalleta: number;
cantidadGalleta = 0;
cantidadGalleta = alm01.detalles[1].cantidad;

console.log(cantidadGalleta);
