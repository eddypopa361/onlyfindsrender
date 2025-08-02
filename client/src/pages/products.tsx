import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCategory, Product, MainCategory, AccessoriesSubcategory } from "@/lib/types";
import { CategoryTile } from "@/components/category-tile";
import { Helmet } from "react-helmet";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProducts, useSearchProducts } from "@/hooks/use-product-data";
import { useQuery } from "@tanstack/react-query";

// Updated subcategory type (now only accessories have subcategories)
type SubCategory = AccessoriesSubcategory | "All";

export default function Products() {
  const [category, setCategory] = useState<ProductCategory>("All");
  const [subCategory, setSubCategory] = useState<SubCategory>("All");
  // Brand filtering removed as per requirements
  const [sortOrder, setSortOrder] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  // Removed activeTab since we're only showing categories now
  const productsPerPage = 12;
  
  // Scroll la secțiunea de produse când se încarcă pagina
  useEffect(() => {
    // Folosim setTimeout pentru a ne asigura că DOM-ul e complet încărcat
    setTimeout(() => {
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "auto" });
      } else {
        window.scrollTo(0, 0);
      }
    }, 100);
  }, []);

  // Debounce search query to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products using the custom hooks that support static data
  const searchQueryTrim = debouncedSearchQuery.trim();
  
  // Use search functionality if there's a search query
  const searchResults = useSearchProducts({
    query: searchQueryTrim,
    page: currentPage,
    limit: productsPerPage,
    sort: sortOrder
  });
  
  // Use regular product listing if there's no search
  const productResults = useProducts({
    page: currentPage,
    limit: productsPerPage,
    category: category !== "All" ? category : undefined,
    subCategory: (category === "Accessories" && subCategory !== "All") 
      ? subCategory 
      : undefined,
    sort: sortOrder
  });
  
  // Determine which data to use based on whether we're searching or browsing
  const { data, isLoading, isError } = searchQueryTrim ? searchResults : productResults;

  // Calculate pagination from API response
  const products = data?.products || [];
  const totalItems = data?.pagination?.totalItems || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  // Handle category change
  const handleCategoryChange = (newCategory: ProductCategory) => {
    setCategory(newCategory);
    setSubCategory("All"); // Reset subcategory when changing main category
    setCurrentPage(1); // Reset to first page
  };
  
  // Handle subcategory change
  const handleSubCategoryChange = (newSubCategory: SubCategory) => {
    setSubCategory(newSubCategory);
    setCurrentPage(1); // Reset to first page
  };
  
  // Brand functionality removed as per requirements

  // Handle pagination
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to products section
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>All Products - ONLYFINDS</title>
        <meta name="description" content="Browse our complete collection of premium quality products." />
      </Helmet>
      
      <main className="pt-24 pb-16 bg-black text-white">
        {/* Main Products Grid */}
        <section id="products" className="py-16 relative">
          {/* Purple glow effects */}
          <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary/20 filter blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-primary/20 filter blur-3xl"></div>
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 slide-up">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 inline-block relative text-white glow-text">
                <span className="relative z-10">All Products</span>
                <div className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-10"></div>
              </h1>
              <p className="text-gray-300 max-w-xl mx-auto mt-2">
                Browse our complete collection of premium quality products
              </p>
              
              {/* Search Bar */}
              <div className="mt-6 max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white" />
                  <Input
                    type="text"
                    placeholder="Search products by name or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-6 rounded-full bg-black border-2 border-primary text-white placeholder:text-gray-400 focus:border-primary glow-card"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full p-0 text-gray-400 hover:text-white"
                      onClick={() => setSearchQuery("")}
                    >
                      ✕
                    </Button>
                  )}
                </div>
                {debouncedSearchQuery && (
                  <p className="text-sm text-white mt-2 text-left ml-4">
                    Searching for: "{debouncedSearchQuery}"
                  </p>
                )}
              </div>
            </div>
            
            {/* Filter and Sort Options */}
            <div className="mb-8 flex flex-col p-4 rounded-xl shadow-md glow-card">
              {/* Tab Navigation */}
              <div className="mb-4">
                {/* Only categories now, no tabs needed */}
                <div className="text-center mb-4">
                  <h2 className="text-lg font-semibold text-white">Filter by Category</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                  {/* Generate category tiles with icons */}
                  {[
                    "All",
                    "Trending Now", 
                    "Latest Finds", 
                    "Shoes", 
                    "T-shirt and Shorts", 
                    "Hoodies and Pants", 
                    "Coats and Jackets", 
                    "Accessories", 
                    "Electronic Products", 
                    "Perfumes", 
                    "Women"
                  ].map((cat) => (
                    <CategoryTile
                      key={cat}
                      label={cat}
                      isActive={category === cat}
                      onClick={() => handleCategoryChange(cat as ProductCategory)}
                    />
                  ))}
                </div>
                
                {/* Show subcategories for Accessories only */}
                {category === "Accessories" && (
                  <div className="mt-4 border-t border-primary/30 pt-4">
                    <h3 className="text-sm text-white mb-3 text-center">Accessories Subcategories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {[
                        "All",
                        "Peaked Cap",
                        "Knitted Hat", 
                        "Belt",
                        "Scarf",
                        "Bags",
                        "Wallet",
                        "Jewelry",
                        "Sunglasses",
                        "Underwear and Socks",
                        "Other"
                      ].map((subCat) => (
                        <CategoryTile
                          key={subCat}
                          label={subCat}
                          isSubcategory={true}
                          isActive={subCategory === subCat}
                          onClick={() => handleSubCategoryChange(subCat as SubCategory)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* No sorting options as requested */}
            </div>
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-gray-400">Loading products...</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {isError && (
              <div className="text-center py-12 rounded-xl glow-card p-8">
                <h3 className="text-xl font-medium text-blue-400">Error loading products</h3>
                <p className="mt-2 text-gray-400">There was a problem fetching the products.</p>
                <Button 
                  className="mt-4 bg-primary text-white hover:bg-primary/80"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Try Again
                </Button>
              </div>
            )}
            
            {/* Products Grid */}
            {!isLoading && !isError && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 md:gap-6">
                {products.map((product: Product, index: number) => (
                  <div
                    key={`product-${product.id}`}
                    className="fade-in"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
            
            {/* Show message if no products found */}
            {!isLoading && !isError && products.length === 0 && (
              <div className="text-center py-12 rounded-xl glow-card p-8">
                <h3 className="text-xl font-medium text-white">No products found matching your criteria</h3>
                <p className="mt-2 text-gray-400">Try changing your filter options</p>
                <Button 
                  className="mt-4 bg-primary text-white hover:bg-primary/80"
                  onClick={() => handleCategoryChange("All")}
                >
                  View All Products
                </Button>
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && !isError && totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="inline-flex rounded-full shadow-lg overflow-hidden font-heading glow-card">
                  <Button
                    variant="ghost"
                    className="inline-flex items-center px-3 py-2 border-r border-primary/30 bg-black/90 text-white"
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  {/* Render a reasonable number of page buttons */}
                  {Array.from({ length: Math.min(5, Math.max(1, totalPages)) }).map((_, idx) => {
                    // Calculate which page number to display
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }
                    
                    // Ensure pageNum is valid
                    pageNum = Math.max(1, Math.min(totalPages, pageNum));
                    
                    return (
                      <Button
                        key={pageNum}
                        variant="ghost"
                        className={`inline-flex items-center px-4 py-2 border-r border-primary/30 ${
                          currentPage === pageNum
                            ? "bg-primary text-white"
                            : "bg-black/90 text-white hover:bg-primary/30/30"
                        }`}
                        onClick={() => paginate(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {/* Show ellipsis if more pages exist */}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="inline-flex items-center px-4 py-2 border-r border-primary/30 bg-black/90 text-sm font-medium text-white">
                      ...
                    </span>
                  )}
                  
                  {/* Show last page if not visible in the current range */}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <Button
                      variant="ghost"
                      className="inline-flex items-center px-4 py-2 border-r border-primary/30 bg-black/90 text-white hover:bg-primary/30/30"
                      onClick={() => paginate(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    className="inline-flex items-center px-3 py-2 bg-black/90 text-white"
                    disabled={currentPage === totalPages || totalPages <= 1}
                    onClick={() => paginate(currentPage + 1)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}