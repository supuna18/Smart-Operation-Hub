import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [id, onClose]);

    const icons = {
        success: <FiCheckCircle className="text-emerald-500" size={20} />,
        error: <FiAlertCircle className="text-rose-500" size={20} />,
        info: <FiInfo className="text-blue-500" size={20} />
    };

    const styles = {
        success: "border-emerald-100 bg-emerald-50/80 backdrop-blur-md text-emerald-900",
        error: "border-rose-100 bg-rose-50/80 backdrop-blur-md text-rose-900",
        info: "border-blue-100 bg-blue-50/80 backdrop-blur-md text-blue-900"
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-4 min-w-[320px] max-w-md p-4 rounded-2xl border shadow-lg ${styles[type]}`}
        >
            <div className="shrink-0">
                {icons[type]}
            </div>
            <div className="flex-1 text-sm font-semibold pr-2">
                {message}
            </div>
            <button
                onClick={() => onClose(id)}
                className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors text-black/40 hover:text-black/60"
            >
                <FiX size={16} />
            </button>
            <div className="absolute bottom-0 left-0 h-1 bg-black/5 w-full overflow-hidden rounded-b-2xl">
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className={`h-full ${
                        type === 'success' ? 'bg-emerald-500' :
                        type === 'error' ? 'bg-rose-500' :
                        'bg-blue-500'
                    }`}
                />
            </div>
        </motion.div>
    );
};

export default Toast;
