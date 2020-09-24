const Menu =  [
  {
    title: 'Seguridad',
    group: 'inventario',
    icon: 'security',
    
    items:[
      { title: 'Modulo',
        to:{name:'mainModule'},
      },
      { title: 'Permiso',
        to:{name:'mainPermission'},
      },
      { title: 'Rol',
      to:{name:'mainRole'},
      },
      { title: 'Acceso',
      to:{name:'mainRolePermission'},
      }
    ],
    // active: true,
    // target: '_blank',
    name: 'Seguridad',
  },
  {
    title: 'Categoria',
    group: 'inventario',
    icon: 'dashboard',
    name: 'Categoria',
    to:{name:'mainCategory'}
  },
  {
    title: 'Producto',
    group: 'inventario',
    icon: 'description',
    // target: '_blank',
    name: 'Producto',
    to:{name:'mainProduct'}
  },
  {
    title: 'Pedido',
    group: 'pedido',
    icon: 'list_alt',
    // target: '_blank',
    name: 'pedido',
    to:{name:'mainPedido'}
  },
  {
    title: 'Cerrar Sesion',
    group: 'logout',
    icon: 'exit_to_app',
    name: 'logout',
    to:{name:'logout'}
  },
  
  
];
// reorder menu
Menu.forEach((item) => {
  if (item.items) {
    item.items.sort((x, y) => {
      let textA = x.title.toUpperCase();
      let textB = y.title.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }
});

export default Menu;
