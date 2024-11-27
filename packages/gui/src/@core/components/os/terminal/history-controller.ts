export class HistoryController {
    public history: string[] = [];
    private index = 0;
    
    public add(command: string) {
        if (command.length === 0) {
            return;
        }
        this.history.unshift(command);
    }

    public current() {
        return this.history[this.index] ?? "";
    }

    public next() {
        if (this.index < this.history.length) {
            this.index++;
        }
        
        return this.current();
    }

    public resetIndex() {
        this.index = 0;
    }

    public previous() {
        if (this.index >= 0) {
            this.index--;
        }

        return this.current();
    }
}