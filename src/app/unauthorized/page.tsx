"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, Lock, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="bg-red-50 p-8 flex justify-center">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spr  ing",
                            stiffness: 100,
                            damping: 15,
                            delay: 0.2,
                        }}
                    >
                        <div className="relative">
                            <Shield className="h-28 w-28 text-red-100 stroke-[1.5]" />
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: [0, -5, 5, -5, 0] }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.6,
                                    ease: "easeInOut",
                                }}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            >
                                <Lock className="h-12 w-12 text-red-500" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                <div className="p-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">Access Denied</h1>
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            <p className="text-amber-700 text-base font-medium">
                                You don't have permission to access this page
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <p className="text-gray-600 text-base text-center">
                                This might be because your account doesn't have the required permissions or this
                                resource is restricted for security reasons.
                            </p>
                        </div>

                        <div className="flex flex-row justify-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push("/")}
                                className="px-8 py-6 h-auto text-base"
                            >
                                Go to Homepage
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => router.back()}
                                className="px-8 py-6 h-auto text-base text-gray-500"
                            >
                                Go Back
                            </Button>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="bg-gray-50 p-5 text-center"
                >
                    <p className="text-sm text-gray-500">
                        If you believe this is an error, please contact the system administrator.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
