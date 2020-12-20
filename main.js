import "@babel/polyfill";

if (QRCode) {
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: "https://t.zsxq.com/ujyFee6",
        width: 72,
        height: 72,
        colorDark: "#0f3126",
        colorLight: "#eeeeee",
        correctLevel: QRCode.CorrectLevel.H
    });
};

//console.log(qrcode)

let items = [];
//items =

//new LeaderLine(LeaderLine.mouseHoverAnchor(document.querySelector('.tag')), document.querySelector('#qrcode'));

let topics = ['未来城市', '视频', '工具', '人工智能辅助设计',
    '智能设计', '色彩', '字体', '游戏', '因果关系', '归因', '数据科学',
    '前端智能', '虚拟偶像', '艺术', '体育', '舞蹈', '摄影', '法律',
    '美食', '社交', '生物黑客', '教育', '职业规划', 'AR', 'VR',
    '谷歌', '设计', '宁静技术', '三维重建', '智能产品'
];
let topicsDom = document.getElementById("topics");
Array.from(topics, t => {
    let c = createTag(t);
    // c.addEventListener("click", async(e) => {
    //     e.preventDefault();
    //     await getDataAndStart(t);
    // });
    topicsDom.appendChild(c);
});

async function getDataAndStart(tag) {
    var items = await getData(tag);
    start(items);
};

//getDataAndStart();


//随机重排
let oldItems = Array.from(document.querySelectorAll('.item'), t => t);
let newItems = [];
let len = oldItems.length;
for (let i = 0; i < len; i++) {
    let index = Math.floor(Math.random() * oldItems.length);
    newItems.push(oldItems[index]);
    oldItems.splice(index, 1);
};
document.body.querySelector('main').innerHTML = "";
Array.from(newItems, t => document.body.querySelector('main').appendChild(t));

function start(items) {

    let tags = {};
    items.forEach(item => {
        item.tags.forEach(t => {
            tags[t] = tags[t] ? (tags[t] + 1) : 1;
        });
    });
    let tags_list = [];
    for (let t in tags) {
        if (tags[t]) {
            tags_list.push({
                key: t,
                value: tags[t]
            });
        }
    };
    tags_list = tags_list.sort((b, a) => {
        return a.value - b.value
    });
    tags_list = Array.from(tags_list, t => {
        return t.key;
    }).slice(0, 10);


    let tagsDom = document.querySelector("#tags");
    tagsDom.innerHTML = "";

    Array.from(tags_list, t => {
        t = createTag(t, (e) => {
            console.log(e.target.innerText);
            let text = e.target.innerText;
            Array.from(document.querySelectorAll(".content"), c => {
                c.parentElement.style.display = "none";
            });
            Array.from(document.querySelectorAll(".content"), c => {
                if (c.querySelector("div[data-tag=" + text + "]")) {
                    c.parentElement.style.display = "flex";
                    _hmt.push(['_trackEvent', '标签', 'click', text, 1]);
                };
            });

        });
        tagsDom.appendChild(t);
    });

    /*document.getElementById("tags_all").addEventListener("click", (e) => {
        e.preventDefault();
        Array.from(document.querySelectorAll(".content"), c => {
            c.parentElement.style.display = "flex";
        });
    })
    */

    let cardsDom = document.querySelector("#cards");
    cardsDom.innerHTML = "";

    items = items.sort((b, a) => {
        return (a.likes_count + a.comments_count) - (b.likes_count + b.comments_count)
    });

    Array.from(items, item => {
        item.hot_index = item.likes_count / (1 + items[0].likes_count);
        if (item.title != "" || item.urls.length > 0) {
            //console.log(item)
            let c = createCard(item);
            cardsDom.appendChild(c);
        }

    });
}


