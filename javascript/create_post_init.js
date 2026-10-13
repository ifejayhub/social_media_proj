async function handlePostCreation(event){
    event.preventDefault();

    let formData = new FormData(event.currentTarget);

    let post = await createPost(formData, getAccessToken());
    window.location.href="./view_post.html?post=" + post._id;
}