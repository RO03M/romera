import { IconButton } from "../../../../components/icon-button/icon-button";
import { ResetIcon } from "../../../../components/icons/reset";

export function LeftSide() {
	return (
		<div style={{ flex: 1 }}>
			<IconButton
				icon={<ResetIcon size={15} />}
				onClick={() => {
					const wipe = confirm("Confirming this will wipe the filesystem and download the default one. Are you sure about this?\n\nAny data you have created will be erased and you can't get it back!")

					if (!wipe) {
						return;
					}

					indexedDB.deleteDatabase("romos-fs");
        			location.reload();
				}}
			/>
		</div>
	);
}
