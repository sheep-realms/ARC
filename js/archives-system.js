class ArchivesSystem {
    constructor() {
        this.data = archives;
        this.path = [];
    }

    getData(path = []) {
        let d = this.data;
        path.forEach(e => {
            if (this.data[e]) {
                if (d[e]?.children) {
                    d = d[e].children;
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        });
        return d;
    }

    goto(path = []) {
        if (path.length == 1 && path[0] == '') path = [];
        this.path = path;
        return {
            path: this.path,
            data: this.getData(path)
        }
    }

    into(index) {
        this.path.push(index);
        return {
            path: this.path,
            data: this.getData(this.path)
        }
    }
}