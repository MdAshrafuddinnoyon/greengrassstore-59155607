<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/stores/compareStore";
<<<<<<< HEAD
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
=======
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066

export const CompareDrawer = () => {
  const { items, isOpen, toggleCompareDrawer, removeItem, clearAll } = useCompareStore();
  const [isMinimized, setIsMinimized] = useState(false);

<<<<<<< HEAD
  // Don't show if no items
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  if (items.length === 0) return null;

  return (
    <>
      {/* Fixed Compare Bar at Bottom */}
      <AnimatePresence>
        {items.length > 0 && !isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-foreground text-background shadow-2xl"
          >
            {/* Toggle Button */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-1 rounded-t-lg text-sm font-medium flex items-center gap-1"
            >
              <Scale className="w-4 h-4" />
              Compare ({items.length})
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {!isMinimized && (
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center gap-4">
                  {/* Product Thumbnails */}
                  <div className="flex-1 flex items-center gap-3 overflow-x-auto pb-1">
                    {items.map((item) => (
<<<<<<< HEAD
                      <div key={item.node.id} className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-background/10">
                          <img
                            src={item.node.images.edges[0]?.node.url}
                            alt={item.node.title}
=======
                      <div key={item.id} className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-background/10">
                          <img
                            src={item.featured_image || '/placeholder.svg'}
                            alt={item.name}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
<<<<<<< HEAD
                          onClick={() => removeItem(item.node.id)}
=======
                          onClick={() => removeItem(item.id)}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Empty slots */}
                    {Array.from({ length: 4 - items.length }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="w-14 h-14 rounded-lg border-2 border-dashed border-background/30 flex-shrink-0"
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAll}
                      className="text-background/70 hover:text-background hover:bg-background/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => toggleCompareDrawer(true)}
                      disabled={items.length < 2}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Compare Now
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Compare Modal/Sheet */}
      <Sheet open={isOpen} onOpenChange={toggleCompareDrawer}>
        <SheetContent side="bottom" className="h-[90vh] overflow-hidden flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Compare Products ({items.length})
              </SheetTitle>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </SheetHeader>

          {/* Compare Table */}
          <div className="flex-1 overflow-auto mt-4">
            <CompareTable />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

const CompareTable = () => {
  const { items, removeItem } = useCompareStore();

<<<<<<< HEAD
  const compareFields = [
    { label: "Image", key: "image" },
    { label: "Name", key: "title" },
    { label: "Price", key: "price" },
    { label: "Description", key: "description" },
    { label: "Options", key: "options" },
    { label: "Availability", key: "availability" },
  ];

=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr>
            <th className="w-32 p-3 text-left text-sm font-medium text-muted-foreground bg-muted/50 sticky left-0">
              Feature
            </th>
            {items.map((item) => (
<<<<<<< HEAD
              <th key={item.node.id} className="p-3 text-center min-w-[200px]">
                <button
                  onClick={() => removeItem(item.node.id)}
=======
              <th key={item.id} className="p-3 text-center min-w-[200px]">
                <button
                  onClick={() => removeItem(item.id)}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                  className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Image Row */}
          <tr className="border-b">
            <td className="p-3 text-sm font-medium text-muted-foreground bg-muted/50 sticky left-0">
              Image
            </td>
            {items.map((item) => (
<<<<<<< HEAD
              <td key={item.node.id} className="p-3 text-center">
                <Link to={`/product/${item.node.handle}`}>
                  <img
                    src={item.node.images.edges[0]?.node.url}
                    alt={item.node.title}
=======
              <td key={item.id} className="p-3 text-center">
                <Link to={`/product/${item.slug}`}>
                  <img
                    src={item.featured_image || '/placeholder.svg'}
                    alt={item.name}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                    className="w-24 h-24 object-cover rounded-lg mx-auto hover:scale-105 transition-transform"
                  />
                </Link>
              </td>
            ))}
          </tr>

          {/* Title Row */}
          <tr className="border-b">
            <td className="p-3 text-sm font-medium text-muted-foreground bg-muted/50 sticky left-0">
              Name
            </td>
            {items.map((item) => (
<<<<<<< HEAD
              <td key={item.node.id} className="p-3 text-center">
                <Link
                  to={`/product/${item.node.handle}`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.node.title}
=======
              <td key={item.id} className="p-3 text-center">
                <Link
                  to={`/product/${item.slug}`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.name}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                </Link>
              </td>
            ))}
          </tr>

          {/* Price Row */}
          <tr className="border-b">
            <td className="p-3 text-sm font-medium text-muted-foreground bg-muted/50 sticky left-0">
              Price
            </td>
            {items.map((item) => (
<<<<<<< HEAD
              <td key={item.node.id} className="p-3 text-center">
                <span className="font-bold text-primary text-lg">
                  {item.node.priceRange.minVariantPrice.currencyCode}{" "}
                  {parseFloat(item.node.priceRange.minVariantPrice.amount).toFixed(0)}
=======
              <td key={item.id} className="p-3 text-center">
                <span className="font-bold text-primary text-lg">
                  {item.currency} {item.price.toFixed(2)}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                </span>
              </td>
            ))}
          </tr>

          {/* Description Row */}
          <tr className="border-b">
            <td className="p-3 text-sm font-medium text-muted-foreground bg-muted/50 sticky left-0">
              Description
            </td>
            {items.map((item) => (
<<<<<<< HEAD
              <td key={item.node.id} className="p-3 text-center">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.node.description || "No description available"}
=======
              <td key={item.id} className="p-3 text-center">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.description || "No description available"}
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                </p>
              </td>
            ))}
          </tr>

<<<<<<< HEAD
          {/* Options Row */}
          <tr className="border-b">
            <td className="p-3 text-sm font-medium text-muted-foreground bg-muted/50 sticky left-0">
              Options
            </td>
            {items.map((item) => (
              <td key={item.node.id} className="p-3 text-center">
                {item.node.options && item.node.options.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-1">
                    {item.node.options.map((opt, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-muted rounded-full text-xs"
                      >
                        {opt.name}: {opt.values.slice(0, 2).join(", ")}
                        {opt.values.length > 2 && "..."}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
=======
          {/* Category Row */}
          <tr className="border-b">
            <td className="p-3 text-sm font-medium text-muted-foreground bg-muted/50 sticky left-0">
              Category
            </td>
            {items.map((item) => (
              <td key={item.id} className="p-3 text-center">
                <span className="px-2 py-0.5 bg-muted rounded-full text-xs">
                  {item.category}
                </span>
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
              </td>
            ))}
          </tr>

          {/* Availability Row */}
          <tr className="border-b">
            <td className="p-3 text-sm font-medium text-muted-foreground bg-muted/50 sticky left-0">
              Availability
            </td>
            {items.map((item) => {
<<<<<<< HEAD
              const isAvailable = item.node.variants.edges.some(
                (v) => v.node.availableForSale
              );
              return (
                <td key={item.node.id} className="p-3 text-center">
=======
              const isAvailable = (item.stock_quantity ?? 0) > 0;
              return (
                <td key={item.id} className="p-3 text-center">
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isAvailable ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
              );
            })}
          </tr>

          {/* Action Row */}
          <tr>
            <td className="p-3 text-sm font-medium text-muted-foreground bg-muted/50 sticky left-0">
              Action
            </td>
            {items.map((item) => (
<<<<<<< HEAD
              <td key={item.node.id} className="p-3 text-center">
                <Button asChild size="sm">
                  <Link to={`/product/${item.node.handle}`}>View Details</Link>
=======
              <td key={item.id} className="p-3 text-center">
                <Button asChild size="sm">
                  <Link to={`/product/${item.slug}`}>View Details</Link>
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
