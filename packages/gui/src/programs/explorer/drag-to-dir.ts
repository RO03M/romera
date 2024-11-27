import { getFilesFromDataTransferItems } from "../../@core/utils/datatransfer-to-files";
import { safe } from "../../@core/utils/safe";
import { filesystem } from "../../app";

export async function addFilesFromDragToDir(event: DragEvent, cwd: string) {
    event.preventDefault();

    if (event.dataTransfer === null) {
        return;
    }

    const filedrag = event.dataTransfer.getData("filedrag");

    if (filedrag !== "") {
        const { error, data: parsedFiledrag } = safe(() => JSON.parse(filedrag));

        if (error) {
            console.error("Couldn't decode filedrag object", error, filedrag);
            return;
        }

        if (!("name" in parsedFiledrag)) {
            console.error("Name is not present in filedrag object", parsedFiledrag);
            return;
        }
        return;
    }

    const data = await getFilesFromDataTransferItems(event.dataTransfer.items);
    for (const entries of data) {
        filesystem.hydrate(entries, cwd);
    }
}