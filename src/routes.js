import LoginPage from "./views/auth/Login"
// import MainPage from "./components/administration/mainPage"
import RegisterPage from "./views/auth/Register"
import Logout from "./views/auth/Logout"


import WithoutAccess from "./views/error/withoutAccess"

// import About from "./views/administration/aboutUs/About"
// import Category from "./views/administration/category/category"
//--------------------------------------------------------------------
//---------------------------main page--------------------------------
import MainPage from "./views/main/mainPage/mainPage"
import Categories from "./views/main/categories/categories"
import Search from "./views/main/search/search"
import Carrito from "./views/main/cart/cart"
import Pedido from "./views/main/pedido/pedido"
import ProductDetail from "./views/main/productDetail/productDetail"
//--------------------------------------------------------------------------

//------------------------administracion---------------------------
import CategoryAdmin from "./views/administration/category/index"
import ProductAdmin from "./views/administration/product/index"
import ProductFormAdmin from "./views/administration/product/form"
//------------------------------------------------------------------
//------------------------module---------------------
import ModuleAdmin from "./views/administration/module/index"
import ModuleformAdmin from "./views/administration/module/form"
//----------------------------------------------------
//--------------------permission------------------------
import PermissionAdmin from "./views/administration/permission/index"
import PermisosPorModuloAdmin from "./views/administration/permission/permisosPorModulo"
import PermissionformAdmin from "./views/administration/permission/form"
//--------------------------------------------------------

//------------------------role---------------------
import RoleAdmin from "./views/administration/role/index"
import RoleformAdmin from "./views/administration/role/form"
//----------------------------------------------------

//------------------------role_permission---------------------
import RolePermissionAdmin from "./views/administration/role_permission/index"
import RolePermissionViewAdmin from "./views/administration/role_permission/view"
//----------------------------------------------------
//----------------------------pedido----------------------------------
import PedidoAdmin from "./views/administration/pedido/index"
import DetailPedidoAdmin from "./views/administration/pedido/detailPedido"


//---------------------------------------------------------------------
//------------------no existe----------------
import PageNotFound from "./views/error/pageNotFound"


const routes = [
  // //----------------------------------Registro y login-----------------------------------------
  {path: "/login", component : LoginPage, name:"login", props:true, meta:{visitor:true,public: true}},
  {path: "/register", component : RegisterPage, name:"register", meta:{visitor:true,public: true}},
  {path: "/logout", component : Logout, name:"logout", meta:{requiresAuth:true}},
  // //----------------------------------administracion-----------------------------------------
  {path: "/admin/withoutAccess", component:WithoutAccess, name:"withoutAccess", meta:{requiresAuth:true}},
  // //-----------------------------------Category-----------------------------------------
  {path: "/admin/category", component:CategoryAdmin, name:"mainCategory", meta:{requiresAuth:true}},
  // //-----------------------------------Product-----------------------------------------
  {path: "/admin/product", component:ProductAdmin, name:"mainProduct", meta:{requiresAuth:true}},
  {path: "/admin/product/create", component:ProductFormAdmin, name:"createProduct", meta:{requiresAuth:true}},
  {path: "/admin/product/:id/edit", component:ProductFormAdmin, name: "editProduct", meta: {requiresAuth:true, mode: "edit"}},
 

  //---------------------------------------module------------------------------------------
  {path: "/admin/module", component:ModuleAdmin, name:"mainModule",meta:{requiresAuth:true}},
  {path: "/admin/module/create", component:ModuleformAdmin, name:"createModule", meta:{requiresAuth:true}},
  {path: "/admin/module/:id/edit", component:ModuleformAdmin, name: "editModule", meta: {requiresAuth:true, mode: "edit"}},
  //-------------------------------------------------------------------------------------
  
   //---------------------------------------permission------------------------------------------
   {path: "/admin/modulepermission", component:PermissionAdmin, name:"mainPermission",meta:{requiresAuth:true}},
   {path: "/admin/modulepermission/:idmodule", component:PermisosPorModuloAdmin, name:"mainPermisosPorModulo",meta:{requiresAuth:true}},
   {path: "/admin/permission/create/:idmodule", component:PermissionformAdmin, name:"createPermission", meta:{requiresAuth:true}},
   {path: "/admin/permission/:idpermission/edit/:idmodule", component:PermissionformAdmin, name: "editPermission", meta: {requiresAuth:true, mode: "edit"}},
   //-------------------------------------------------------------------------------------
   
  //---------------------------------------Role------------------------------------------
  {path: "/admin/role", component:RoleAdmin, name:"mainRole",meta:{requiresAuth:true}},
  {path: "/admin/role/create", component:RoleformAdmin, name:"createRole", meta:{requiresAuth:true}},
  {path: "/admin/role/:id/edit", component:RoleformAdmin, name: "editRole", meta: {requiresAuth:true, mode: "edit"}},
  //-------------------------------------------------------------------------------------
   
  //---------------------------------------Role_permission------------------------------------------
   {path: "/admin/rolepermission", component:RolePermissionAdmin, name:"mainRolePermission",meta:{requiresAuth:true}},
   {path: "/admin/rolepermission/:idrol", component:RolePermissionViewAdmin, name:"mainVerRolePermission", meta:{requiresAuth:true}},
   //-------------------------------------------------------------------------------------
   {path: "/admin/pedido", component:PedidoAdmin, name:"mainPedido",meta:{requiresAuth:true},
      props: (route) => ({ query:[ route.query.page] })},
   {path: "/admin/detailPedido/:idPedido", component:DetailPedidoAdmin, name:"detailPedido",meta:{requiresAuth:true}},


   
   
   { path: "/admin*", component: PageNotFound },
  // //-----------------------------------Attribute-----------------------------------------
  // {path: "/mainpage", component:MainPage, name: "mainPage"},
  // {path: "/about", component:About, name: "about", meta: {
  //   public: true,
  // },},
  // {path: "/category", component:Category, name: "category"},
  //-------------------------------------------------------------------------------------
  //-----------------------------------Main Page-----------------------------------------
  {path: "/", component:MainPage, name:"mainPage", meta:{public: true}},
  //---------------------------------------------------------------------------------------
  //-----------------------------------Category-----------------------------------------
  {path: "/categories/", component:Categories, name:"categories", meta:{public: true}},
  //---------------------------------------------------------------------------------------
  // --------------------------------------search------------------------------------------
  {path: "/search", component:Search, name:"search", meta:{public: true},
  props: (route) => ({ query:[route.query.id , route.query.page , route.query.q] })},
  //--------------------------------------------------------------------------------------------
   // //-----------------------------------product Detail-----------------------------------------
   {path: "/productDetail/:id", component:ProductDetail, name:"productDetail",meta:{public: true}},
  //----------------------------------------------------------------------------
  //----------------------------------------cart-----------------------------------------
  {path: "/carrito/", component:Carrito, name:"carrito", meta:{public: true}},
  //------------------------------------------------------------------------------------
  //--------------------------------------pedido----------------------------------------
  {path: "/pedido", component:Pedido, name:"pedido", meta:{public: true},
    props: (route) => ({ query:[ route.query.page] })},
  //-------------------------------pagina no encontrada-------------------------------------
  { path: "/*", component: PageNotFound ,meta:{public: true}},
  //---------------------------------------------------------------------------------------
]
export default routes;
