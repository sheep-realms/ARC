let ArcSys;
let hash = '#';
let hashChange = false;

function start() {
    ArcSys = new ArchivesSystem();
    if (location.hash != '') {
        hash = location.hash;
        load(ArcSys.goto(location.hash.substr(1).split(',')));
    } else {
        load(ArcSys.goto());
    }
}

function load(info) {
    $('#archives-content').html('');
    info.data.forEach((e, i) => {
        $('#archives-content').append(factoryElement(e, i));
    });

    hash = '#' + ArcSys.path.join(',');

    hashChange = true;
    location.assign(location.pathname + hash);
    hashChange = false;

    if (info.path.length != 0) {
        if (info.path[0] === '') return;
        let p = JSON.parse(JSON.stringify(info.path));
        p.pop();
        $('#archives-content').prepend(factoryElement(
            {
                title: "../",
                goto: p.join(',')
            },
            -1
        ));
    }
}

function factoryElement(obj, index) {
    let ci = childrenCount(obj?.children);
    return `<div
        class="
            archives-item
            ${obj?.children ? 'archives-item-folder' : ''}
        "
        data-index="${index}"
        ${obj?.goto != undefined ? `data-goto="${obj.goto}"` : ''}
    >
        <div class="title">
            ${obj?.children ? obj.title + ' /' : obj.title}
        </div>
        ${
            obj?.children || obj?.goto != undefined ?
            `<div class="action">
                ${ci[0] + ci[1] > 0 ? '<span class="children-length">' + (ci[0] + ' 个分类，') + ci[1] + ' 个项目</span>' : ''}
            </div>` :
            `<div class="action">
                <button
                    class="fh-button fh-ghost"
                    ${obj?.github ? 'data-github="' + obj.github + '"' : 'disabled'}
                >
                    GitHub
                </button>
                <button
                    class="fh-button"
                    ${obj?.demo ? 'data-demo="' + obj.demo + '"' : 'disabled'}
                >
                    Demo
                </button>
            </div>`
        }
    </div>`;
}

function childrenCount(obj) {
    let i = [0, 0];
    if (obj == undefined) return i;
    obj.forEach(e => {
        if (e?.children) {
            i[0]++;
        } else {
            i[1]++;
        }
    });
    return i;
}

$(document).on('click', '.archives-item-folder', function() {
    let d = ArcSys.into($(this).data('index'));
    load(d);
});

$(document).on('click', '.archives-item[data-goto]', function() {
    if ($(this).data('index') == -1) {
        return history.go(-1);
    }
    let g = String($(this).data('goto'));
    if (g == undefined) {
        load(ArcSys.goto());
    } else {
        load(ArcSys.goto(g.split(',')));
    }
});

$(document).on('click', 'button[data-github]:not([disabled])', function() {
    let url = $(this).data('github');
    if (url.substr(0,4) == 'http') {
        window.open(url);
    } else {
        window.open('https://github.com/sheep-realms/' + url);
    }
});

$(document).on('click', 'button[data-demo]:not([disabled])', function() {
    let url = $(this).data('demo');
    if (url.substr(0,4) == 'http') {
        window.open(url);
    } else {
        window.open('https://sheep-realms.github.io/' + url);
    }
});

window.addEventListener("popstate", function(e) {
    if (location.hash != hash && !hashChange) {
        hash = location.hash;
        load(ArcSys.goto(location.hash.substr(1).split(',')));
    }
}, false);