
SetupUi()

let C_user = JSON.parse(localStorage.getItem('user'));
let namee = document.getElementById('user_name')
let username = document.getElementById('user_username')
let email = document.getElementById('user_email')
let couments_count= document.getElementById('couments_count')
let posts_count = document.getElementById('posts_count')
let image_profile= document.getElementById('user_image_profile')

function UserInfo(user){

    namee.innerHTML=user.name
    username.innerHTML=user.username
    email.innerHTML=user.email
    couments_count.innerHTML=user.comments_count
    posts_count.innerHTML=user.posts_count
    image_profile.src=user.profile_image
}

UserInfo(C_user)
GetUserPosts(C_user.id)

async function GetUserPosts(id)
{
    try {
        let response = await axios.get(`${baseUrl}/users/${id}/posts`)
        console.log(response)

        let posts = response.data.data
        document.getElementById('posts').innerHTML=''
        posts.forEach(post => {
            let {id, title, image,body,comments_count,created_at,author, tags} = post;

            let postEl  = document.createElement('div')
            postEl.className='card shadow mt-5'
            postEl.id=id;
            
            let userId='';
        if(localStorage.getItem('user')){
            let user = JSON.parse(localStorage.getItem('user'))
                userId = user.id;
        }

            postEl.innerHTML=`
            <div class="card-header d-flex justify-content-between">
                <div onclick='sendUserProfile(${author.id})'>
                <img class="rounded-circle border border-3" style="width: 40px; height: 40px;" src="${author.profile_image}" alt="persone">
                <b>${author.username}</b>
                </div>
                <div>
                ${author.id==userId ?` <button class='btn btn-sm btn-danger' style='float:right;margin-left:5px' data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="deletePostClick(${id})">delete</button>`:``}
                ${author.id==userId ?` <button class='btn btn-sm btn-secondary' style='float:right' onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">edit</button>`:``}
                </div>
            </div>
            <div class="card-body" style='cursor:pointer' onclick='clickPost(${id})'>
                <img class="rounded-1 w-100 " src="${image}" alt="" style="height: 300px; object-fit: cover;" >

                <h6 class="mt-2" style="color: grey;">${created_at}</h6>
                <h5>${title}</h5>
                <p>${body}</p>
                <hr>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg>
                <span>(${comments_count}) comments
                <span> ${tags.map((tag)=>{
                    return ` <button class='tag' style='background:gray, color:white'>${tag.name}</button>`
                })}</span>
                </span>
            </div>`;
            
        document.getElementById('posts').appendChild(postEl)
        });
        
    } catch (error) {
        console.log(error)
        
    }
}

// ***************************** Edit Post *************************
function editPost(postO){
    document.getElementById('add_post').innerHTML='Update'
    let post = JSON.parse(decodeURIComponent(postO))
    console.log(post)
    let {id,image,body,title}=post;
    console.log(id,image,body,title)
    document.getElementById('post-id-input').value = post.id
    document.getElementById('post_title').innerHTML='Edit Post'
    document.getElementById('title').value=title
    document.getElementById('body').value=body
    document.getElementById('image_post').files[0]=image
    let model = new bootstrap.Modal(document.getElementById('post_model'))
    model.toggle()
    
    }
    
    // ****************************** delete Post **********************
    function deletePostClick(id){
    console.log(id)
    document.querySelector('#postId').setAttribute('postId',id);
    
    }
    document.querySelector('#DeletePost').addEventListener('click',()=>{
    let id = document.querySelector('#postId').getAttribute('postId');
    console.log(id)
    deletePost(id)
    })
    async function deletePost(id){
    try {
        let token = localStorage.getItem('token')
        let response = await axios.delete(`${baseUrl}/posts/${id}`,
        {
            headers:{"Authorization" :`Bearer ${token}`}
        })
    
        console.log(response)
        let model = document.getElementById('deleteModal');
        let model_Instance = bootstrap.Modal.getInstance(model)
        model_Instance.hide()
    
        showLoginSuccess('post deleted seccessfuly','success')
        GetPosts()
    } catch (error) {
        console.log(error)
        showLoginSuccess(error.response.data.message,'success')
    }
    
    }
    // ******************************* add post ************************
    function addPost(){
    document.getElementById('add_post').innerHTML='Create'
    document.getElementById('post-id-input').value = ""
    document.getElementById('post_title').innerHTML='Create New Post'
    document.getElementById('title').value=""
    document.getElementById('body').value=""
    document.getElementById('image_post').files[0]=""
    let model = new bootstrap.Modal(document.getElementById('post_model'))
    model.toggle()
    
    }
    
    
    function sendUserProfile(id){
        console.log(id)
        console.log('hello pro')
        location.href=`profile.html?postId=${id}`
    }