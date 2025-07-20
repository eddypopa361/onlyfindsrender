import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCategory, Product, ProductBrand, ClothingSubCategory, AccessoriesSubCategory } from "@/lib/types";
import { Helmet } from "react-helmet";
import { ChevronLeft, ChevronRight, Loader2, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts, useSearchProducts } from "@/hooks/use-product-data";
import { useQuery } from "@tanstack/react-query";

// Definiți un tip unificat pentru toate subcategoriile
type SubCategory = ClothingSubCategory | AccessoriesSubCategory;

export default function Products() {
  const [category, setCategory] = useState<ProductCategory>("All");
  const [subCategory, setSubCategory] = useState<SubCategory>("All");
  const [brand, setBrand] = useState<ProductBrand>("All");
  const [sortOrder, setSortOrder] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("categories");
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
    brand: activeTab === "brands" && brand !== "All" ? brand : undefined,
    sort: sortOrder
  });
  
  // Use regular product listing if there's no search
  const productResults = useProducts({
    page: currentPage,
    limit: productsPerPage,
    category: activeTab === "categories" && category !== "All" ? category : undefined,
    subCategory: (activeTab === "categories" && (category === "Clothing" || category === "Accessories") && subCategory !== "All") 
      ? subCategory 
      : undefined,
    brand: activeTab === "brands" && brand !== "All" ? brand : undefined,
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
  
  // Handle brand change
  const handleBrandChange = (newBrand: ProductBrand) => {
    setBrand(newBrand);
    setCurrentPage(1); // Reset to first page
  };

  // Handle pagination
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to products section
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>All Products - JOYAFINDS</title>
        <meta name="description" content="Browse our complete collection of premium quality products." />
      </Helmet>
      
      <main className="pt-24 pb-16 bg-black text-white">
        {/* Main Products Grid */}
        <section id="products" className="py-16 relative">
          {/* Purple glow effects */}
          <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary-600/20 filter blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-primary-600/20 filter blur-3xl"></div>
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <Input
                    type="text"
                    placeholder="Search products by name or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-6 rounded-full bg-black border-2 border-purple-700 text-white placeholder:text-gray-400 focus:border-primary glow-card"
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
                  <p className="text-sm text-purple-300 mt-2 text-left ml-4">
                    Searching for: "{debouncedSearchQuery}"
                  </p>
                )}
              </div>
            </div>
            
            {/* Filter and Sort Options */}
            <div className="mb-8 flex flex-col p-4 rounded-xl shadow-md glow-card">
              {/* Tab Navigation */}
              <div className="mb-4">
                <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-black/50 p-1 rounded-full border border-purple-500/30">
                    <TabsTrigger 
                      value="categories" 
                      className={`rounded-full ${activeTab === 'categories' ? 'bg-primary text-white' : 'text-purple-200'}`}
                      onClick={() => {
                        if (brand !== "All") {
                          setBrand("All"); // Reset brand when switching to categories
                        }
                      }}
                    >
                      Categories
                    </TabsTrigger>
                    <TabsTrigger 
                      value="brands" 
                      className={`rounded-full ${activeTab === 'brands' ? 'bg-primary text-white' : 'text-purple-200'}`}
                      onClick={() => {
                        if (category !== "All") {
                          setCategory("All"); // Reset category when switching to brands
                        }
                      }}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      Brands
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="categories" className="mt-4">
                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 w-full">
                      {/* Generate buttons for all categories */}
                      {["All", "Shoes", "Clothing", "Accessories", "Bags & Backpacks", "Reptronics + Watches", "Jewelry", "Opium Style", "Room Decor & Misc Items"]
                        .map((cat) => (
                          <Button 
                            key={cat}
                            variant={category === cat ? "default" : "outline"}
                            className={category === cat 
                              ? "bg-primary text-white hover:bg-primary/80 rounded-full text-sm px-6 py-2.5 font-medium"
                              : "bg-black border border-purple-500/50 text-purple-200 hover:bg-purple-900/30 rounded-full text-sm px-6 py-2.5 font-medium"
                            }
                            onClick={() => handleCategoryChange(cat as ProductCategory)}
                          >
                            {cat === "All" ? "All Products" : cat}
                          </Button>
                        ))
                      }
                    </div>
                    
                    {/* Show subcategories for Clothing */}
                    {category === "Clothing" && (
                      <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-2 w-full border-t border-purple-500/30 pt-4">
                        <h3 className="w-full text-sm text-purple-300 mb-2">Subcategories:</h3>
                        {["All", "T-Shirts", "Shirts", "Hoodies", "Jackets", "Sweaters", "Pants & Jeans", "Shorts", "Tracksuits", "Boxers", "Jerseys", "Socks", "Women", "Kids"]
                          .map((subCat) => (
                            <Button 
                              key={subCat}
                              variant={subCategory === subCat ? "default" : "outline"}
                              size="sm"
                              className={subCategory === subCat 
                                ? "bg-primary text-white hover:bg-primary/80 rounded-full text-xs"
                                : "bg-black border border-purple-500/50 text-purple-200 hover:bg-purple-900/30 rounded-full text-xs"
                              }
                              onClick={() => handleSubCategoryChange(subCat as SubCategory)}
                            >
                              {subCat === "All" ? "All Clothing" : subCat}
                            </Button>
                          ))
                        }
                      </div>
                    )}
                    
                    {/* Show subcategories for Accessories */}
                    {category === "Accessories" && (
                      <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-2 w-full border-t border-purple-500/30 pt-4">
                        <h3 className="w-full text-sm text-purple-300 mb-2">Subcategories:</h3>
                        {["All", "Eyewear", "Wallets & Small Accessories", "Fashion Accessories"]
                          .map((subCat) => (
                            <Button 
                              key={subCat}
                              variant={subCategory === subCat ? "default" : "outline"}
                              size="sm"
                              className={subCategory === subCat 
                                ? "bg-primary text-white hover:bg-primary/80 rounded-full text-xs"
                                : "bg-black border border-purple-500/50 text-purple-200 hover:bg-purple-900/30 rounded-full text-xs"
                              }
                              onClick={() => handleSubCategoryChange(subCat as SubCategory)}
                            >
                              {subCat === "All" ? "All Accessories" : subCat}
                            </Button>
                          ))
                        }
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="brands" className="mt-4">
                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 w-full">
                      {/* Generate buttons for all available brands */}
                      {["All", "33Trente", "4Tune", "ADIDAS", "ADWYSD", "AIME LEON DORE", "Air Jordan", "AKIMBO", 
                        "ALEXANDER MCQUEEN", "AMI", "AMIRI", "ANTISOCIAL CLUB", "Arc'teryx", "ASICS", "ASTROWORLD", 
                        "BALENCIAGA", "BAPE", "BIRKINSTOCKS", "BROKEN PLANET", "Burberry", "C.P.COMPANY", 
                        "CACTUS JACK", "Calvin Klein", "Canada Goose", "Carhartt", "Carsicko", "Casablanca", 
                        "CHANEL", "CHICAGO BULLS", "Chrome Hearts", "Cole Buxton", "Comme des Garçons", 
                        "CONVERSE", "Corteiz", "CPFM", "Crocodile", "DENIM TEARS", "Diesel", "Dior", 
                        "DREW HOUSE", "Dsquared", "EMPORIO ARMANI EA7", "ENFANTS RICHES DÉPRIMÉS", 
                        "Eric Emanuel", "EVISU", "Fear of God Essentials", "Fendi", "Gallery Dept", 
                        "GANNI", "GUCCI", "HELLSTAR", "House of Errors", "IDLT", "KAPITAL", "Kanye", 
                        "Kaws", "Kenzo Paris", "KOLON SPORT", "LACOSTE", "LANVIN", "LORO PIANA", 
                        "LOUIS VUITTON", "Maison Margiela", "MAISON MIHARA YASUHIRO", "MLB", "Moncler", 
                        "Moose Knuckles", "MYSTERY", "NBA", "Needles", "NEW BALANCE", "Nike", "Oakley", 
                        "OFF-WHITE", "Palm Angels", "Patagonia", "PLAYBOI CARTI", "PRADA", "RAF SIMONS", 
                        "Ralph Lauren", "RANBO", "Represent", "REVENGE", "Rhude", "RICK OWENS", "SAINT LAURENT", 
                        "SP5DER", "STONE ISLAND", "STUSSY", "SUBHUMAN", "SUPREME", "SYNA WORLD", 
                        "The North Face", "Thom Browne", "TIMBERLANDS", "Trapstar", "Travis Scott", "UGG", 
                        "Under Armour", "UNDERCOVER", "VETEMENTS", "VLONE", "Vuja De", "Y2", "YEEZY"]
                        .map((br) => (
                          <Button 
                            key={br}
                            variant={brand === br ? "default" : "outline"}
                            className={brand === br
                              ? "bg-primary text-white hover:bg-primary/80 rounded-full text-sm"
                              : "bg-black border border-purple-500/50 text-purple-200 hover:bg-purple-900/30 rounded-full text-sm"
                            }
                            onClick={() => handleBrandChange(br as ProductBrand)}
                          >
                            {br === "All" ? "All Brands" : br}
                          </Button>
                        ))
                      }
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* No sorting options as requested */}
            </div>
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
                  <p className="text-gray-400">Loading products...</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {isError && (
              <div className="text-center py-12 rounded-xl glow-card p-8">
                <h3 className="text-xl font-medium text-red-400">Error loading products</h3>
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
                <h3 className="text-xl font-medium text-purple-200">No products found matching your criteria</h3>
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
                    className="inline-flex items-center px-3 py-2 border-r border-purple-500/30 bg-black/90 text-purple-200"
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
                        className={`inline-flex items-center px-4 py-2 border-r border-purple-500/30 ${
                          currentPage === pageNum
                            ? "bg-primary text-white"
                            : "bg-black/90 text-purple-200 hover:bg-purple-900/30"
                        }`}
                        onClick={() => paginate(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {/* Show ellipsis if more pages exist */}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="inline-flex items-center px-4 py-2 border-r border-purple-500/30 bg-black/90 text-sm font-medium text-purple-200">
                      ...
                    </span>
                  )}
                  
                  {/* Show last page if not visible in the current range */}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <Button
                      variant="ghost"
                      className="inline-flex items-center px-4 py-2 border-r border-purple-500/30 bg-black/90 text-purple-200 hover:bg-purple-900/30"
                      onClick={() => paginate(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    className="inline-flex items-center px-3 py-2 bg-black/90 text-purple-200"
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