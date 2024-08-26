import React from "react";
import { motion } from "framer-motion";
import "./snackbar.css";

interface SnackbarProps {
	message: string;
	onClose?: () => void;
	severity?: "error" | "warning" | "info" | "success" | "";
}

const Snackbar: React.FC<SnackbarProps> = ({
	message,
	onClose,
	severity = "error",
}) => {
	const handleClose = () => {
		if (onClose) {
			onClose();
		}
	};

	const getBackgroundColor = () => {
		switch (severity) {
			case "error":
				return "red";
			case "warning":
				return "orange";
			case "info":
				return "blue";
			case "success":
				return "green";
			default:
				return "red";
		}
	};

	return (
		<motion.div
			className="snackbar"
			animate={{
				x: [0, -5, 5, -5, 5, 0],
				transition: {
					duration: 0.5,
				},
			}}
			style={{ backgroundColor: getBackgroundColor() }}
		>
			<span className="closebtn" onClick={handleClose}>
				&times;
			</span>
			<p className="snackbar-text">{message}</p>
		</motion.div>
	);
};

export default Snackbar;