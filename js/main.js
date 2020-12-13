
// 함수로 감싼 이유
// 함수 외에서 변수를 선언하게 되면 전역 변수로 선언
// 어디서든 접근이 가능해지기 때문에 변수에 영향줄 가능성이 있기 때문에
// 지역 변수로 해준다.
(() => {
    let yOffset = 0;
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)

    const scenInfo = [
        {
            type: 'sticky', // 세션이 고정된 위치
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 셋팅
            scrollheight: 0, // section 0 scroll 높이
            objs: {
                container: document.querySelector('#scroll-section-0')
            }
        },
        {
            type: 'nomal', // 세션이 일반 스크롤 흐름
            heightNum: 5,
            scrollheight: 0, // section 1 scroll 높이
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            type: 'sticky',
            heightNum: 5,
            scrollheight: 0, // section 2 scroll 높이
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {
            type: 'sticky',
            heightNum: 5,
            scrollheight: 0, // section 3 scroll 높이
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];

    function setLayout() {
        // 각 스크롤 세션의 높이 셋팅

        for (const info of scenInfo) {
            info.scrollheight = info.heightNum * window.innerHeight;
            info.objs.container.style.height = `${info.scrollheight}px`
        }
    }


    function scrollLoop() {
        // 현 스크롤 위치 ( yOffSet ) 과 각 세션의 높이 비교 시작 유무 확인
        prevScrollHeight = 0; // 초기화
        for(let i = 0; i < currentScene; i++) {
            prevScrollHeight += scenInfo[i].scrollheight;
        }

        if (yOffset > prevScrollHeight + scenInfo[currentScene].scrollheight) {
            currentScene++;
        }

        if(yOffset < prevScrollHeight) {
            if (currentScene === 0) return; // 창 바운스되면서 - 되는 것 방지
            currentScene--;
        }
    }
    window.addEventListener('resize', setLayout);
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset // 현 스크롤 위치
        scrollLoop();
    })
    setLayout();
})();
