// import React, { useState } from "react";
// import { Dropdown, Button } from "flowbite-react";
// import {
//   ChevronDownIcon,
//   MagnifyingGlassIcon,
// } from "@heroicons/react/20/solid";

// const categories = [
//   "All categories",
//   "Slides",
//   "Lectures",
//   "Quizzes",
//   "Users",
// ];

// const CategorySearch = () => {
//   const [selectedCategory, setSelectedCategory] = useState(categories[0]);
//   const [query, setQuery] = useState("");

//   return (
//     <div className="flex w-full max-w-xl">
//       <Dropdown
//         label={selectedCategory}
//         color="gray"
//         size="md"
//         className="rounded-l-lg m-0"
//         renderTrigger={() => (
//           <Button
//             color="light"
//             className="flex items-center justify-center w-40 border-transparent rounded-tl-md rounded-bl-md rounded-r-none whitespace-nowrap gap-2 bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
//           >
//             {selectedCategory}
//             <ChevronDownIcon
//               aria-hidden="true"
//               className="size-5 flex-none text-gray-400 ml-2"
//             />
//           </Button>
//         )}
//       >
//         {categories.map((category) => (
//           <Dropdown.Item
//             key={category}
//             onClick={() => setSelectedCategory(category)}
//           >
//             {category}
//           </Dropdown.Item>
//         ))}
//       </Dropdown>

//       <div className="relative w-full">
//         <input
//           type="search"
//           id="search-dropdown"
//           className="block p-2.5 w-full pr-11 z-20 text-sm text-gray-900 border-transparent rounded-e-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-200 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-indigo-500"
//           placeholder="Search Slides, Lectures, Quizzes..."
//           onChange={(e) => setQuery(e.target.value)}
//           required
//         />
//         <button
//           type="submit"
//           className="absolute top-0 end-0 w-10 p-2.5 text-sm font-medium h-full text-white bg-purple-600 rounded-e-lg border border-purple-500 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:border-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
//         >
//           <MagnifyingGlassIcon className="size-4" />
//           <span className="sr-only">Search</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CategorySearch;

// import React, { useState, useEffect } from "react";
// import { Dropdown, Button, Spinner } from "flowbite-react";
// import {
//   ChevronDownIcon,
//   MagnifyingGlassIcon,
// } from "@heroicons/react/20/solid";
// import helperService from "../../services/helperService";

// const categories = ["All categories", "Slides", "Lectures", "Quizzes", "Users"];
// interface SearchResults {
//   users?: {
//     _id: string;
//     fullName: string;
//     account: string;
//     avatarUrl?: string;
//   }[];
//   lectureVideos?: {
//     _id: string;
//     lectureName: string;
//     userId?: { fullName: string; avatarUrl: string };
//   }[];
//   quizzes?: {
//     _id: string;
//     quizName: string;
//     userId?: { fullName: string; avatarUrl: string };
//   }[];
//   slideContents?: { _id: string; name: string; numberOfSlides: number }[];
// }

// function CategorySearchBar() {
//   const [selectedCategory, setSelectedCategory] = useState(categories[0]);
//   const [query, setQuery] = useState("");

