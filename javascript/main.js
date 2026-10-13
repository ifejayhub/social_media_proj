const POST_LIKED_CLASS_NAME = "liked"
const POST_NOT_LIKED_CLASS_NAME = "not-liked"
const POST_SAVED_CLASS_NAME = "saved"
const POST_NOT_SAVED_CLASS_NAME = "not-saved"

let postsData = []



async function handleLogin(event){
    event.preventDefault();

    let usernameInput = document.getElementById("username");
    let passwordInput = document.getElementById("password");

    let loginResult = await loginUser({ username: usernameInput.value, password: passwordInput.value})

    storeAccessToken(loginResult.data.accessToken)
    //redirect to all_posts

    window.location.href = "index.html"
}

async function handleRegistration(event){
    event.preventDefault();

    let usernameInput = document.getElementById("username");
    let passwordInput = document.getElementById("password");
    let emailAddressInput = document.getElementById("email-address")

    await registerUser({
        username: usernameInput.value,
        password: passwordInput.value,
        email: emailAddressInput.value
    })

    showNotification("notification", "Registration Successful. Redirecting...", ALERT_SUCCESS_TYPE)
    setTimeout(()=> {
        window.location.href = "login.html"
    }, 1500)

}

function createPostComponent(postContainer, post, showViewMore){
    
    let contentElement = document.createElement("p");
    let buttonArea = document.createElement("div");
    let infoArea = document.createElement("div");
    let commentInfoElement = document.createElement("span");
    let authorInfoElement = document.createElement("div");

    buttonArea.className = "button-area";

    let likeElement = createLikeComponent(post);
    let bookmarkElement = createBookmarkComponent(post);

    buttonArea.append(likeElement);
    buttonArea.append(bookmarkElement);

    commentInfoElement.innerHTML=`${post.comments} comments`
    commentInfoElement.className="comment-info"
    authorInfoElement.innerHTML=post?.author?.account?.username
    authorInfoElement.className="author-info"

    infoArea.append(authorInfoElement)
    infoArea.append(commentInfoElement)

    postContainer.id = post._id;

    contentElement.className = "post-content"
    contentElement.innerText = post.content;
    postContainer.append(contentElement);
    if(showViewMore){
        postContainer.append(createViewPostLink(post._id))
    }
    postContainer.append(infoArea);
    postContainer.append(buttonArea);
    

    return postContainer;
}

function createCommentComponent(commentContainer, comment){
    let contentElement = document.createElement("p");
    let authorElement = document.createElement("div");

    commentContainer.id = comment.id;

    contentElement.innerText = comment.content;
    authorElement.className="author-info"
    authorElement.innerText = comment?.author?.account?.username;

    commentContainer.append(contentElement);
    commentContainer.append(authorElement);
    
    return commentContainer;
}

function createLikeComponent(post) {
    let likeContainer = document.createElement("div")
    let likeButton = document.createElement("button");
    

    likeContainer.id = post.id;
    
    likeButton.innerHTML = post.isLiked ? "Unlike" : "Like"
    likeButton.onclick = async function(){

        if(post.isLiked){
            likeButton.classList.remove(POST_LIKED_CLASS_NAME);
            likeButton.classList.add(POST_NOT_LIKED_CLASS_NAME);
            likeButton.innerHTML= "Like"
        } else {
            likeButton.classList.remove(POST_NOT_LIKED_CLASS_NAME);
            likeButton.classList.add(POST_LIKED_CLASS_NAME);
            likeButton.innerHTML = "Unlike"
        }

        
        await togglePostLike(post._id, getAccessToken());
        post.isLiked = !post.isLiked;
    }

    return likeButton
}

function createBookmarkComponent(post) {
    
    let bookmarkButton = document.createElement("button");
    
    
    bookmarkButton.innerHTML = post.isBookmarked ? "Unsave" : "Save"
    bookmarkButton.onclick = async function(){

        if(post.isBookmarked){
            bookmarkButton.classList.remove(POST_SAVED_CLASS_NAME);
            bookmarkButton.classList.add(POST_NOT_SAVED_CLASS_NAME);
            bookmarkButton.innerHTML= "Save"
        } else {
            bookmarkButton.classList.remove(POST_NOT_SAVED_CLASS_NAME);
            bookmarkButton.classList.add(POST_SAVED_CLASS_NAME);
            bookmarkButton.innerHTML = "Unsave"
        }

        
        await togglePostBookmark(post._id, getAccessToken());
        post.isBookmarked = !post.isBookmarked;
    }

    return bookmarkButton
}


function refreshPostElement(postId){
    let postContainer = document.getElementById(postId)
    let post = postsData.find(post => post.id === postId)

    if(!post)
        throw new Error("Post not found. Cannot refresh")

    //clear postContainer
    postContainer.innerHTML = "";

    createPostComponent(postContainer, post)
}

function buildPostView(post, sectionId) {
    let postContainer = document.createElement("article");

    createPostComponent(postContainer, post, false);

    document.getElementById(sectionId)
    .append(postContainer)
}

function createViewPostLink(postId){
    let link = document.createElement("a");

    link.href = "./view_post.html?post="+postId;
    link.className = "view-post-link"
    link.innerHTML = "View Post...";

    return link;
}

function createLoadingIndicator(){
    let element = document.createElement("div");
    element.className = "loading-indicator"
   
    return element;

}

function toggleNav(event){
    let navList = document.getElementById("nav-list");

    let isHidden = navList.classList.contains("hidden");

    if(isHidden){
        navList.classList.remove("hidden")
    } else {
        navList.classList.add("hidden")
    }

}

