

let baseUrl ='https://tarmeezacademy.com/api/v1'
const user_info = document.getElementById('user_info')
let add_postBtn = document.getElementById('add_post')
let PostBtn = document.querySelector('.postBTN')


// *************************** infinite Scrolling page*****************
let currentPage =1;
let lastPage =1;
window.addEventListener('scroll',()=>{
    let endPage  = window.innerHeight + window.pageYOffset >= document.body.scrollHeight

    if(endPage && currentPage < lastPage){
        currentPage = currentPage +1;
        GetPosts(false ,currentPage)
    }
})


// *************************** Get all Posts ********************
function clickPost(id){
    location.href=`post_details.html?postId=${id}`
}

// ****************************** Login ************************
let loginBtn = document.querySelector('#login');

if(loginBtn){
    loginBtn.addEventListener('click',()=>{login()})
}
async function login(){
    loaderToggle(true)
    try{
        let username = document.querySelector('#username').value;
        let password = document.querySelector('#password').value

        const response = await axios.post(`${baseUrl}/login`,
            {
                "username" : username,
                "password" : password
            }
        );
        console.log(response)
        
        let token = response.data.token;
        localStorage.setItem('token',token)
        localStorage.setItem('user',JSON.stringify(response.data.user))
        let model = document.getElementById('login_model');
        let model_Instance = bootstrap.Modal.getInstance(model)
        model_Instance.hide()
        
        SetupUi()
        showLoginSuccess('You are login success','success')
    }catch(error){
        showLoginSuccess(error.response.data.message,'danger')
        console.log(error)
    }finally{
        loaderToggle(false)
    }
}

// ************************* Register **************************
const registerBtn = document.getElementById('registerBtn')
const register = document.getElementById('register')


register.addEventListener('click',()=>{
    registerUser()})
async function registerUser(){
    loaderToggle(true)
        const usernameR = document.querySelector('#usernameR').value
        const passwordR = document.querySelector('#passwordR').value
        const names = document.querySelector('#name').value
        const email = document.querySelector('#email').value
        const imgFile = document.querySelector('#image').files[0]

        console.log(usernameR, passwordR , names  , email  ,imgFile)
    try{
        var bodyFormData = new FormData();
        bodyFormData.append('username', usernameR);
        bodyFormData.append('password', passwordR);
        bodyFormData.append('name', names);
        // bodyFormData.append('email', email);
        bodyFormData.append('image',imgFile);
        let response = await axios({
            method: "post",
            url: `${baseUrl}/register`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
        localStorage.setItem('token',response.data.token)
        localStorage.setItem('user',JSON.stringify(response.data.user))
        // loaderToggle(false)
        let model = document.getElementById('register_model');
        let model_Instance = bootstrap.Modal.getInstance(model)
        model_Instance.hide()
    
        SetupUi()
        showLoginSuccess('You are registred success','success')
    
        
        console.log(response)
    }catch(error){
        showLoginSuccess(error.response.data.message,'danger')
        console.log(error)
    }finally{
        loaderToggle(false)
    }
}

// ------------------ Function Show Message --------------------
function showLoginSuccess(msg, type){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    alertPlaceholder.style.display='block'
    alertPlaceholder.innerHTML=''
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}
    appendAlert(msg, type)
    
    // **************** first method to hide ***********
    setTimeout(()=>{
        alertPlaceholder.style.display='none'
    },2000)

    // ************ second method to hide **************
    // const alertHide = bootstrap.Alert.getOrCreateInstance('#liveAlertPlaceholder')
    // alertHide.close()
}

const LoginBtn = document.getElementById('loginBtn')
const OutBtn = document.getElementById('logOutBtn')

function SetupUi(){
    let token = localStorage.getItem('token')
    let user  = JSON.parse(localStorage.getItem('user'))
    if(user){
        user_info.innerHTML=`
        <img class='rounded-circle mx-2 border border-3' src='${user.profile_image}' style='width:50px;height:50px'>
        <b>${user.username}</b> 
        `
    }

    if(token==null){
        LoginBtn.style.display='block'
        registerBtn.style.display='block'
        OutBtn.style.display='none'
        PostBtn.style.display='none'
        user_info.style.display='none'
        user_info.innerHTML=``;
    }else{
        LoginBtn.style.display='none'
        registerBtn.style.display='none'
        OutBtn.style.display='block'
        PostBtn.style.display='block'
        user_info.style.display='block'
        
    }
}

// *********************** Log Out ********************
OutBtn.addEventListener('click',()=>{
    logout()
    SetupUi()
})
function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    showLoginSuccess('You are log Out successful','danger')
}

// ************************** Add New Post **********************
add_postBtn.addEventListener('click',addNewPost)
async function addNewPost(){
    try {
    let postId = document.getElementById('post-id-input').value;
    let isCreate = postId==null || postId==''

    let title_Post = document.getElementById('title').value
    let body_post = document.getElementById('body').value
    let image_post = document.getElementById('image_post').files[0]

        var bodyFormData = new FormData();
        bodyFormData.append('title', title_Post);
        bodyFormData.append('body', body_post);
        bodyFormData.append('image',image_post);
        let token  =localStorage.getItem('token');
        let url=''
        if(isCreate){
            url =`${baseUrl}/posts`
            showLoginSuccess('create new post seccessfuly','success')

        }else{
            bodyFormData.append('_method','put')
            url= `${baseUrl}/posts/${postId}`
            showLoginSuccess('Post has been edit','success')
        }
        loaderToggle(true)
        let response = await axios({
            method: "post",
            url: url,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data",
            "Authorization" :`Bearer ${token}`     },
        })
        console.log(response)
        // loaderToggle(false)
        let model = document.getElementById('post_model');
        let model_Instance = bootstrap.Modal.getInstance(model)
        model_Instance.hide()

        GetPosts()
    } catch (error) {
        console.log(error)
        showLoginSuccess(error.response.data.message,'danger')
    }finally{
        loaderToggle(false)
    }
}


function loaderToggle(show=true){
    if(show){
        document.getElementById('loader').style.visibility='visible'
    }else{
        document.getElementById('loader').style.visibility='hidden'
    }
    }