//   const [searchResults, setSearchResults] = useState<SearchResults | null>(
//     null
//   );
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!query.trim()) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const results = await helperService.searchByCategory(
//         selectedCategory,
//         query
//       );
//       setSearchResults(results);
//     } catch (error: any) {
//       setError(
//         error.message || "Failed to fetch search results. Please try again later."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Hiển thị kết quả search tùy thuộc vào category đã chọn
//   const renderSearchResults = () => {
//     if (!searchResults) return null;

//     if (selectedCategory === "All categories") {
//       return (
//         <div className="mt-4">
//           {(searchResults?.users?.length ?? 0) > 0 && (
//             <div className="mb-4">
//               <h3 className="text-lg font-medium mb-2">Users</h3>
//               <ul className="space-y-2">
//                 {searchResults?.users?.map((user) => (
//                   <li key={user._id} className="p-2 bg-gray-50 rounded-lg">
//                     <div className="flex items-center gap-2">
//                       {user.avatarUrl ? (
//                         <img
//                           src={user.avatarUrl}
//                           alt={user.fullName}
//                           className="w-8 h-8 rounded-full"
//                         />
//                       ) : (
//                         <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                           {user.fullName.charAt(0)}
//                         </div>
//                       )}
//                       <div>
//                         <p className="font-medium">{user.fullName}</p>
//                         <p className="text-sm text-gray-600">{user.account}</p>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {(searchResults?.lectureVideos?.length ?? 0) > 0 && (
//             <div className="mb-4">
//               <h3 className="text-lg font-medium mb-2">Lectures</h3>
//               <ul className="space-y-2">
//                 {searchResults?.lectureVideos?.map((lecture) => (
//                   <li key={lecture._id} className="p-2 bg-gray-50 rounded-lg">
//                     <p className="font-medium">{lecture.lectureName}</p>
//                     <p className="text-sm text-gray-600">
//                       By: {lecture.userId?.fullName || "Unknown"}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {(searchResults?.quizzes?.length ?? 0) > 0 && (
//             <div className="mb-4">
//               <h3 className="text-lg font-medium mb-2">Quizzes</h3>
//               <ul className="space-y-2">
//                 {searchResults?.quizzes?.map((quiz) => (
//                   <li key={quiz._id} className="p-2 bg-gray-50 rounded-lg">
//                     <p className="font-medium">{quiz.quizName}</p>
//                     <p className="text-sm text-gray-600">
//                       By: {quiz.userId?.fullName || "Unknown"}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {(searchResults?.slideContents?.length ?? 0) > 0 && (
//             <div className="mb-4">
//               <h3 className="text-lg font-medium mb-2">Slides</h3>
//               <ul className="space-y-2">
//                 {searchResults?.slideContents?.map((slide) => (
//                   <li key={slide._id} className="p-2 bg-gray-50 rounded-lg">
//                     <p className="font-medium">{slide.name}</p>
//                     <p className="text-sm text-gray-600">
//                       {slide.numberOfSlides} slides
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {!searchResults.users?.length &&
//             !searchResults.lectureVideos?.length &&
//             !searchResults.quizzes?.length &&
//             !searchResults.slideContents?.length && (
//               <p className="text-center text-gray-500">
//                 No results found.
//               </p>
//             )}
//         </div>
//       );
//     } else {
//       // Hiển thị kết quả cho từng category cụ thể
//       const results = Array.isArray(searchResults) ? searchResults : [];

//       return (
//         <div className="mt-4">
//           {results.length > 0 ? (
//             <ul className="space-y-2">
//               {results.map((item) => {
//                 let title, subtitle;

//                 if (selectedCategory === "Users") {
//                   title = item.fullName;
//                   subtitle = item.account;
//                 } else if (selectedCategory === "Lectures") {
//                   title = item.lectureName;
//                   subtitle = `By: ${item.userId?.fullName || "Unknown"}`;
//                 } else if (selectedCategory === "Quizzes") {
//                   title = item.quizName;
//                   subtitle = `By: ${item.userId?.fullName || "Unknown"}`;
//                 } else if (selectedCategory === "Slides") {
//                   title = item.name;
//                   subtitle = `${item.numberOfSlides} slides`;
//                 }

//                 return (
//                   <li key={item._id} className="p-2 bg-gray-50 rounded-lg">
//                     <p className="font-medium">{title}</p>
//                     <p className="text-sm text-gray-600">{subtitle}</p>
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <p className="text-center text-gray-500">
//               No results found.
//             </p>
//           )}
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="w-full max-w-xl">
//       <form onSubmit={handleSearch} className="flex">
//         <Dropdown
//           label={selectedCategory}
//           color="gray"
//           size="md"
//           className="rounded-l-lg m-0"
//           renderTrigger={() => (
//             <Button
//               color="light"
//               className="flex items-center justify-center w-40 border-transparent rounded-tl-md rounded-bl-md rounded-r-none whitespace-nowrap gap-2 bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
//             >
//               {selectedCategory}
//               <ChevronDownIcon
//                 aria-hidden="true"
//                 className="size-5 flex-none text-gray-400 ml-2"
//               />
//             </Button>
//           )}
//         >
//           {categories.map((category) => (
//             <Dropdown.Item
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//             >
//               {category}
//             </Dropdown.Item>
//           ))}
//         </Dropdown>

//         <div className="relative w-full">
//           <input
//             type="search"
//             id="search-dropdown"
//             className="block p-2.5 w-full pr-11 z-20 text-sm text-gray-900 border-transparent rounded-e-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-200 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-indigo-500"
//             placeholder="Search Slides, Lectures, Quizzes..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             required
//           />
//           <button
//             type="submit"
//             className="absolute top-0 end-0 w-10 p-2.5 text-sm font-medium h-full text-white bg-purple-600 rounded-e-lg border border-purple-500 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:border-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <Spinner size="sm" color="purple" />
//             ) : (
//               <MagnifyingGlassIcon className="size-4" />
//             )}
//             <span className="sr-only">Search</span>
//           </button>
//         </div>
//       </form>

//       {/* {error && <div className="mt-2 text-red-500 text-sm">{error}</div>} */}

//       {renderSearchResults()}
//     </div>
//   );
// };

// export default CategorySearchBar;

import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Button, Spinner, Avatar } from "flowbite-react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import helperService from "../../services/helperService";
import { useNavigate } from "react-router";

const categories = ["All categories", "Slides", "Lectures", "Quizzes", "Users"];
interface SearchResults {
  users?: {
    _id: string;
    fullName: string;
    account: string;
    avatarUrl?: string;
  }[];
  lectureVideos?: {
    _id: string;
    lectureName: string;
    userId?: { fullName: string; avatarUrl: string };
  }[];
  quizzes?: {
    _id: string;
    quizName: string;
    userId?: { fullName: string; avatarUrl: string };
  }[];
  slideContents?: { _id: string; name: string; numberOfSlides: number }[];
}

function CategorySearchBar() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        searchFormRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !searchFormRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await helperService.searchByCategory(
        selectedCategory,
        query
      );
      setSearchResults(results);
      setIsDropdownOpen(true);
    } catch (error: any) {
      setError(
        error.message ||
          "Failed to fetch search results. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchResults(null);
    setIsDropdownOpen(false);
  };

  const handleResultClick = (id: string, type: string) => {
    switch (type) {
      case "Users":
        navigate(`/user-profile/${id}`);
        break;
      case "Slides":
        navigate(`slide/generate-process/download/${id}`);
        break;
      case "Lectures":
        navigate(`/lecture/detail/${id}`);
        break;
      case "Quizzes":
        navigate(`/quiz/${id}`);
        break;
    }
    clearSearch();
  };

  // Render search results based on category
  const renderSearchResults = () => {
    if (!searchResults) return null;

    return (
      <div className="results-container max-h-96 overflow-y-auto p-4">
        {selectedCategory === "All categories" ? (
          <>
            {/* Users section */}
            {(searchResults?.users?.length ?? 0) > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 border-b pb-1 text-gray-900">
                  Users
                </h3>
                <ul className="space-y-2">
                  {searchResults?.users?.map((user) => (
                    <li
                      key={user._id}
                      className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleResultClick(user._id, "Users")}
                    >
                      <div className="flex items-center gap-2">
                        {/* {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            {user.fullName.charAt(0)}
                          </div>
                        )} */}
                        <Avatar img={user.avatarUrl} rounded/>
                        <div>
                          <p className="font-medium text-gray-800">{user.fullName}</p>
                          <p className="text-sm text-gray-600">
                            {user.account}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lectures section */}
            {(searchResults?.lectureVideos?.length ?? 0) > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 border-b pb-1 text-gray-900">
                  Lectures
                </h3>
                <ul className="space-y-2">
                  {searchResults?.lectureVideos?.map((lecture) => (
                    <li
                      key={lecture._id}
                      className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleResultClick(lecture._id, "Lectures")}
                    >
                      <p className="font-medium text-gray-800">{lecture.lectureName}</p>
                      <p className="text-sm text-gray-600">
                        By: {lecture.userId?.fullName || "Unknown"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quizzes section */}
            {(searchResults?.quizzes?.length ?? 0) > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 border-b pb-1 text-gray-900">
                  Quizzes
                </h3>
                <ul className="space-y-2">
                  {searchResults?.quizzes?.map((quiz) => (
                    <li
                      key={quiz._id}
                      className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleResultClick(quiz._id, "Quizzes")}
                    >
                      <p className="font-medium text-gray-800">{quiz.quizName}</p>
                      <p className="text-sm text-gray-600">
                        By: {quiz.userId?.fullName || "Unknown"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Slides section */}
            {(searchResults?.slideContents?.length ?? 0) > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 border-b pb-1 text-gray-900">
                  Slides
                </h3>
                <ul className="space-y-2">
                  {searchResults?.slideContents?.map((slide) => (
                    <li
                      key={slide._id}
                      className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleResultClick(slide._id, "Slides")}
                    >
                      <p className="font-medium text-gray-800">{slide.name}</p>
                      <p className="text-sm text-gray-600">
                        {slide.numberOfSlides} slides
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No results message */}
            {!searchResults.users?.length &&
              !searchResults.lectureVideos?.length &&
              !searchResults.quizzes?.length &&
              !searchResults.slideContents?.length && (
                <p className="text-center text-gray-500 py-4">
                  No results found.
                </p>
              )}
          </>
        ) : (
          // Specific category results
          <div>
            {Array.isArray(searchResults) && searchResults.length > 0 ? (
              <ul className="space-y-2">
                {searchResults.map((item) => {
                  let title, subtitle;

                  if (selectedCategory === "Users") {
                    title = item.fullName;
                    subtitle = item.account;
                  } else if (selectedCategory === "Lectures") {
                    title = item.lectureName;
                    subtitle = `By: ${item.userId?.fullName || "Unknown"}`;
                  } else if (selectedCategory === "Quizzes") {
                    title = item.quizName;
                    subtitle = `By: ${item.userId?.fullName || "Unknown"}`;
                  } else if (selectedCategory === "Slides") {
                    title = item.name;
                    subtitle = `${item.numberOfSlides} slides`;
                  }

                  return (
                    <li
                      key={item._id}
                      className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                      onClick={() =>
                        handleResultClick(item._id, selectedCategory)
                      }
                    >
                      <p className="font-medium">{title}</p>
                      <p className="text-sm text-gray-600">{subtitle}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No results found.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl relative">
      <form ref={searchFormRef} onSubmit={handleSearch} className="flex">
        <Dropdown
          label={selectedCategory}
          color="gray"
          size="md"
          className="rounded-l-lg m-0 z-50"
          renderTrigger={() => (
            <Button
              color="light"
              className="flex items-center justify-center w-40 border-transparent rounded-tl-md rounded-bl-md rounded-r-none whitespace-nowrap gap-2 bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            >
              {selectedCategory}
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 flex-none text-gray-400 ml-2"
              />
            </Button>
          )}
        >
          {categories.map((category) => (
            <Dropdown.Item
              key={category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Dropdown.Item>
          ))}
        </Dropdown>

        <div className="relative w-full">
          <input
            type="text"
            id="search-dropdown"
            className="block p-2.5 w-full pr-20 z-20 text-sm text-gray-900 border-transparent rounded-e-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-200 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-indigo-500"
            placeholder="Search Slides, Lectures, Quizzes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => {
              if (searchResults && !isDropdownOpen) {
                setIsDropdownOpen(true);
              }
            }}
            required
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              className="absolute top-0 right-11 p-2.5 h-full text-gray-500 hover:text-gray-700"
              onClick={clearSearch}
            >
              <XMarkIcon className="size-4" />
              <span className="sr-only">Clear</span>
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            className="absolute top-0 end-0 w-10 p-2.5 text-sm font-medium h-full text-white bg-purple-600 rounded-e-lg border border-purple-500 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:border-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="sm" color="purple" />
            ) : (
              <MagnifyingGlassIcon className="size-4" />
            )}
            <span className="sr-only">Search</span>
          </button>
        </div>
      </form>

      {/* Error message */}
      {/* {error && <div className="mt-2 text-red-500 text-sm">{error}</div>} */}

      {/* Search results dropdown */}
      {isDropdownOpen && searchResults && (
        <div
          ref={dropdownRef}
          className="absolute mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200"
        >
          <div className="flex justify-between items-center p-3 border-b border-gray-200">
            <h3 className="font-medium text-black">Search Results</h3>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsDropdownOpen(false)}
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>
          {renderSearchResults()}
        </div>
      )}
    </div>
  );
}

export default CategorySearchBar;