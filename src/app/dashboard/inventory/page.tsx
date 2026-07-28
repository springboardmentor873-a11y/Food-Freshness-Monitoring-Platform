"use client";

import { useState, useEffect } from "react";
import { getInventory } from "@/services/api";
import { InventoryItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"expiry" | "none">("none");
  
  // Add item form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Apple");
  const [newItemScore, setNewItemScore] = useState(85);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getInventory();
        setInventory(data);
      } catch (error) {
        console.error("Failed to fetch inventory", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;
    
    const isRotten = newItemScore < 40;
    const status = isRotten ? "Spoiled" : newItemScore < 60 ? "Near Spoiled" : newItemScore < 80 ? "Good" : "Fresh";
    const newId = `INV-${Math.floor(Math.random() * 1000)}`;
    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + Math.round(newItemScore / 10));
    const expiryStr = expiry.toISOString().split('T')[0];

    const newItem: InventoryItem = {
      id: newId,
      fruitName: newItemName,
      category: newItemCategory,
      freshnessScore: newItemScore,
      status: status as any,
      dateAdded: today,
      expiryDate: expiryStr,
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60" // default food thumbnail
    };

    setInventory(prev => [newItem, ...prev]);
    setNewItemName("");
    setNewItemScore(85);
    setShowAddForm(false);
    alert(`Item ${newItemName} added successfully to active inventory tracker!`);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to remove this item from active inventory tracking?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const sortedInventory = inventory.filter((item) => {
    const matchesSearch = item.fruitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory || item.fruitName === selectedCategory;
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (sortBy === "expiry") {
    sortedInventory.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fresh': return 'bg-primary/20 text-primary hover:bg-primary/30';
      case 'Good': return 'bg-teal-500/20 text-teal-500 hover:bg-teal-500/30';
      case 'Near Spoiled': return 'bg-warning/20 text-warning-foreground hover:bg-warning/30';
      case 'Spoiled': return 'bg-destructive/20 text-destructive hover:bg-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Active Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage and track your assessed food items with real-time alerts.</p>
        </div>
        <Button className="rounded-xl shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? "Close Form" : "Add Assessed Item"}
        </Button>
      </div>

      {/* Add Item Form (Simulated Modal) */}
      {showAddForm && (
        <Card className="glass-panel border-none shadow-sm overflow-hidden p-6 max-w-lg">
          <form onSubmit={handleAddItem} className="space-y-4">
            <h3 className="text-base font-bold text-foreground">Add Freshness Scanned Item</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Item Name</label>
                <Input 
                  placeholder="e.g. Cavendish Banana" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="h-10 bg-background/50"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full h-10 rounded-lg bg-background/50 border border-border px-3 text-xs focus:ring-primary focus-visible:outline-none transition-all cursor-pointer font-medium"
                >
                  {["Apple", "Banana", "Orange", "Strawberry", "Avocado", "Peach", "Tomato", "Carrot", "Potato", "Cabbage", "Cucumber", "Mango", "Grapes", "Lemon", "Onion", "Broccoli", "Watermelon", "Pear", "Pineapple", "Garlic", "Pepper"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assessed Freshness Score ({newItemScore}%)</label>
              <div className="flex items-center gap-3">
                <Input 
                  type="range"
                  min="0"
                  max="100"
                  value={newItemScore}
                  onChange={(e) => setNewItemScore(parseInt(e.target.value))}
                  className="flex-1 cursor-pointer h-2 bg-muted rounded-lg"
                />
                <span className="text-sm font-black w-8 text-right">{newItemScore}%</span>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="rounded-lg text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                Save to Inventory
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Inventory Panel */}
      <Card className="glass-panel border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border/50 flex flex-col xl:flex-row justify-between gap-4 bg-muted/20">
            <div className="relative w-full xl:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                className="pl-9 bg-background/50 border-transparent focus-visible:ring-primary rounded-xl h-10 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 rounded-xl bg-background/50 border border-border/50 px-3 text-xs focus-visible:outline-none cursor-pointer font-semibold"
              >
                <option value="All">All Categories</option>
                {["Apple", "Banana", "Orange", "Strawberry", "Avocado", "Peach", "Tomato", "Carrot", "Potato", "Cabbage", "Cucumber", "Mango", "Grapes", "Lemon", "Onion", "Broccoli", "Watermelon", "Pear", "Pineapple", "Garlic", "Pepper"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 rounded-xl bg-background/50 border border-border/50 px-3 text-xs focus-visible:outline-none cursor-pointer font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Fresh">Fresh</option>
                <option value="Good">Good</option>
                <option value="Near Spoiled">Near Spoilage</option>
                <option value="Spoiled">Spoiled</option>
              </select>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-10 rounded-xl bg-background/50 border border-border/50 px-3 text-xs focus-visible:outline-none cursor-pointer font-semibold"
              >
                <option value="none">Default Sort</option>
                <option value="expiry">Sort by Expiry Date</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-border/50">
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Item Batch</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Category</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Scan Date</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Expiration</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Freshness</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Status</TableHead>
                  <TableHead className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : sortedInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No matching inventory items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedInventory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/20 border-b-border/30 transition-colors">
                      <TableCell className="font-bold">
                        <div className="flex items-center gap-3">
                          <img src={item.imageUrl} alt={item.fruitName} className="w-10 h-10 rounded-lg object-cover border border-border/20" />
                          <div>
                            <span>{item.fruitName}</span>
                            <p className="text-[10px] text-muted-foreground font-mono leading-none mt-1">({item.id})</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-muted-foreground">{item.category}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(item.dateAdded).toLocaleDateString()}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.freshnessScore >= 75 ? 'bg-primary' : item.freshnessScore >= 40 ? 'bg-warning' : 'bg-destructive'}`} 
                              style={{ width: `${item.freshnessScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-foreground">{item.freshnessScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-transparent px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(item.status)}`}>
                          {item.status === 'Near Spoiled' ? 'NEAR EXPIRED' : item.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 p-0 rounded-md hover:bg-muted text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View preservation details</DropdownMenuItem>
                            <DropdownMenuItem>Mark as dispatched</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              Delete batch record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
