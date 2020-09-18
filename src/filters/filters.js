import Vue from "vue";
//---------------------funciones-----------------------
function formatPrice(value) {
    let val = (value/1).toFixed(2).replace('.', ',')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
function formatName(value) {
    let val = value.split(' ')[0];
    return val
}

//-------------filtros--------------------------
Vue.filter('moneda', (val) => {
    return formatPrice(val)
})
Vue.filter('name', (val) => {
    return formatName(val)
})
