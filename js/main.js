
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
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount: 300,
                imageSequence: [0, 299],
                canvas_opacity: [1, 0, { start: 0.9, end: 1}],
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
            scrollheight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
                canvas: document.querySelector('#video-canvas-1'),
                context: document.querySelector('#video-canvas-1').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount: 960,
                imageSequence: [0, 959],
                canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
                canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in : [30, 0, { start: 0.6, end: 0.65 }],
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
            scrollheight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
                canvas: document.querySelector('.img-blend-canvas'),
                context: document.querySelector('.img-blend-canvas').getContext('2d'),
                imagesPath: [
                    './images/blend-image-1.jpg',
                    './images/blend-image-2.jpg',
                ],
                images: []
            },
            values: {
                rect1X: [0, 0, { start: 0, end: 0}],
                rect2X: [0, 0, { start: 0, end: 0}],
                blendHeight: [ 0, 0, {start: 0, end: 0}],
                canvas_scale: [ 0, 0, {start: 0, end: 0}],
                rectStartY: 0
            }
        }
    ];

    function setCanvasImages() {
        let imgElem;
        for (let i = 0; i < scenInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
            scenInfo[0].objs.videoImages.push(imgElem);
        }

        let imgElem2;
        for (let i = 0; i < scenInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image();
            imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
            scenInfo[2].objs.videoImages.push(imgElem2);
        }

        let imgElem3
        for(let i = 0; i < scenInfo[3].objs.imagesPath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src = scenInfo[3].objs.imagesPath[i];
            scenInfo[3].objs.images.push(imgElem3);
        }
    }
    setCanvasImages();

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

        const heightRatio = window.innerHeight / 1080;
        
        // % : 자기 크기의 %
        // -50% 자기 크기의 50%로 -방향으로 이동
        // scale은 원래 자신의 크기로 left right 등 적용
        scenInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`
        scenInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`
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
        switch (currentScene) {
            case 0:
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

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

                let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

                if (scrollRatio <= 0.5) {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                } else {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }
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

                // currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
                if (scrollRatio > 0.9) {
                    const objs = scenInfo[3].objs;
                    const values = scenInfo[3].values;
                    const widthRatio = window.innerWidth / objs.canvas.width;
                    const heightRatio = window.innerHeight / objs.canvas.height;
                    let canvasScaleRatio;

                    if (widthRatio <= heightRatio) {
                        // 캔버스보다 브라우저 창이 홀쭉한 경우
                        canvasScaleRatio = heightRatio;
                    } else {
                        // 캔버스보다 브라우저 창이 납작한 경우
                        canvasScaleRatio = widthRatio;
                    }

                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                    objs.context.fillStyle = 'white';
                    objs.context.drawImage(objs.images[0], 0, 0);

                    // 캔버스 사이즈에 맞춰 가정한 innerwidth와 innerHeight
                    // innerWidth -> scroll영역 때문에 계산이 잘 안맞음
                    // document.body.offsetwidth
                    const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                    const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                    const whiteRectWidth = recalculatedInnerWidth * 0.15;
                    values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                    values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                    // 좌우 흰색 박스 그리기
                    // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height)
                    // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height)
                    objs.context.fillRect(
                        Math.round(values.rect1X[0]),
                        0,
                        Math.round(whiteRectWidth),
                        objs.canvas.height
                    );
                    objs.context.fillRect(
                        Math.round(values.rect2X[0]),
                        0,
                        Math.round(whiteRectWidth),
                        objs.canvas.height
                    );
                }
                break;
            case 3:
                // 가로/세로 모두 꽉 차게 하기 위해 여기서 셋팅(계산 필요)
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;
                let step = 1;
                if (widthRatio <= heightRatio) {
                    // 캔버스보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                } else {
                    // 캔버스보다 브라우저 창이 납작한 경우
                    canvasScaleRatio = widthRatio;
                }

                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = 'white';
                objs.context.drawImage(objs.images[0], 0, 0);

                // 캔버스 사이즈에 맞춰 가정한 innerwidth와 innerHeight
                // innerWidth -> scroll영역 때문에 계산이 잘 안맞음
                // document.body.offsetwidth
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
                if(!values.rectStartY) {
                    // getBoundingClientRect() canvas의 크기 정보
                    // values.rectStartY = objs.canvas.getBoundingClientRect().top;
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }

                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // 좌우 흰색 박스 그리기
                // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height)
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height)
                objs.context.fillRect(
                    parseInt(calcValues(values.rect1X, currentYOffset)),
                    0,
                    Math.round(whiteRectWidth),
                    objs.canvas.height
                );
                objs.context.fillRect(
                    parseInt(calcValues(values.rect2X, currentYOffset)),
                    0,
                    Math.round(whiteRectWidth),
                    objs.canvas.height
                );

            //     if (캔버스가 블우저 상단에 닿지 않았다면) {
            //         step = 1;
            // } else {
            //         step = 2;
            //         if() {
            //             step = 3;
            //         }
            // }
                if (scrollRatio < values.rect1X[2].end) {
                    step = 1;
                    objs.canvas.classList.remove('sticky');
                } else {
                    step = 2;
                    // 이미지 블랜드
                    // objs.context.drawImage(img, x, y, width, height);
                    values.blendHeight[0] = 0;
                    values.blendHeight[1] = objs.canvas.height;
                    values.blendHeight[2].start = values.rect1X[2].end;
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
                    const blendHeight = calcValues(values.blendHeight, currentYOffset);

                    objs.context.drawImage(objs.images[1],
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
                    );

                    objs.canvas.classList.add('sticky');
                    objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`

                    if(scrollRatio > values.blendHeight[2].end) {
                        values.canvas_scale[0] =canvasScaleRatio;
                        values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);

                        values.canvas_scale[2].start = values.blendHeight[2].end;
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
                    }
                }
                break;
        }
    }

    function calcValues(values, currentYOffset) {
        let rv;
        // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = scenInfo[currentScene].scrollheight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
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
    window.addEventListener('load', () => {
        setLayout();
        scenInfo[0].objs.context.drawImage(scenInfo[0].objs.videoImages[0], 0, 0);
    });
    
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset // 현 스크롤 위치
        scrollLoop();
    })
})();
