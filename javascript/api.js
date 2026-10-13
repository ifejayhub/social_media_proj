const BASE_URL = "https://api.freeapi.app/api/v1";
const TOKEN_KEY_NAME = "accessToken";

async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      showNotification("notification", `Registration failed. ${(await response.json())?.message}`, ALERT_ERROR_TYPE);
      throw new Error(`Registration failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error;
  }
}

async function loginUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      showNotification("notification", `Login failed. ${(await response.json())?.message}`, ALERT_ERROR_TYPE);
      throw new Error(`Login failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
  }
}

async function createPost(postData, token) {
  try {
    const response = await fetch(`${BASE_URL}/social-media/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: postData,
    });

    if (!response.ok) {
      redirectToLoginIfUnauthorized(response);
      showNotification("notification", `Failed to create post. ${(await response.json())?.message}`, ALERT_ERROR_TYPE);
      throw new Error(`Failed to create post: ${response.statusText}`);
    }

    return (await response.json()).data;
  } catch (error) {
    console.error("Error in createPost:", error);
    throw error;
  }
}

async function createComment(postId, commentData, token) {
  try {
    const response = await fetch(`${BASE_URL}/social-media/comments/post/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      redirectToLoginIfUnauthorized(response);
      showNotification("notification", `Failed to create comment. ${(await response.json())?.message}`, ALERT_ERROR_TYPE);
      throw new Error(`Failed to create comment: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createComment:", error);
    throw error;
  }
}

async function togglePostLike(postId, token) {
  try {
    const response = await fetch(`${BASE_URL}/social-media/like/post/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      redirectToLoginIfUnauthorized(response);
      showNotification("notification", `Failed to like post. ${(await response.json())?.message}`, ALERT_ERROR_TYPE);
      throw new Error(`Failed to toggle like: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in togglePostLike:", error);
    throw error;
  }
}

async function togglePostBookmark(postId, token) {
  try {
    const response = await fetch(`${BASE_URL}/social-media/bookmarks/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      redirectToLoginIfUnauthorized(response);
      showNotification("notification", `Failed to bookmark post. ${(await response.json())?.message}`, ALERT_ERROR_TYPE);
      throw new Error(`Failed to toggle bookmark: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in togglePostBookmark:", error);
    throw error;
  }
}

async function getPostById(postId, token) {
  try {
    const response = await fetch(`${BASE_URL}/social-media/posts/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      redirectToLoginIfUnauthorized(response);
      showNotification("notification", `Failed to fetch post. ${(await response.json())?.message}`, ALERT_ERROR_TYPE);
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    return (await response.json()).data;
  } catch (error) {
    console.error("Error in getPostById:", error);
    throw error;
  }
}

async function getCommentsByPostId(postId, token) {
  try {
    const response = await fetch(`${BASE_URL}/social-media/comments/post/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      redirectToLoginIfUnauthorized(response);
      showNotification("notification", `Failed to fetch comments. ${(await response.json())?.message}`, ALERT_ERROR_TYPE);
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }

    return (await response.json()).data;
  } catch (error) {
    console.error("Error in getCommentsByPostId:", error);
    throw error;
  }
}

async function getAllPosts(queryParams = {}, token) {
  try {
    const url = `${BASE_URL}/social-media/posts?page=${queryParams.page}&limit=${queryParams.limit}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      redirectToLoginIfUnauthorized(response);
      showNotification("notification", `Failed to get all posts. ${(await response.json())?.message}`, ALERT_ERROR_TYPE);
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return (await response.json()).data;
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    throw error;
  }
}

async function getBookmarkedPosts(queryParams = {}, token) {
  try {
    const url = `${BASE_URL}/social-media/bookmarks?page=${queryParams.page}&limit=${queryParams.limit}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      redirectToLoginIfUnauthorized(response);
      showNotification("notification", `Failed to get all posts. ${(await response.json())?.message}`, ALERT_ERROR_TYPE);
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return (await response.json()).data;
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    throw error;
  }
}

function getAccessToken() {
  let accessToken = localStorage.getItem(TOKEN_KEY_NAME);
  if (!accessToken) {
    window.location.href = "login.html";
    return;
  }

  return accessToken;
}

function storeAccessToken(token) {
  localStorage.setItem(TOKEN_KEY_NAME, token);
}

function redirectToLoginIfUnauthorized(response) {
  if (response.status === 401) {
    window.location.href = "login.html";
  }
}
