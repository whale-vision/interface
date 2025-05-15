import { Button } from '../button/button';
import styles from './prompt.scss';
import { useState } from 'react';

styles;

interface PromptProps {
	title: string;
	message: string;
	onConfirm: (value: string) => void;
	onCancel: () => void;
}

export const Prompt = ({
	title,
	message,
	onConfirm,
	onCancel,
}: PromptProps) => {
	const [value, setValue] = useState("");

	return (
		<div className={"promptOverlay"} 
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					onConfirm(value);
				}
			}}
			tabIndex={0}>
			<div className={"prompt"}>
				<div className={"promptContent"}>
					<h1 className={"promptTitle"}>{title}</h1>
					<p>{message}</p>
					<input
						type="text"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						autoFocus
					/>
					<div className={"promptButtons"}>
						<Button altColour onClick={onCancel}>Cancel</Button>
						<Button onClick={() => onConfirm(value)}>Confirm</Button>
					</div>
				</div>
			</div>
		</div>
	);
};