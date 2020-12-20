
// 함수로 감싼 이유
// 함수 외에서 변수를 선언하게 되면 전역 변수로 선언
// 어디서든 접근이 가능해지기 때문에 변수에 영향줄 가능성이 있기 때문에
// 지역 변수로 해준다.
(() => {
    let yOffset = 0;
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작되는 순간 true
    const scenInfo = [
        {
            type: 'sticky', // 세션이 고정된 위치
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 셋팅
            scrollheight: 0, // section 0 scroll 높이
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
            },
            values: {
                messageA_opacity_in: [0, 1, {start: 0.1, end: 0.2}],
                // messageB_opacity_in: [0, 1, {start: 0.3, end: 0.4}],
                // 스크롤 시 살짜 올라가는 효과
                // 20 : 단위 %, 시작점
                // 20% 정도 내렸다가 0으로 다시 올림
                messageA_translateY_in: [20, 0, {start: 0.1, end: 0.2}],

                messageA_opacity_out: [1, 0, {start: 0.25, end: 0.3}],
                messageA_translateY_out: [0, -20, {start: 0.25, end: 0.3}],
            }
            // 스크롤에 따른 애니메이션 벨류값
            // 스크롤에 따른 변수 : opacity, translate: transfor ( 투명도, y값이동 )

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
        let totalScrollHeight = 0;
        yOffset = window.pageYOffset;
        // 각 스크롤 세션의 높이 셋팅
        for (const info of scenInfo) {
            info.scrollheight = info.heightNum * window.innerHeight;
            info.objs.container.style.height = `${info.scrollheight}px`

        }

        for(let i = 0; i < scenInfo.length ; i++) {
            totalScrollHeight += scenInfo[i].scrollheight;
            if(totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function playAnimation() {
        const objs = scenInfo[currentScene].objs;
        const values = scenInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        // 현재 씬의 scrollHeight
        const scrollHeight = scenInfo[currentScene].scrollheight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
                const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);
                const messageA_translateY_in = calcValues(values.messageA_translateY_in, currentYOffset);
                const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);
                // 0.22 : opacity가 나타나고 사라지는 사이의 중심값.
                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = messageA_opacity_in;
                    objs.messageA.style.transform = `translateY(${messageA_translateY_in}%`;
                } else {
                    console.log('out');
                    // out
                    objs.messageA.style.opacity = messageA_opacity_out;
                    objs.messageA.style.transform = `translateY(${messageA_translateY_out}%`;
                }


                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    function calcValues(values, currentYOffset) {
        let rv
        const scrollHeight = scenInfo[currentScene].scrollheight;
        // 현재 씬(스코롤섹션)에서 스크롤된 범위를비율로 구하기
        const scrollRatio = currentYOffset / scrollHeight;
        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            // start end 사이 height
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }

        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }


        return rv;
    }

    function scrollLoop() {
        // 현 스크롤 위치 ( yOffSet ) 과 각 세션의 높이 비교 시작 유무 확인
        prevScrollHeight = 0; // 초기화
        enterNewScene = false;

        for(let i = 0; i < currentScene; i++) {
            prevScrollHeight += scenInfo[i].scrollheight;
        }

        if (yOffset > prevScrollHeight + scenInfo[currentScene].scrollheight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if(yOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentScene === 0) return; // 창 바운스되면서 - 되는 것 방지
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (enterNewScene) return;
        playAnimation()
    }
    window.addEventListener('resize', setLayout);
    // window.addEventListener('DOMContentLoaded', setLayout); 와 차이
    // load는 html 태그, 이미지, 동영상 등 모든 요소가 로드가 완료된 후 실행
    // DOMConetentLoaded는 DOM요소 즉 html요소만 로드가 완료된 후 실행
    window.addEventListener('load', setLayout);
    
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset // 현 스크롤 위치
        scrollLoop();
    })
})();
