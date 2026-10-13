function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

let activePostId = getQueryParam("post");

if(!activePostId){
    throw Error("No post to show")
} else {
    document.addEventListener("DOMContentLoaded", async ()=>{
        let postSection = document.getElementById("post-section");
        postSection.append(createLoadingIndicator())

        let post = await getPostById(activePostId);
        
        postSection.innerHTML=""
        buildPostView(post, "post-section");

        let commentSection = document.getElementById("comment-section");
        commentSection.append(createLoadingIndicator())

        let commentData = await getCommentsByPostId(activePostId);

        commentSection.innerHTML="";

        for(let comment of commentData.comments){
            let liContainer = document.createElement("li")
            let commentContainer = document.createElement("article");
            createCommentComponent(commentContainer, comment)

            liContainer.append(commentContainer);
            commentSection.append(liContainer)
        }
    }
)
    
}

async function handleCommentAddition(event){
    event.preventDefault();

    let formData = new FormData(event.currentTarget);

    let commentContent = formData.get("content");

    await createComment(activePostId, {content:commentContent}, getAccessToken())
    window.location.reload();
}