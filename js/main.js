
// 함수로 감싼 이유
// 함수 외에서 변수를 선언하게 되면 전역 변수로 선언
// 어디서든 접근이 가능해지기 때문에 변수에 영향줄 가능성이 있기 때문에
// 지역 변수로 해준다.
(() => {
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
    window.addEventListener('resize', setLayout);
    setLayout();
})();
