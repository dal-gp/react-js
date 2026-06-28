import { createContext, useState, useContext } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

/**
 * Private context object - not exported.
 * External code uses the usePosts() hook instead.
 */
const PostContext = createContext();

/**
 * Provider component for all post-related state.
 * Wrap any part of the tree that needs post data.
 * MUST render children - otherwise wrapped components disappear.
 *
 * @param {React.ReactNode} children - components that need post data
 */
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost()),
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery: searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

/**
 * Custom hook to consume PostContext.
 * Throws a descriptive error if used outside PostProvider
 * - much better than silentlyreturning undefined.
 *
 *  @returns { {posts, onAddPost, onClearPosts, searchQuery, setSearchQuery} }
 */
function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("PostContext was used outside of the PostProvider");
  return context;
}

export { PostProvider, usePosts };
