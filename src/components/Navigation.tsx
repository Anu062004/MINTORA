"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Hexagon, Menu, X, Wallet, ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pipeline", label: "Pipeline" },
    { href: "/mintora-marketplace", label: "Marketplace" },
    { href: "/mintora-profile", label: "Profile" },
    { href: "/mintora-verify", label: "Verify" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <div className="max-w-7xl mx-auto glass-card px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                  <Hexagon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">Mintora</span>
                <span className="hidden sm:block text-[10px] text-slate-500 uppercase tracking-widest">Protocol</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-lg border border-violet-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Wallet & Mobile Toggle */}
            <div className="flex items-center gap-3">
              {isConnected ? (
                <div className="relative">
                  <button
                    onClick={() => setWalletOpen(!walletOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 rounded-xl text-sm font-medium hover:border-violet-500/50 transition-all"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${walletOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {walletOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 glass-card p-3"
                      >
                        <div className="px-3 py-2 mb-2">
                          <p className="text-xs text-slate-500">Connected to</p>
                          <p className="text-sm font-medium text-violet-400">Polygon Amoy</p>
                        </div>
                        <div className="border-t border-slate-700/50 pt-2">
                          <a
                            href={`https://amoy.polygonscan.com/address/${address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View on Explorer
                          </a>
                          <button
                            onClick={() => { disconnect(); setWalletOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            Disconnect
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => connect({ connector: connectors[0] })}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 pt-4 border-t border-slate-700/50"
              >
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-violet-600/20 text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
