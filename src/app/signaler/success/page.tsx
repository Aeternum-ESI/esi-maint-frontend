"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Confetti from "react-confetti";

export default function SuccessPage() {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });
    const [confettiActive, setConfettiActive] = useState(true);

    useEffect(() => {
        // Set window size for confetti
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Stop confetti after 5 seconds
        const timer = setTimeout(() => setConfettiActive(false), 5000);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            {confettiActive && (
                <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />
            )}

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2,
                    }}
                    className="mb-6 inline-block"
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <motion.svg
                            className="w-12 h-12 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </motion.svg>
                    </div>
                </motion.div>

                <motion.h1
                    className="text-3xl font-bold text-gray-800 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Thank You!
                </motion.h1>

                <motion.p
                    className="text-lg text-gray-600 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    Your problem report has been successfully submitted. We appreciate your feedback and will look into
                    this issue as soon as possible.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-sm text-gray-500 mb-8"
                >
                    Your contribution helps us improve our services for everyone. We'll be in touch if we need
                    additional information.
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2 }}>
                    <Link
                        href="/"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105"
                    >
                        Return to Homepage
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
