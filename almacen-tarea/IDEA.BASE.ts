const userAccount = {
    name: "Kieron",
    id: 0,
  };

const Producto = {
    type: "Objeto",
  };
  
  interface Producto{
    id: number;
    nombre: string;
    cantidad: string;
    saldo: string;
  }
  
  const purchaseOrder = {
    owner: userAccount,
    item: Producto,
  };


const gabriel: Producto = {
  id: 1,
  nombre: 'Gabriel',
  cantidad: 'Ferreiro',
  saldo: "12",
};

function acceptPickProducto(person: Pick<Producto, 'nombre' | 'cantidad'>) {
    console.log(person.nombre);
}

  acceptPickProducto({
    nombre: gabriel.nombre,
    cantidad: gabriel.cantidad
  });