function createCard(item) {
    let c = document.createElement("a");
    c.className = "card";
    //c.href = item.url;
    c.setAttribute("data-item", JSON.stringify(item));
    c.innerHTML = `
    ${item.base64?createImage(item.base64):""}
    <div class="main">
        <div class="content" style="${item.hot_index>0?'':'width:100%'}">
        ${createTags(item.tags)}
        </div>
      ${item.hot_index>0?`<div class="action">${item.hot_index.toFixed(2)}</div>`:''}
    </div>
    ${createTitle(item.title)}
      ${item.urls?createURLs(item.urls):''}
      `;
    c.addEventListener("click", (e) => {
        e.preventDefault();
        if (!e.target.getAttribute('data-tag')) {
            _hmt.push(['_trackEvent', '卡片', 'click', item.title, 1]);
            //console.log(e.target.getAttribute('data-tag'))
            /*let a = confirm(`跳转至${item.url}`);
            if (a == true) {
                window.location.href = item.url;
            };
            */
        } else {
            _hmt.push(['_trackEvent', '标签', 'click', e.target.getAttribute('data-tag'), 1]);
        }

    })
    return c;
}

function createImage(url){

   return `<img class="image" src="${url}" onerror="handleImageError(this)"/>`
    
}

function handleImageError(e){
    e.style.display="none";
}

function createHot(s) {
    return `<div class="hot_index">${s}</div>`;
}

function createTitle(t) {
    return `<h4 class="title">${t.replace(/\n/ig,'<br>').slice(0,140)+(t.length>140?'...':'')}</h4>`
}

function createTags(tags) {
    return `<div class="tags">${Array.from(tags,t=>{
        return createTag(t).outerHTML}).join("")}</div>`
}

function createTag(tag) {
    let c = document.createElement("div");
    c.className = "tag";
    c.innerHTML = `<div data-tag="${tag}">${tag}</div>`;
    return c;
}

function createURLs(urls){
    return `<div class="urls">${Array.from(urls,u=>{
        return createURL(u.url,u.title)
    }).join("")}</div>`
};

function createURL(url,title){
    return `<a class="url" href="${url}" target="_blank">${title}</a>`;
}

async function getData(t){
return new Promise(function(resolve, reject){
    fetch('data/'+t+'.json').then(r=>{
        return  r.json()
    }).then(r=>{
        //console.log(r);
        resolve(r);
    });
})
};


//从知识星球导出
/*
var res = [];
Array.from(temp1, t => {
    res.push({
        title: (() => {
            let ts = t.title.split("#");
            return ts[ts.length - 1].trim();
        })(),
        tags: (() => {
            let ts = t.title.split("#");
            ts = ts.slice(0, ts.length - 1);
            var tags = [];
            Array.from(ts, t => {
                t = t.trim();
                if (t) {
                    tags.push(t)
                };
            })
            return tags;
        })(),
        create_time:t.create_time,
        likes_count:t.likes_count,
        comments_count:t.comments_count,
        id: t.topic_id,
        url: 'https://wx.zsxq.com/dweb2/index/topic_detail/' + t.topic_id
    })
});

//tag 页面导出 主题对应的素材; talk.files 文件待处理

res = [];
temp1.forEach((t, i) => {
var talk = t.talk,
id = t.topic_id;
//if (!talk){console.log(t)};
if (talk && talk.owner.name == 'shadow' && t.sticky==false) {
var text = talk.text,
    images = talk.images;
var div = document.createElement('div');
div.innerHTML = text;
//console.log(div.querySelectorAll('e[type=hashtag]'));
var tags = div.querySelectorAll('e[type=hashtag]');
if (tags) {

    tags = Array.from(tags, t => {
        t=decodeURIComponent(t.title);
        return t.slice(1,t.length-1);
    })
}
var urls = div.querySelectorAll('e[type=web]');
if (urls) {
    urls = Array.from(urls, u => {

        return { url: decodeURIComponent(u.getAttribute('href')), title: decodeURIComponent(u.getAttribute('title').replace(/\+/ig, ' ')) }
    })
}

res.push({
    id: id,
    title: div.innerText.trim(),
    likes_count: t.likes_count,
    comments_count: t.comments_count,
    readers_count: t.readers_count,
    reading_count: t.reading_count,
    rewards_count: t.rewards_count,
    images: images,
    tags: tags,
    urls: urls,
    create_time: t.create_time
})
}
})


//导出tags
var res=Array.from(document.querySelectorAll('.tag-container'),ts=>{
     var tags=Array.from(ts.children,t=>t.innerText)
    return tags
})
*/