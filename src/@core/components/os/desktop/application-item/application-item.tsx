import { styled } from "@mui/material";
import { motion, useMotionValue } from "framer-motion";
import { useGridSize } from "../../../../hooks/use-grid-size";

interface ApplicationItemProps {
    gridPosition: [number, number];
}

export function ApplicationItem(props: ApplicationItemProps) {
    const { gridPosition } = props;

    const gridSize = useGridSize();
    const x = useMotionValue(gridPosition[0] * gridSize.width);
    const y = useMotionValue(gridPosition[1] * gridSize.height);

	return (
        <motion.div
            drag
            onDragEnd={(foo) => {
                console.log(foo);
            }}
            dragTransition={{
                power: 0
            }}
            style={{
                position: "absolute",
                width: gridSize.width,
                height: gridSize.height,
                x: x,
                y: y
            }}
        >
            <Wrapper/>
        </motion.div>
	);
}

const Wrapper = styled<"div">("div")({
    width: 50,
    height: 50,
    backgroundImage: `url("./application-icons/blank-icon.png")`,
    backgroundSize: "cover"
})
