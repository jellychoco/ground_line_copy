let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;

let userLang = location.pathname.substring(1,3);
const langList = ['kr','jp','en'];

let messageList = [];
let addMessageList = [];
let totalEventCount = 0;
let eventWords = [];

document.addEventListener('DOMContentLoaded', function() {
    if(userLang === 'ja')
        userLang = 'jp';
    else if(userLang === 'ko')
        userLang = 'kr';
    else
        userLang = 'en';

    // 초기 언어 선택 문자 변경 및 선택 레이어 활성화 처리    
    if(isMobile) {
        $('.language a.active').removeClass('active');
        $('.language a').each((i, k) => {
            if($(k).text() === userLang) {
                $(k).addClass('active');
        }})
    } else {
        $('.lang .nowLang li p').html(userLang.toUpperCase());
        $('.langList li a.active').removeClass('active');
        $('.langList li a').each((i, k) => {
            if($(k).text() === userLang.toUpperCase()) {
                $(k).addClass('active');
        }}) 
    }

     // 다국어 처리
    i18next
    .use(i18nextXHRBackend)
    .init({
        lng: userLang,
        fallbackLng: userLang,
        backend: {
            loadPath: `/asset/messages/${isMobile ? 'm.' : ''}message.{{lng}}.json`
        },
        // debug: true // 개발시 디버깅을 위한 옵션
    }, (err, t) => {
        if(err) {
            console.error(err);
            return;
        }
        updateLanguage();
    });

    // 언어 변경 클릭 시
    $(document).on('click', '.langList li a', function() {
        let selected = $(this).text().toLowerCase().replace(/kr/gi,"ko").replace(/jp/gi,"ja");
        location.href =`/${selected}/index.html`;
        // $('.lang .nowLang a.active').removeClass('active');
        // $(this).addClass('active');
    });

    // 모바일 언어 변경 클릭 시
    $(document).on('click', '.language a', function() {
        let selected = $(this).text().toLowerCase().replace(/kr/gi,"ko").replace(/jp/gi,"ja");
        location.href =`/${selected}/m_index.html`;
        // $('.language a.active').removeClass('active');
        // $(this).addClass('active');
    });
    getEventData();
});

let page = 1;

function getEventData() {
    if(page == 1 || Math.ceil(totalEventCount/100) >= page) {
        $.ajax({
            url: `https://landpress-content.line-scdn.net/contents/projects/679/collections/korean/items?page=${page}&limit=100&_sort=date:DESC`,
            type: 'get',
            headers: {
                'Content-Type': 'application/json'
            },
            success: (data) => {
                if(data.total > 0) {
                    messageList = [...messageList, ...data.items];
                    totalEventCount = data.total;
      
                    if(userLang === "kr") {
                        if(page == 1) {
                            scrollMessageAnimation();
                        }
                        handleAllMessages();
                    }
                } 
            },
            error: (error) => {
                console.log(error);
            },
            complete: () => {
                page++;
            }
        });
    }
} 


// function getNextEventData() {
//     let totalPage = totalEventCount % 100 === 0 ? totalEventCount / 100 : totalEventCount / 100 + 1;

//     while(page < totalPage) {
//         $.ajax({
//             url: `https://landpress-content.line-scdn.net/contents/projects/679/collections/korean/items?page=${page}&limit=100&_sort=date:DESC`,
//             type: 'get',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             success: (data) => {
//                 if(data.items.length > 0) {
//                     addMessageList = data.items;
//                     messageList = messageList.concat(addMessageList);
//                     if(userLang === "kr") {
//                         scrollMessageAnimation();
//                         handleAllMessages();
//                     }
//                 } 
//             },
//             error: (error) => {
//                 console.log(error);
//             },
//             complete: () => {
//             }
//         });
//         page++;
//     }
// }



// 메시지 처리
function updateLanguage() {
    $('[data-i18n]').each((i, k) => {
        if(i18next.t($(k).attr('data-i18n')) !== $(k).attr('data-i18n')) {
            if(userLang === "jp") {
                $(k).html(i18next.t($(k).attr('data-i18n')).replace(/(([&<]+[/a-zA-Z][^>;]+[>;])|([a-zA-Z0-9]+))/gi, "$2<em class='familyKR'>$3</em>").replace(/<em class='familyKR'><\/em>/gi, ""));
            } else {
                $(k).html(i18next.t($(k).attr('data-i18n')));
            }
        }
    });
    // 언어변경 시 시퀀스 변경
    if(isMobile) {
        // handleMultiSequence(bookOpenImages, 19, 'mwbook', 'bookopen', true, 'jpg');
        handleMultiSequence(bookCloseImages, `${userLang === 'kr' ? 59 : 33}`, 'mwend', 'bookclose', true, 'jpg');
    } else {
        handleMultiSequence(bookOpenImages, 46, 'book', 'bookopen', true, 'jpg');
        handleMultiSequence(bookCloseImages, `${userLang === 'kr' ? 59 : 50}`, 'end', 'bookclose', true, `${userLang === 'kr' ? 'jpg' : 'png'}`);
    }
    
}

