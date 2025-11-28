"use client";

import Link from "next/link";
import { Shield, Zap, Coins, ArrowRight, CheckCircle, Sparkles, Globe, Lock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: "Cryptographic Verification",
      description: "Merkle proofs anchor your research immutably on Polygon blockchain",
      gradient: "from-violet-600 to-fuchsia-600",
    },
    {
      icon: Zap,
      title: "Low-Cost Registration",
      description: "Register your research on-chain for just 0.1 MATIC",
      gradient: "from-fuchsia-600 to-cyan-500",
    },
    {
      icon: Coins,
      title: "Trade & Earn",
      description: "List and trade research iNFTs with built-in 5% creator royalties",
      gradient: "from-cyan-500 to-emerald-500",
    },
  ];

  const steps = [
    { num: 1, title: "Upload to IPFS", desc: "Decentralized storage" },
    { num: 2, title: "Merkle Root", desc: "Generate proof" },
    { num: 3, title: "Anchor On-Chain", desc: "Polygon Amoy" },
    { num: 4, title: "AI Analysis", desc: "Quality verification" },
    { num: 5, title: "Mint iNFT", desc: "Research passport" },
  ];

  const stats = [
    { value: "100+", label: "Verified Research", icon: CheckCircle },
    { value: "50+", label: "Researchers", icon: Globe },
    { value: "0.1 MATIC", label: "Registration Fee", icon: Zap },
    { value: "5%", label: "Creator Royalty", icon: TrendingUp },
  ];

  return (
    <div className="pt-28">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '-4s' }} />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/10 border border-violet-500/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300">Powered by Polygon Amoy Testnet</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
              <span className="gradient-text">Mintora</span>
              <br />
              <span className="text-white">Protocol</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your research into verified, tradeable{" "}
              <span className="text-violet-400 font-semibold">Intelligent NFTs</span> with 
              cryptographic proofs and AI-powered verification
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pipeline" className="btn-primary text-lg flex items-center justify-center gap-2 group">
                Start Verification
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/mintora-marketplace" className="btn-secondary text-lg">
                Browse Marketplace
              </Link>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="stat-card p-5">
                <stat.icon className="w-5 h-5 text-violet-400 mb-2" />
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">Mintora</span>?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              The complete platform for research verification and intellectual property tokenization
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card-hover p-8 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-6`}>
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-violet-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              5-Step <span className="gradient-text">Verification Pipeline</span>
            </h2>
            <p className="text-slate-400 text-lg">
              From upload to iNFT in minutes, not days
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600/50 via-fuchsia-600/50 to-cyan-500/50 -translate-y-1/2" />
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="glass-card p-6 text-center hover:glow-violet transition-all duration-500 group">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-xl font-bold relative z-10 group-hover:scale-110 transition-transform">
                      {step.num}
                    </div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/pipeline" className="btn-primary inline-flex items-center gap-2">
              Try the Pipeline <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden glow-violet">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-violet-600/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-fuchsia-600/20 to-transparent rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <Lock className="w-12 h-12 mx-auto mb-6 text-violet-400" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Verify Your Research?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Join Mintora Protocol and transform your research into verified, 
                tradeable iNFTs for just 0.1 MATIC registration fee
              </p>
              <Link href="/pipeline" className="btn-primary text-lg inline-flex items-center gap-2 group">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold gradient-text">Mintora Protocol</span>
            </div>
            <p className="text-slate-500 text-sm">
              Decentralized Research Verification • Polygon Amoy Testnet
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a href="#" className="hover:text-violet-400 transition-colors">Docs</a>
              <a href="#" className="hover:text-violet-400 transition-colors">GitHub</a>
              <a href="#" className="hover:text-violet-400 transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
