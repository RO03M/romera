import { styled } from "@mui/material";
import { motion } from "framer-motion";
import { useGridSize } from "../../../../hooks/use-grid-size";
import { DragBackground } from "./drag-background";
import { useApplicationItemActions } from "./use-application-item-actions";

interface ApplicationItemProps {
	id: number;
	gridPosition: [number, number];
	name: string;
}

export function ApplicationItem(props: ApplicationItemProps) {
	const { id, name, gridPosition } = props;

	const { item, blur, itemComponentProps } = useApplicationItemActions({
		gridPosition,
		itemId: id
	});
	const gridSize = useGridSize();

	return (
		<>
			{blur.show && (
				<DragBackground
					x={blur.position.x}
					y={blur.position.y}
					isFree={blur.isFree}
				/>
			)}
			<motion.div
				drag
				{...itemComponentProps}
				dragTransition={{
					power: 0
				}}
				style={{
					position: "absolute",
					width: gridSize.width,
					height: gridSize.height,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					zIndex: blur.show ? 9999 : 0,
					x: item.position.x,
					y: item.position.y
				}}
			>
				<Wrapper />
				<span>{name}</span>
			</motion.div>
		</>
	);
}

const Wrapper = styled<"div">("div")({
	width: "50%",
	height: "50%",
	backgroundImage: `url("./application-icons/blank-icon.png")`,
	backgroundSize: "cover",
	backgroundPosition: "center"
});
