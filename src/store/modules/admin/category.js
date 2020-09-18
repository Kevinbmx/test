import * as firebase from 'firebase'
import {categoryUrl,addParent,imagenNoDisponibleUrl} from '../../../packages/config'

const state = {
  categories :[],
  checkedCategories:[],
  firstParentId:'',
  isCorrect : true,
  image:{
    file:'',
    categoryId:'',
    uuid:'',
    path:'',
    pathName:'',
    oldPathName:'',
    state:'new'
  },
  userFirebase:'kevi3195@gmail.com',
  passFirebase:'secret!123'
}

const getters={
  getCategory(state) {
    return state.categories
  },

  getsize(){
    return state.checkedCategories.length
  },
  esCorrecto(){
    return state.isCorrect
  },
  getImage: state => {
    return state.image
  }
}

const mutations = {
  retrieveCategory(state, allCategory) {
    state.categories = allCategory
  },

  checkedCategory(state,idCategory){
    state.checkedCategories.push(idCategory)
    state.firstParentId = idCategory.parent_id
  },

  unCheckedCategory(state, idCategory){
    const index = state.checkedCategories.findIndex(item =>  item.id == idCategory)
    // console.log('index: ', index)
    if(index >= 0){
      state.checkedCategories.splice(index, 1)
    }
    if(state.checkedCategories.length==0){
      state.firstParentId = ''
    }
  },

  addCategorySubmit(state, Categories){
    state.categories = Categories
  },

  addParentSubmit(state, Categories){
    state.categories = Categories
    state.checkedCategories = []
    state.firstParentId = ''
  },

  addChildrenSubmit(state, Categories){
    state.categories = Categories
    state.checkedCategories = []
    state.firstParentId = ''
  },

  deleteCategorySubmit(state, Categories){
    // const index = state.categories.findIndex(item => item.id == idCategory)
    // if(index >= 0){
    //   state.categories.splice(index, 1)
    //   state.checkedCategories=[]
    // }
    state.categories = Categories
    state.checkedCategories = []
    state.firstParentId = ''
  },
  getImageCategory(state,objCharacteristic){
    state.image = objCharacteristic
  },
  stateOdCorrect(state){
    state.isCorrect = !state.isCorrect
  },
  putImageCategory(state,response){
    if(state.image.state == 'old'){
      state.image.oldPathName = state.image.pathName
      state.image.state = 'update'
    }
    state.image.file = response.file
    state.image.path = response.path
    state.image.pathName = ''
    state.image.uuid = response.uuid
  },
  uploadImageFirebase(state,objImageForFirebase){
    state.image.path = objImageForFirebase.urlFirebase
    state.image.pathName = objImageForFirebase.name
  }
}

