import React, { useState } from "react";
import { Dropdown, Button } from "flowbite-react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

const categories = [
  "All categories",
  "Mockups",
  "Templates",
  "Slides",
  "Lectures",
  "Users",
];

const CategorySearch = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-full max-w-xl">
      <Dropdown
        label={selectedCategory}
        color="gray"
        size="md"
        className="rounded-l-lg m-0"
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
          type="search"
          id="search-dropdown"
          className="block p-2.5 w-full pr-11 z-20 text-sm text-gray-900 border-transparent rounded-e-lg bg-gray-50 focus:ring-purple-500 focus:border-purple-200 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-indigo-500"
          placeholder="Search Mockups, Logos, Design Templates..."
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button
          type="submit"
          className="absolute top-0 end-0 w-10 p-2.5 text-sm font-medium h-full text-white bg-purple-600 rounded-e-lg border border-purple-500 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:border-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
        >
          <MagnifyingGlassIcon className="size-4" />
          <span className="sr-only">Search</span>
        </button>
      </div>
    </div>
  );
};

export default CategorySearch;
