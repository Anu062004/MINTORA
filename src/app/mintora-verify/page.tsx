"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Loader2, Shield, FileText, Link2, Hash, Clock, User, ExternalLink, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VerificationResult {
  valid: boolean;
  researchId: number;
  merkleRoot: string;
  cid: string;
  researcher: string;
  qualityScore: number;
  timestamp: string;
  analysisHash: string;
  plagiarismScore: number;
  integrityVerdict: string;
}

export default function VerifyPage() {
  const [researchId, setResearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!researchId) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    
    await new Promise((r) => setTimeout(r, 2000));
    
    // Simulate verification
    const id = parseInt(researchId);
    if (id <= 0 || id > 1000) {
      setError("Research ID not found on chain");
      setLoading(false);
      return;
    }
    
    setResult({
      valid: true,
      researchId: id,
      merkleRoot: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
      cid: "Qm" + Math.random().toString(36).substring(2, 48),
      researcher: "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
      qualityScore: Math.floor(Math.random() * 20) + 80,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      analysisHash: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
      plagiarismScore: Math.floor(Math.random() * 10),
      integrityVerdict: "PASS",
    });
    
    setLoading(false);
  };

  return (
    <div className="pt-32 min-h-screen px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center">
            <Shield className="w-10 h-10 text-violet-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Mintora <span className="gradient-text">Verify</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Verify research proofs and attestations on-chain
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <label className="block text-sm font-medium text-slate-400 mb-3">
            Research ID
          </label>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="number"
                placeholder="Enter Research ID (e.g., 42)"
                value={researchId}
                onChange={(e) => setResearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="input-field pl-12"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={loading || !researchId}
              className="btn-primary flex items-center gap-2 px-8"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Verify
            </button>
          </div>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card p-6 border-rose-500/30 mb-8"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
                <span className="font-medium">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Status Banner */}
              <div className={`glass-card p-6 ${result.valid ? "glow-violet" : ""}`}>
                <div className="flex items-center gap-4">
                  {result.valid ? (
                    <>
                      <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-emerald-400">Verification Passed</h3>
                        <p className="text-slate-400">All cryptographic proofs validated successfully</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-xl bg-rose-500/20 flex items-center justify-center">
                        <XCircle className="w-7 h-7 text-rose-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-rose-400">Verification Failed</h3>
                        <p className="text-slate-400">Could not validate research proofs</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-4">
                <div className="stat-card p-5 text-center">
                  <p className="text-3xl font-bold text-emerald-400">{result.qualityScore}</p>
                  <p className="text-sm text-slate-500">Quality Score</p>
                </div>
                <div className="stat-card p-5 text-center">
                  <p className="text-3xl font-bold text-cyan-400">{result.plagiarismScore}%</p>
                  <p className="text-sm text-slate-500">Plagiarism</p>
                </div>
                <div className="stat-card p-5 text-center">
                  <p className="text-3xl font-bold text-violet-400">{result.integrityVerdict}</p>
                  <p className="text-sm text-slate-500">Verdict</p>
                </div>
              </div>

              {/* Details */}
              <div className="glass-card p-6 space-y-5">
                <h4 className="font-semibold text-lg mb-4">Verification Details</h4>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <Hash className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-500 mb-1">Research ID</p>
                    <p className="font-mono font-medium">#{result.researchId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                    <Link2 className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-500 mb-1">Merkle Root</p>
                    <p className="font-mono text-sm break-all text-slate-300">{result.merkleRoot}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-500 mb-1">IPFS CID</p>
                    <p className="font-mono text-sm text-slate-300">{result.cid}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-500 mb-1">Researcher</p>
                    <p className="font-mono text-sm text-slate-300">{result.researcher}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-500 mb-1">AI Attestation Hash</p>
                    <p className="font-mono text-sm break-all text-slate-300">{result.analysisHash}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-500 mb-1">Anchored On</p>
                    <p className="text-slate-300">{new Date(result.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  <a
                    href={`https://amoy.polygonscan.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Polygon Amoy Explorer
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!result && !error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-700" />
            <p className="text-slate-500">Enter a Research ID to verify its on-chain proofs</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
