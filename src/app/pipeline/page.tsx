"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Upload, FileCheck, Link2, Brain, Sparkles, CheckCircle, Loader2, AlertCircle, ArrowRight, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTRACT_ADDRESSES } from "@/lib/wagmi";
import { MINTORA_ANCHOR_ABI } from "@/lib/contracts";
import { parseEther } from "viem";

type Step = 1 | 2 | 3 | 4 | 5;

interface PipelineState {
  file: File | null;
  cid: string;
  merkleRoot: string;
  researchId: number;
  analysisResult: {
    qualityScore: number;
    plagiarismPercentage: number;
    integrityVerdict: string;
  } | null;
  tokenId: number;
}

const stepConfig = [
  { num: 1, icon: Upload, title: "Upload", subtitle: "IPFS Storage", color: "violet" },
  { num: 2, icon: FileCheck, title: "Merkle", subtitle: "Generate Proof", color: "fuchsia" },
  { num: 3, icon: Link2, title: "Anchor", subtitle: "On-Chain", color: "cyan" },
  { num: 4, icon: Brain, title: "Analyze", subtitle: "AI Verification", color: "emerald" },
  { num: 5, icon: Sparkles, title: "Mint", subtitle: "iNFT Passport", color: "amber" },
];

export default function PipelinePage() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<PipelineState>({
    file: null,
    cid: "",
    merkleRoot: "",
    researchId: 0,
    analysisResult: null,
    tokenId: 0,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setState((s) => ({ ...s, file }));
    await new Promise((r) => setTimeout(r, 2000));
    const mockCid = `Qm${Math.random().toString(36).substring(2, 48)}`;
    setState((s) => ({ ...s, cid: mockCid }));
    setCurrentStep(2);
    setLoading(false);
  };

  const generateMerkleRoot = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const mockRoot = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    setState((s) => ({ ...s, merkleRoot: mockRoot }));
    setCurrentStep(3);
    setLoading(false);
  };

  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  // Update research ID when transaction is confirmed
  useEffect(() => {
    if (receipt && txHash) {
      // Parse the ResearchRegistered event to get researchId
      // For now, we'll fetch it from the contract
      const fetchResearchId = async () => {
        try {
          // You would read the event logs here to get the researchId
          // For now, using a placeholder - in production, parse the event
          const researchId = Math.floor(Math.random() * 1000) + 1;
          setState((s) => ({ ...s, researchId }));
          setCurrentStep(4);
          setTxHash(null);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching research ID:", err);
          setLoading(false);
        }
      };
      fetchResearchId();
    }
  }, [receipt, txHash]);

  const anchorOnChain = async () => {
    if (!address || !isConnected) {
      setError("Please connect your wallet");
      return;
    }

    if (!state.merkleRoot || !state.cid) {
      setError("Please complete previous steps first");
      return;
    }

    if (!CONTRACT_ADDRESSES.anchor) {
      setError("Contract address not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const registrationFee = parseEther("0.1"); // 0.1 MATIC
      
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.anchor as `0x${string}`,
        abi: MINTORA_ANCHOR_ABI,
        functionName: "registerResearch",
        args: [state.merkleRoot as `0x${string}`, state.cid, address],
        value: registrationFee,
      });

      setTxHash(hash);
      // Loading will continue until receipt is confirmed
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err?.shortMessage || err?.message || "Failed to register research. Please ensure you have 0.1 MATIC.");
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 3000));
    setState((s) => ({
      ...s,
      analysisResult: {
        qualityScore: Math.floor(Math.random() * 25) + 75,
        plagiarismPercentage: Math.floor(Math.random() * 8),
        integrityVerdict: "PASS",
      },
    }));
    setCurrentStep(5);
    setLoading(false);
  };

  const mintPassport = async () => {
    if (!address) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    const mockTokenId = Math.floor(Math.random() * 1000) + 1;
    setState((s) => ({ ...s, tokenId: mockTokenId }));
    setLoading(false);
  };

  if (!isConnected) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center">
            <Wallet className="w-10 h-10 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Connect Your Wallet</h2>
          <p className="text-slate-400 mb-6">
            Connect your wallet to start the research verification pipeline
          </p>
          <div className="badge mx-auto">
            <AlertCircle className="w-3 h-3" />
            Polygon Amoy Required
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Research <span className="gradient-text">Verification</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Complete the pipeline to mint your Research Passport iNFT
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-800">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {stepConfig.map((step) => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              
              return (
                <div key={step.num} className="relative z-10 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: isCurrent ? 1.1 : 1,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-br from-violet-600 to-fuchsia-600"
                        : isCurrent
                        ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 ring-4 ring-violet-500/30"
                        : "bg-slate-800 border border-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon className={`w-5 h-5 ${isCurrent ? "text-white" : "text-slate-500"}`} />
                    )}
                  </motion.div>
                  <div className="mt-3 text-center hidden sm:block">
                    <p className={`text-sm font-medium ${isCurrent ? "text-white" : "text-slate-500"}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-600">{step.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 md:p-12"
          >
            {currentStep === 1 && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Upload Research File</h2>
                <p className="text-slate-400 mb-8">Your file will be stored on IPFS</p>
                
                <label className="cursor-pointer block">
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={loading} />
                  <div className="border-2 border-dashed border-violet-500/30 rounded-2xl p-12 hover:border-violet-500/60 hover:bg-violet-500/5 transition-all group">
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-10 h-10 animate-spin text-violet-400 mb-4" />
                        <p className="text-slate-400">Uploading to IPFS...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mx-auto mb-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                        <p className="text-slate-400 group-hover:text-slate-300">
                          Click or drag to upload your research file
                        </p>
                        <p className="text-sm text-slate-600 mt-2">PDF, DOC, TXT up to 50MB</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-fuchsia-600/20 to-cyan-500/20 border border-fuchsia-500/30 flex items-center justify-center">
                  <FileCheck className="w-10 h-10 text-fuchsia-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Generate Merkle Root</h2>
                <p className="text-slate-400 mb-6">Create cryptographic proof of your research</p>
                
                <div className="glass-card p-4 mb-8 text-left max-w-md mx-auto">
                  <p className="text-sm text-slate-500 mb-1">IPFS CID</p>
                  <p className="font-mono text-sm text-violet-400 break-all">{state.cid}</p>
                </div>

                <button
                  onClick={generateMerkleRoot}
                  disabled={loading}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  Generate Proof
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Link2 className="w-10 h-10 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Anchor On-Chain</h2>
                <p className="text-slate-400 mb-6">Register your research on Polygon Amoy</p>
                
                <div className="glass-card p-4 mb-4 text-left max-w-lg mx-auto">
                  <p className="text-sm text-slate-500 mb-1">Merkle Root</p>
                  <p className="font-mono text-xs text-cyan-400 break-all">{state.merkleRoot}</p>
                </div>

                <div className="glass-card p-4 mb-8 text-left max-w-lg mx-auto border-amber-500/30 bg-amber-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <p className="text-sm font-semibold text-amber-400">Registration Fee</p>
                  </div>
                  <p className="text-lg font-bold text-white">0.1 MATIC</p>
                  <p className="text-xs text-slate-500 mt-1">Required to register your research on-chain</p>
                </div>

                {error && (
                  <div className="glass-card p-4 mb-6 border-rose-500/30 bg-rose-500/5 max-w-lg mx-auto">
                    <div className="flex items-center gap-2 text-rose-400">
                      <AlertCircle className="w-5 h-5" />
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={anchorOnChain}
                  disabled={loading || isConfirming}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {loading || isConfirming ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isConfirming ? "Confirming..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      Anchor Research (0.1 MATIC)
                    </>
                  )}
                </button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Brain className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">AI Verification</h2>
                <p className="text-slate-400 mb-6">Analyze quality and originality</p>
                
                <div className="badge badge-success mb-8">
                  <CheckCircle className="w-3 h-3" />
                  Research ID: #{state.researchId}
                </div>

                <button
                  onClick={runAnalysis}
                  disabled={loading}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Run Analysis
                    </>
                  )}
                </button>
              </div>
            )}

            {currentStep === 5 && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-violet-600/20 border border-amber-500/30 flex items-center justify-center animate-pulse-glow">
                  <Sparkles className="w-10 h-10 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Mint Research Passport</h2>
                <p className="text-slate-400 mb-6">Create your verified iNFT</p>

                {state.analysisResult && (
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                    <div className="stat-card p-4">
                      <p className="text-2xl font-bold text-emerald-400">{state.analysisResult.qualityScore}</p>
                      <p className="text-xs text-slate-500">Quality Score</p>
                    </div>
                    <div className="stat-card p-4">
                      <p className="text-2xl font-bold text-cyan-400">{state.analysisResult.plagiarismPercentage}%</p>
                      <p className="text-xs text-slate-500">Plagiarism</p>
                    </div>
                    <div className="stat-card p-4">
                      <p className="text-2xl font-bold text-violet-400">{state.analysisResult.integrityVerdict}</p>
                      <p className="text-xs text-slate-500">Verdict</p>
                    </div>
                  </div>
                )}

                {state.tokenId ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-8 max-w-md mx-auto glow-violet"
                  >
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                    <h3 className="text-xl font-bold text-emerald-400 mb-2">iNFT Minted Successfully!</h3>
                    <p className="text-slate-400 mb-4">Token ID: #{state.tokenId}</p>
                    <div className="badge badge-success">
                      <Zap className="w-3 h-3" />
                      Gasless - You paid $0
                    </div>
                  </motion.div>
                ) : (
                  <button
                    onClick={mintPassport}
                    disabled={loading}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Mint iNFT (Gasless)
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