const actions = {
  retrieveCategory (context){
    return new Promise((resolve, reject) => {
      this.$myApi.get(categoryUrl)
      .then(response => {
        // console.log(response.data)
        resolve(response.data.hasPermission)
        context.commit('retrieveCategory', response.data.CategoryTree)
      })
      .catch(error => {
      // console.log(error)
        reject(error)
      })
    })
  },

  checkedCategory(context,id){
    return new Promise((resolve, reject) => {
      this.$myApi.get(categoryUrl +'/'+id)
      .then(response=>{
        if (state.checkedCategories.length <1){
          context.commit('checkedCategory', response.data)
        }
        else{
          if(state.firstParentId === response.data.parent_id){
            context.commit('checkedCategory', response.data)
            resolve(response)
          }else{
            resolve(false)
          }
        }
      })
      .catch(error =>{
      // console.log(error)
        reject(error)
      })
    })
    // context.commit('checkedCategory', id)
  },

  verifyCheckCategory(){

  },

  unCheckedCategory(context, id) {
    context.commit('unCheckedCategory', id)
  },

  addCategorySubmit(context,data){
    this.$myApi.post(categoryUrl, {
      name: data.name,
      parent_id: data.parent_id,
      path:imagenNoDisponibleUrl
    })
    .then(response => {
      context.commit('addCategorySubmit', response.data.CategoryTree)
    })
    .catch(error => {
    // console.log(error)
    })
  },

  addParentSubmit(context, data){
    const checkedCategories = context.state.checkedCategories
    const parent_id = state.firstParentId
    // console.log(checkedCategories)
    this.$myApi.post(addParent,
    {
        checkedCategories: checkedCategories,
        name: data.name,
        parent_id:parent_id,
        path:imagenNoDisponibleUrl
    })
      .then(response => {
        // console.log(response)
        context.commit('addParentSubmit',response.data.CategoryTree)
      })
      .catch(error => {
      // console.log(error)
      })
  },

  addChildrenSubmit(context, data){
    const checkedCategories = context.state.checkedCategories
    // console.log(checkedCategories)
    this.$myApi.post(categoryUrl,
    {
        name: data.name,
        parent_id:checkedCategories[0].id,
        path:imagenNoDisponibleUrl
    })
      .then(response => {
        // console.log(response)
        context.commit('addChildrenSubmit',response.data.CategoryTree)
      })
      .catch(error => {
      // console.log(error)
      })
  },

  deleteCategorySubmit(context){
    const checkedCategories = context.state.checkedCategories
    this.$myApi.delete(categoryUrl +'/'+ checkedCategories[0].id)
      .then(response => {
        context.commit('deleteCategorySubmit', response.data.CategoryTree)
      })
      .catch(error => {
      // console.log(error)
      })
  },
  getImageCategory(context){
    const checkedCategories = context.state.checkedCategories
    this.$myApi.get(categoryUrl+'/'+checkedCategories[0].id)
    .then(response =>{
      var element = response.data
      var path =element.path
      var pathName = element.pathName
      var estado = 'old'
      if(path==null && pathName==null){
        path = ''
        pathName=''
        estado = 'new'
      }
      let obj ={
        categoryId:element.id,
        uuid:'',
        path:path,
        oldPathName:'',
        pathName:pathName,
        state:estado
      }
    // console.log(response.data)
      context.commit('getImageCategory',obj)
    })
    .catch(error => {
    // console.log(error)
    })
  },
  putImageCategory(context,object){
    context.commit('putImageCategory',object)  
  },
  createImageCategory(context){
    if(state.image.state=='new' || state.image.state=='update'){
      if(state.image.state=='update'){
        firebase.auth().signInWithEmailAndPassword(state.userFirebase,state.passFirebase)
      .then(user => {
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var desertRef = storageRef.child('/category/'+state.image.oldPathName);
        desertRef.delete().then(function() {
          // console.log('se elimino correctamente de firebase su imagen')
        }).catch(function(error) {
        // Uh-oh, an error occurred!
        });
      })
    }
      context.dispatch('uploadImageCategoryFirebase').then((response) => {
        if(response){
          
          this.$myApi.post(categoryUrl +'/'+state.image.categoryId,{
            name: state.image.name,
            path:state.image.path,
            pathName:state.image.pathName
          }).then(response=>{
          // console.log('inserto la imagen de la categoria')
            // context.commit('createImageCategory')
          })
        }
      })
    }else {
      return  
    }

  },
  uploadImageCategoryFirebase(context){
    return new Promise((resolve, reject) => {
            const element = state.image;
            const uuid = element.uuid ;
            // console.log('element', element)
            // console.log('uuid', uuid)
            // console.log(state.files[index])

            firebase.auth().signInWithEmailAndPassword(state.userFirebase,state.passFirebase)
            .then(user => {
            var storageRef =  firebase.storage().ref();
                var metadata = {
                contentType: element.file[0].type
                }
                const filename = element.file[0].name
                const ext = filename.slice(filename.lastIndexOf('.'))
                var uploadTask = storageRef.child('category/' + uuid + ext).put(element.file[0], metadata);

                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
                function(snapshot) {
                    var progress =  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  // console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: 
                      // console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: 
                      // console.log('Upload is running');
                        break;
                    }
                }, function(error) {
                switch (error.code) {
                    case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;

                    case 'storage/canceled':
                    // User canceled the upload
                    break;

                    case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
                }, function complete () {
                // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        let objectFile={
                            name: uuid + ext,
                            urlFirebase:downloadURL
                        }
                        // //   console.log('tama;o Imagen', state.maxUploadImage-1)
                        
                        context.commit('uploadImageFirebase',objectFile)
                      // console.log('File available at', downloadURL);
                        resolve(true)
                    });
                })
            })
    })
  },
}


export default{
  state, getters, mutations, actions
}
