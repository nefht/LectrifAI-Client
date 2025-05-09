function AccessDenied() {
  return (
    <section className="bg-white dark:bg-purple-900 min-h-[80vh] md:h-full-screen">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="flex flex-col items-center mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-400 dark:text-gray-200">
            403
          </h1>
          <p className="mb-4 text-2xl tracking-tight font-bold text-purple-900 md:text-3xl dark:text-white">
            Access Denied.
          </p>
          <p className="mb-4 text-sm md:text-lg font-light text-gray-800 dark:text-gray-300">
            Sorry, you don't have permission to access this page. You'll find
            lots to explore on the home page.
          </p>
          <a
            href="/"
            className="inline-flex max-w-1/2 items-center justify-center text-white bg-purple-600 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800 my-4"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </section>
  );
}

export default AccessDenied;
