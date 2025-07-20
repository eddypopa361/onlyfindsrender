import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetails from "@/pages/product-details";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";
import ImportPage from "@/pages/admin/import";
import HowToOrder from "@/pages/howto";
import DocsPage from "@/pages/docs";
import DocDetailPage from "@/pages/doc-detail";
import MainNav from "@/components/navigation/main-nav";
import Footer from "@/components/footer";

function Router() {
  return (
    <>
      <MainNav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/product/:id" component={ProductDetails} />
        <Route path="/faq" component={FAQ} />
        {/* Pagina de contact este dezactivată în versiunea live, dar păstrată pentru referință */}
        {/* <Route path="/contact" component={Contact} /> */}
        <Route path="/howto" component={HowToOrder} />
        <Route path="/docs" component={DocsPage} />
        <Route path="/docs/:slug" component={DocDetailPage} />
        <Route path="/admin/import" component={ImportPage} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
