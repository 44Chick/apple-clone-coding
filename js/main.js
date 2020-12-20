
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
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                // 스크롤 시 살짜 올라가는 효과
                // 20 : 단위 %, 시작점
                // 20% 정도 내렸다가 0으로 다시 올림
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
            }
            // 스크롤에 따른 애니메이션 벨류값
            // 스크롤에 따른 변수 : opacity, translate: transfor ( 투명도, y값이동 )

        },
        {
            type: 'nomal', // 세션이 일반 스크롤 흐름
            // heightNum: 5, normal 에서는 필요없음.
            scrollheight: 0, // section 1 scroll 높이
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin')
            },
            values: {
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
                messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
                messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
                messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
                messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
                messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
                messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
                messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
                messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
                messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
                messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
                pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
            }
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption')
            },
            values: {

            }
        }
    ];

    function setLayout() {
        let totalScrollHeight = 0;
        yOffset = window.pageYOffset;
        // 각 스크롤 세션의 높이 셋팅
        for (const info of scenInfo) {

            if (info.type === 'sticky') {
                info.scrollheight = info.heightNum * window.innerHeight;
            } else if (info.type === 'normal') {
                // sticky가 아닌 경우 스크롤에 따른 애니메이션이 없으니, 해당 div영역 만큼만
                // 높이를 잡아준다.
                info.scrollheight = info.objs.container.offsetHeight;
            }
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


        // translateY를 사용하진 않고, translate3d를 사용한 이유
        // 일단 translate3d는 y축 뿐만 아니라 x, z 방향도 조재
        // translate3d는 하드웨어 가속이 보장이 되기 때문에 퍼포먼스가 좋아지게 된다.
        // 이러한 이유로 사용
console.log(currentScene)
        switch (currentScene) {
            case 0:
                // console.log('0 play');
                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }

                break;
            case 2:
                if (scrollRatio <= 0.32) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.67) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }

                if (scrollRatio <= 0.93) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }

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