function scrollMessageAnimation () {
    
    let i = 0; // 불러올 메시지 수

    if(isMobile) { 
        let messageItemsDiv = document.querySelector('.msgBoxText'); 

        for (const item of messageList) {
            
            let msgItemP = document.createElement('p');
            let msgItemUserB = document.createElement('b');

            msgItemP.textContent = item.content;
            msgItemUserB.textContent = item.email;

            msgItemP.appendChild(msgItemUserB);
            messageItemsDiv.appendChild(msgItemP);

            if(++i > 10) {
                break;
            }
        };
    } else {
        let messageItemsDiv = document.querySelector('.messageItems'); 

        for (const item of messageList) {
            
            let msgItemP = document.createElement('p');
            msgItemP.className = 'msgItem';
            let msgItemUserB = document.createElement('b');

            msgItemP.textContent = item.content;
            msgItemUserB.textContent = item.email;

            msgItemP.appendChild(msgItemUserB);
            messageItemsDiv.appendChild(msgItemP);

            if(++i > 10) {
                break;
            }
        };
    };
 
    if (isMobile) {
        eventWords = gsap.utils.toArray('.msgBoxText p');
        moMessageAutoScroll();
    } else {
        eventWords = gsap.utils.toArray('.messageItems .msgItem');
        messageAutoScroll();
    }
}

let nowMessageCount = 0;
const messageAddSize = 10; // 최초 불러올 갯수 및 증가 횟수

// 전체 메시지 보기
function handleAllMessages () {

    // messageList.flat(totalEventCount / 100 + 1);

    if(nowMessageCount < messageList.length) { // 현재 메시지 수가 가지고 있는 메시지 리스트 수 보다 작은 경우만 실행
        for (let i = nowMessageCount; i < nowMessageCount+messageAddSize && i < messageList.length; i++) {

            if(isMobile) {

                let allMsgPopupList = document.querySelector('.allMsgPopupList');

                let allMsgPopupBox = document.createElement('div');
                allMsgPopupBox.className = 'allMsgPopupBox';

                let msgDate = document.createElement('b');

                let allMsgItem = document.createElement('div');
                allMsgItem.className = 'allMsgItem';

                let msgUser = document.createElement('b');
                let msgText = document.createElement('p');

                if(i === 0 || messageList[i-1].date.substring(0, 10) !== messageList[i].date.substring(0, 10)) {
                    let dateString = messageList[i].date.substring(5, 10).replace(/-/gi,'.');
                    
                    msgDate.textContent = `${dateString[0] === '0' ? dateString.slice(1) : dateString}`;
                } else {
                    msgDate.textContent = '';
                }

                msgUser.textContent = messageList[i].email || messageList[i].nickname;
                msgText.textContent = messageList[i].content;

                allMsgItem.appendChild(msgUser);
                allMsgItem.appendChild(msgText);


                if (msgDate.textContent !== '') {
                    allMsgPopupBox.appendChild(msgDate);
                }
                allMsgPopupBox.appendChild(allMsgItem);
                allMsgPopupList.appendChild(allMsgPopupBox); 
            } 
            else if(!isMobile) {

                let eventPopupInner = document.querySelector('.eventPopupInner');
                let eventPopupBox = document.createElement('div');
                eventPopupBox.className = 'eventPopupBox';

                let msgDate = document.createElement('div');
                msgDate.className = 'msgDate';
                let msgDateB = document.createElement('b');

                let msgTextfield = document.createElement('div');
                msgTextfield.className = 'msgTextfield';

                let msgTextBox = document.createElement('div');
                msgTextBox.className = 'msgTextBox';
                let msgUser = document.createElement('b');
                let msgText = document.createElement('p');

                if(i === 0 || messageList[i-1].date.substring(0, 10) !== messageList[i].date.substring(0, 10)) {
                    let dateString = messageList[i].date.substring(5, 10).replace(/-/gi,'.');
                    msgDateB.textContent = `${dateString[0] === '0' ? dateString.slice(1) : dateString}`;
                } else {
                    msgDateB.textContent = '';
                }
                
                msgUser.textContent = messageList[i].email || messageList[i].nickname;
                msgText.textContent = messageList[i].content;

                msgDate.appendChild(msgDateB);

                msgTextBox.appendChild(msgUser);
                msgTextBox.appendChild(msgText);
                msgTextfield.appendChild(msgTextBox);

                eventPopupBox.appendChild(msgDate);
                eventPopupBox.appendChild(msgTextfield);
                eventPopupInner.appendChild(eventPopupBox);  

            }
        }
        nowMessageCount += messageAddSize;
        if(nowMessageCount % 100 == 0) {
            getEventData();
        }
    }
};