let currentPageIndex = 0;

document.addEventListener("DOMContentLoaded", loadNextPosts);

async function loadNextPosts() {
  let mainElement = document.getElementById("main-element");
  let loadingIndicator = createLoadingIndicator();

  //show loading indicator
  mainElement.append(loadingIndicator);

  let newPostsData = await getAllPosts({ page: currentPageIndex + 1, limit: 10 }, getAccessToken());
  //Update the current page index and hide the loading indicator
  currentPageIndex++;
  loadingIndicator.remove();

  postsData = [...postsData, ...newPostsData.bookmarkedPosts];

  for (let post of newPostsData.bookmarkedPosts) {
    let articleElement = document.createElement("article");
    let liElement = document.createElement("li");

    //wrap the article in li to statisfy accessibility requirement

    liElement.append(articleElement);
    createPostComponent(articleElement, post, true);

    document.getElementById("posts-section").append(liElement);
  }

  let morePostsButton = document.getElementById("more-posts-button");
  if (!newPostsData.hasNextPage) {
    morePostsButton.classList.add("hidden");
  } else {
    morePostsButton.classList.remove("hidden");
  }
}
