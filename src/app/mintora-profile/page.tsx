"use client";

import { useAccount } from "wagmi";
import { User, Award, FileText, ExternalLink, Copy, CheckCircle, Sparkles, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const mockOwnedNFTs = [
  { tokenId: 5, title: "Neural Network Optimization Study", qualityScore: 91, mintDate: "2024-01-15", category: "AI/ML" },
  { tokenId: 12, title: "Post-Quantum Cryptography Research", qualityScore: 88, mintDate: "2024-02-20", category: "Security" },
  { tokenId: 23, title: "DeFi Protocol Analysis", qualityScore: 94, mintDate: "2024-03-10", category: "Blockchain" },
];

const mockAchievements = [
  { id: 1, title: "First Verification", description: "Completed your first research verification", icon: "🎯", unlocked: true },
  { id: 2, title: "Quality Researcher", description: "Achieved 90+ quality score", icon: "⭐", unlocked: true },
  { id: 3, title: "Collector", description: "Own 3+ Research Passports", icon: "🏆", unlocked: true },
  { id: 4, title: "Top Seller", description: "Sell 5+ iNFTs on marketplace", icon: "💎", unlocked: false },
  { id: 5, title: "Pioneer", description: "Be among first 100 users", icon: "🚀", unlocked: true },
  { id: 6, title: "Perfectionist", description: "Achieve 100 quality score", icon: "✨", unlocked: false },
];

const mockActivity = [
  { type: "mint", title: "Minted Research Passport #23", time: "2 hours ago" },
  { type: "verify", title: "Completed verification pipeline", time: "3 hours ago" },
  { type: "buy", title: "Purchased iNFT #45", time: "1 day ago" },
];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center">
            <User className="w-10 h-10 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
          <p className="text-slate-400">Connect your wallet to view your profile and owned iNFTs</p>
        </motion.div>
      </div>
    );
  }

  const totalScore = mockOwnedNFTs.reduce((acc, nft) => acc + nft.qualityScore, 0);
  const avgScore = Math.round(totalScore / mockOwnedNFTs.length);

  return (
    <div className="pt-32 min-h-screen px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-slate-900 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold gradient-text">Researcher</h1>
                <span className="badge badge-success">Verified</span>
              </div>
              
              <button
                onClick={copyAddress}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
              >
                <span className="font-mono text-sm">{address}</span>
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  <span className="text-sm">{mockOwnedNFTs.length} iNFTs</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">Avg Score: {avgScore}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">{mockAchievements.filter(a => a.unlocked).length} Achievements</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href={`https://amoy.polygonscan.com/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Explorer
              </a>
              <Link href="/pipeline" className="btn-primary text-sm">
                New Research
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Owned NFTs */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  Your Research Passports
                </h2>
                <span className="text-sm text-slate-500">{mockOwnedNFTs.length} items</span>
              </div>

              <div className="space-y-4">
                {mockOwnedNFTs.map((nft, i) => (
                  <motion.div
                    key={nft.tokenId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="glass-card-hover p-5 flex items-center gap-5"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 flex items-center justify-center text-3xl flex-shrink-0">
                      🔬
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 truncate">{nft.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>Token #{nft.tokenId}</span>
                        <span className="badge text-xs">{nft.category}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <span className="text-xl font-bold text-emerald-400">{nft.qualityScore}</span>
                        <span className="text-sm text-slate-500">/100</span>
                      </div>
                      <p className="text-xs text-slate-600">{nft.mintDate}</p>
                    </div>

                    <a
                      href={`https://amoy.polygonscan.com/token/${process.env.NEXT_PUBLIC_MINTORA_PASSPORT}?a=${nft.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-500 hover:text-violet-400" />
                    </a>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Achievements
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                {mockAchievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className={`glass-card p-4 text-center ${
                      achievement.unlocked ? "" : "opacity-40"
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{achievement.icon}</span>
                    <p className="text-xs font-medium truncate">{achievement.title}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Recent Activity
              </h2>
              
              <div className="space-y-3">
                {mockActivity.map((activity, i) => (
                  <div key={i} className="glass-card p-4">
                    <p className="text-sm font-medium mb-1">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
