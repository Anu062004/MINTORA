"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import {
  ShoppingCart,
  Tag,
  Loader2,
  Search,
  TrendingUp,
  Sparkles,
  CheckCircle,
  AlertOctagon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTRACT_ADDRESSES, config } from "@/lib/wagmi";
import { MINTORA_MARKETPLACE_ABI } from "@/lib/contracts";

type MarketplaceListing = {
  listingId: number;
  seller: string;
  nftContract: string;
  tokenId: number;
  price: string;
  priceWei: string;
  active: boolean;
  title: string;
  description?: string | null;
  image?: string | null;
  category: string;
  qualityScore: number;
};

export default function MarketplacePage() {
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [buying, setBuying] = useState<number | null>(null);
  const [buySuccess, setBuySuccess] = useState<number | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // Debug: Log when component renders
  useEffect(() => {
    console.log("MarketplacePage rendered", { listings: listings.length, loadingListings });
  }, [listings, loadingListings]);

  const fetchListings = useCallback(async () => {
    setLoadingListings(true);
    setListingsError(null);
    try {
      console.log("Fetching listings from /api/listings");
      const response = await fetch("/api/listings", { cache: "no-store" });
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`Failed to load listings: ${response.status}`);
      }
      const data = await response.json();
      console.log("Listings data received:", data);
      setListings(data.listings || []);
    } catch (error: any) {
      console.error("Marketplace listings error", error);
      setListingsError(error?.message || "Failed to load listings");
      // Set empty array on error so page still renders
      setListings([]);
    } finally {
      setLoadingListings(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    listings.forEach((listing) => unique.add(listing.category || "Research"));
    return ["All", ...Array.from(unique)];
  }, [listings]);

  const filteredListings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesSearch =
        !query ||
        listing.title.toLowerCase().includes(query) ||
        listing.seller.toLowerCase().includes(query) ||
        listing.tokenId.toString() === query ||
        listing.listingId.toString() === query;

      const matchesCategory =
        selectedCategory === "All" || listing.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [listings, searchQuery, selectedCategory]);

  const stats = useMemo(
    () => [
      { label: "Total Listings", value: listings.length.toString(), icon: Tag },
      {
        label: "Available Categories",
        value: (categories.length - 1).toString(),
        icon: Sparkles,
      },
      {
        label: "Registration Fee",
        value: "0.1 MATIC",
        icon: TrendingUp,
      },
      { label: "Network", value: "Polygon Amoy", icon: CheckCircle },
    ],
    [listings.length, categories.length]
  );

  const handleBuy = async (listing: MarketplaceListing) => {
    if (!isConnected) {
      setTxError("Connect wallet to purchase.");
      return;
    }

    if (!CONTRACT_ADDRESSES.marketplace) {
      setTxError("Marketplace contract address is not configured.");
      return;
    }

    setTxError(null);
    setBuying(listing.listingId);
    setBuySuccess(null);

    try {
      const hash = await writeContractAsync({
        abi: MINTORA_MARKETPLACE_ABI,
        address: CONTRACT_ADDRESSES.marketplace as `0x${string}`,
        functionName: "buyNFT",
        args: [BigInt(listing.listingId)],
        value: BigInt(listing.priceWei),
      });

      if (!config) {
        throw new Error("Wagmi config not initialized");
      }
      await waitForTransactionReceipt(config, { hash });
      setBuySuccess(listing.listingId);
      fetchListings();
      setTimeout(() => setBuySuccess(null), 4000);
    } catch (error: any) {
      console.error("buyNFT failed", error);
      setTxError(error?.shortMessage || error?.message || "Transaction failed");
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="relative pt-32 min-h-screen px-4 pb-20 z-10" style={{ color: '#f1f5f9', position: 'relative', zIndex: 10 }}>
      <div className="max-w-7xl mx-auto relative z-10" style={{ position: 'relative', zIndex: 10 }}>
        {/* Debug: Always visible test */}
        <div style={{ padding: '20px', background: 'rgba(124, 58, 237, 0.2)', marginBottom: '20px', borderRadius: '10px', border: '2px solid #7c3aed' }}>
          <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold' }}>Marketplace Page Loaded</p>
          <p style={{ color: '#cbd5e1', fontSize: '14px' }}>Listings: {listings.length} | Loading: {loadingListings ? 'Yes' : 'No'}</p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#ffffff' }}>
            Mintora <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-lg" style={{ color: '#cbd5e1' }}>
            Trade live Research Passport iNFTs on Polygon Amoy
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card p-5" style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(217, 70, 239, 0.05) 100%)', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '16px', position: 'relative', zIndex: 10 }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124, 58, 237, 0.1)' }}>
                  <stat.icon className="w-5 h-5" style={{ color: '#c4b5fd' }} />
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: '#ffffff' }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: '#64748b' }}>{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 mb-8 relative z-10"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by title, seller, token ID or listing ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(124, 58, 237, 0.2)', color: '#f1f5f9' }}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {txError && (
          <div className="glass-card p-3 mb-6 border border-rose-400/40 flex items-center gap-3 text-rose-300 relative z-10">
            <AlertOctagon className="w-5 h-5" />
            <p className="text-sm font-medium">{txError}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          <AnimatePresence>
            {(loadingListings ? Array.from({ length: 3 }) : filteredListings).map(
              (listing, i) =>
                loadingListings ? (
                  <div
                    key={`skeleton-${i}`}
                    className="glass-card p-5 animate-pulse space-y-4"
                  >
                    <div className="h-40 bg-slate-800/60 rounded-xl" />
                    <div className="h-5 bg-slate-800/60 rounded-lg" />
                    <div className="h-5 bg-slate-800/60 rounded-lg w-1/2" />
                  </div>
                ) : listing ? (
                  <motion.div
                    key={listing.listingId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card-hover overflow-hidden group"
                  >
                    <div className="h-48 relative overflow-hidden bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-cyan-500/20">
                      {listing.image ? (
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-7xl group-hover:scale-110 transition-transform duration-500">
                            🔬
                          </div>
                        </div>
                      )}

                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="badge badge-success">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="badge">{listing.category}</span>
                      </div>
                      <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur flex items-center justify-center">
                        <span className="text-sm font-bold text-emerald-400">
                          {listing.qualityScore}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-1 text-white group-hover:text-violet-400 transition-colors line-clamp-1">
                        {listing.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">
                        {listing.description || "Polygon-anchored research asset"}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-500 mt-4 mb-4">
                        <span className="font-mono">
                          {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                        </span>
                        <span>Token #{listing.tokenId}</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <div>
                          <p className="text-xs text-slate-500">Price</p>
                          <p className="text-xl font-bold gradient-text">
                            {listing.price} MATIC
                          </p>
                        </div>

                        <button
                          onClick={() => handleBuy(listing)}
                          disabled={
                            buying === listing.listingId ||
                            !isConnected ||
                            buySuccess === listing.listingId
                          }
                          className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                            buySuccess === listing.listingId
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "btn-primary"
                          }`}
                        >
                          {buying === listing.listingId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : buySuccess === listing.listingId ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Bought
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Buy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : null
            )}
          </AnimatePresence>
        </div>

        {!loadingListings && filteredListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
            style={{ position: 'relative', zIndex: 10 }}
          >
            <Search className="w-16 h-16 mx-auto mb-4" style={{ color: '#475569' }} />
            <p className="text-lg" style={{ color: '#cbd5e1' }}>
              No research found matching your criteria
            </p>
            {listings.length === 0 && (
              <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>
                Try refreshing the page or check the API connection
              </p>
            )}
          </motion.div>
        )}

        {listingsError && (
          <p className="text-center text-rose-400 mt-6 text-sm">{listingsError}</p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass-card p-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <span className="text-slate-400">2.5% Platform Fee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-fuchsia-500" />
              <span className="text-slate-400">5% Creator Royalty</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="text-slate-400">Polygon Amoy Network</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
