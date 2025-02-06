import { useProcesses } from "../@core/hooks/use-processes";
import classes from "./process-manager.module.css";

export function ProcessManager() {
    const processes = useProcesses();
        
    return (
        <div className={classes.teste}>
            <table>
                <thead>
                    <tr>
                        <th>pid</th>
                        <th>command</th>
                        <th>tty</th>
                        <th>cwd</th>
                    </tr>
                </thead>
                <tbody>
                    {processes.map((process) => (
                        <tr
                            key={`process-manager-row-${process.pid}`}
                            id={`process-manager-row-${process.pid}`}
                        >
                            <td>{process.pid}</td>
                            <td>{process.command}</td>
                            <td>{process.tty}</td>
                            <td>{process.cwd}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}