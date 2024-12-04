// var canvas = document.getElementById('canvas');
// if(document.querySelector('#canvas')) {
//   console.log('XX');
//   console.log(document.querySelector('#canvas'));
// }
/**
 *3D海洋效应与 Canvas2D
 * 您可以更改注释 "效果属性" 下的属性
 */
 function createDonutAnimation(containerId, gradientColors) {

    let $canvas = $(`#${containerId} canvas`),
        canvas = $canvas[0],
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });

    renderer.setSize($canvas.width(), $canvas.height());
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, $canvas.width() / $canvas.height(), 0.1, 1000);
    camera.position.z = 500;

    let shape = new THREE.TorusBufferGeometry(115, 13, 60, 160);

    let gradientCanvas = document.createElement('canvas');
    gradientCanvas.width = 256; // 根据需要调整大小
    gradientCanvas.height = 1;   // 高为1以创建线性渐变
    let ctx = gradientCanvas.getContext('2d');

    // 创建渐变
    let gradient = ctx.createLinearGradient(0, 0, gradientCanvas.width, 0);
    gradient.addColorStop(0, '#0064ff');     // 蓝色
    gradient.addColorStop(0.4, '#09b5eb');    // 青色
    gradient.addColorStop(0.6, '#0064ff');    // 在青色和蓝色之间的过渡
    gradient.addColorStop(0.9, '#7c04e5');     // 紫色过渡
    gradient.addColorStop(0, '#7c04e5');      // 紫色

    // 填充渐变
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);

    // 创建纹理
    let texture = new THREE.CanvasTexture(gradientCanvas);

    let material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 20,
        opacity: .96,
        transparent: true
    });
    let donut = new THREE.Mesh(shape, material);

    scene.add(donut);

    let lightTop = new THREE.DirectionalLight(0xFFFFFF, 0.3);
    lightTop.position.set(0, 200, 0);
    scene.add(lightTop);

    let frontTop = new THREE.DirectionalLight(0xFFFFFF, 0.4);
    frontTop.position.set(0, 0, 300);
    scene.add(frontTop);

    scene.add(new THREE.AmbientLight(0xbac5d9));

    let mat = Math.PI,
        speed = Math.PI / 120,
        forwards = 1;

    function twist(geometry, amount) {
        const positionAttribute = geometry.attributes.position;
        const array = positionAttribute.array;

        for (let i = 0; i < array.length; i += 3) {
            const x = array[i]; // x
            const y = array[i + 1]; // y
            const z = array[i + 2]; // z
            
            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), (Math.PI / 180) * (x / amount));
            
            // 应用旋转
            const vector = new THREE.Vector3(x, y, z);
            vector.applyQuaternion(quaternion);
            
            array[i] = vector.x;     // 更新 x
            array[i + 1] = vector.y; // 更新 y
            array[i + 2] = vector.z; // 更新 z
        }
        
        positionAttribute.needsUpdate = true; // 标记需要更新
    }

    var render = function () {
        requestAnimationFrame(render);

        donut.rotation.x -= speed * forwards;

        mat -= speed;

        if (mat <= 0) {
            mat = Math.PI;
            forwards *= -1;
        }

        twist(shape, (mat >= Math.PI / 2 ? -280 : 280) * forwards);

        renderer.render(scene, camera);
    };

    render();
}
document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById('footer')) {
        createDonutAnimation('footer');
    }
    if (document.getElementById('logo')) {
        createDonutAnimation('logo');
    }

    if(document.querySelector(".content")) {
        const images = document.querySelector("article .content"); // 根据需要选择您文章中的图片
        // if (!canvas) {
        //     console.log('未找到 id 为 wave 的 canvas 元素');
        //     return; // 如果未找到元素，终止执行
        // }
        // console.log(images); // 检查找到的图片
        const viewer = new Viewer(images, {
            inline: false,
            title: false
        });
    }
    if(document.querySelector(".item")) {
        document.querySelectorAll('.item > a').forEach(item => {
            item.addEventListener('click', function (event) {
                const parentLi = this.parentElement;
        
                // 移除同级兄弟元素的 class
                const siblings = parentLi.parentElement.children; // 获取同级元素
                Array.from(siblings).forEach(sibling => {
                    if (sibling !== parentLi) { // 排除当前元素
                        const siblingAnchor = sibling.querySelector('a'); // 获取兄弟 li 下的 a 元素
                        if (siblingAnchor) {
                            siblingAnchor.classList.remove('item-active'); // 移除类
                        }
                    }
                });
        
                // 移除父li的a的class
                this.classList.add('item-active');
        
                // 阻止默认的跳转行为
                event.preventDefault();
        
                // 获取目标锚点
                const targetId = this.getAttribute('href');
                const escapedId = CSS.escape(targetId.substring(1)); // 去掉 '#' 并转义字符
                const targetElement = document.querySelector(`#${escapedId}`); // 使用安全的选择器
        
                if (targetElement) {
                    // 计算滚动的位置，减去导航的高度
                    const navbarHeight = document.querySelector('.nav-container').offsetHeight; // 替换为您的导航选择器
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 16; // 16 是你可以自定义的偏移量
        
                    // 平滑滚动到目标位置
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // document.addEventListener('scroll', function() {
        //     // 获取所有的目标元素
        //     document.querySelectorAll('.item > a').forEach(item => {
        //         // 获取目标锚点
        //         const targetId = item.getAttribute('href');
        //         const escapedId = CSS.escape(targetId.substring(1)); // 去掉 '#' 并转义字符
        //         const targetElement = document.querySelector(`#${escapedId}`); // 使用安全的选择器
        
        //         if (targetElement) {
        //             // 计算目标元素的位置信息
        //             const navbarHeight = document.querySelector('.nav-container').offsetHeight; // 替换为您的导航选择器
        //             const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY; // 计算目标元素的绝对位置
                    
        //             // 检查目标元素是否滚动到可视区域
        //             if (targetPosition >= navbarHeight && targetPosition <= window.innerHeight - navbarHeight) {
        //                 // 移除同级兄弟元素的 class
        //                 const parentLi = item.parentElement;
        //                 const siblings = parentLi.parentElement.children; // 获取同级元素
        //                 Array.from(siblings).forEach(sibling => {
        //                     const siblingAnchor = sibling.querySelector('a'); // 获取兄弟 li 下的 a 元素
        //                     if (siblingAnchor) {
        //                         siblingAnchor.classList.remove('item-active'); // 移除类
        //                     }
        //                 });
        
        //                 // 当前元素高亮
        //                 item.classList.add('item-active');
        //             } else {
        //                 // 如果不在可视区域内，则移除高亮
        //                 item.classList.remove('item-active');
        //             }
        //         }
        //     });
        // });
        
        
        
    }

    if(document.querySelector(".index-search-dropdown")) {
        // 首页搜索下拉菜单
        const dropdowns = document.querySelectorAll('.index-search-dropdown');
        const selects = document.querySelectorAll('.index-search-select');
        // document.querySelectorAll('.item > a').forEach(item => {
        //     item.addEventListener('click', function(event) {
        selects.forEach(select => {
            // console.log(select);
            select.addEventListener('mouseenter', function(event) {
                const parent = this.parentElement;
                const dropdown = parent.parentElement.querySelector('.index-search-dropdown');
                dropdown.classList.add('show');
            });
            //     select.querySelector('.index-search-dropdown').classList.add('show');
            // });

            select.addEventListener('mouseleave', function(event) {
                const parent = this.parentElement;
                const dropdown = parent.parentElement.querySelector('.index-search-dropdown');
                setTimeout(() => {
                    if (!select.matches(':hover') && !dropdown.matches(':hover')) {
                        dropdown.classList.remove('show');
                    }
                }, 100); // 设置一定的延迟，让下拉可以保持显示
            });
            // 在 inputField 上添加键盘事件监听
            const inputField = document.querySelectorAll('.form-input'); // 假设输入框在 inputField 内
            inputField.forEach(item => {
                item.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') { // 检查是否是回车键
                        event.preventDefault(); // 防止表单默认提交
                        const form = item.parentElement;
                        let query = '';
                        let url = '';
                        query = encodeURIComponent(item.value); // 编码输入
                        url = form.action; // 构造请求地址
                        console.log('XX', item, item.value, form, query, url);
                        // const form = select.parentElement; // 找到包含这个 select 的 form
                        window.open(url + query, '_blank'); // 在新标签页中打开 URL
                    }
                });
            });
        });

        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseleave', () => {
                dropdown.classList.remove('show');
            });
        });

        // 获取所有下拉菜单项
        const dropdownItems = document.querySelectorAll('.index-search-dropdown-item');
        // const inputField = document.querySelector('.index-search-content input[type="text"]');
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                // 获取所点击项的 logo 和名称
                const logo = item.getAttribute('data-logo');
                const name = item.getAttribute('data-name');
                const url = item.getAttribute('data-url');

                const dropdown = item.closest('.index-search-dropdown');
                // 找到 dropdown 的下一个兄弟元素 form
                const prevSibling = dropdown.previousElementSibling;
                // console.log('Next sibling:', prevSibling);
                const form = prevSibling;

                // 找到 index-search-select
                const indexSearchSelect = form.querySelector('.index-search-select');
                
                // 更新 logo 和名称
                const logoImg = indexSearchSelect.querySelector('.index-search-logo');
                const nameSpan = indexSearchSelect.querySelector('.index-search-name-hide');
                // console.log('XX',indexSearchSelect,logoImg,nameSpan)

                if (logoImg && nameSpan) {
                    logoImg.src = logo; // 更新图片
                    nameSpan.textContent = name; // 更新名称
                }
                if(form) {
                    form.action = url; // 更新表单提交地址
                }
            });
        });
        const submitBtns = document.querySelectorAll('.submit-btn');
        submitBtns.forEach(item => {
            item.addEventListener('click', () => {
                const form = item.parentElement;
                const input = item.previousElementSibling;
                let query = '';
                let url = '';
                if(input) {
                    query = encodeURIComponent(input.value); // 编码输入
                }
                if(form) {
                    url = form.action; // 构造请求地址
                }
                if(query && url) {
                    window.open(url + query, '_blank'); // 在新标签页中打开 URL
                }
            })
        });
    }

    // 博客波浪效果
    (function (window, document, undefined) {
        // 获取现有的 canvas 元素
        let canvas = document.getElementById('wave'); // 获取 id 为 wave 的 canvas
        if (!canvas) {
            // console.log('未找到 id 为 wave 的 canvas 元素');
            return; // 如果未找到元素，终止执行
        }

        // 设置 canvas 的宽度和高度
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let c = canvas.getContext('2d', { alpha: true }); // 获取 canvas 上下文
        let postctx = document.createElement('canvas').getContext('2d'); // 创建后处理 canvas
        let vertices = [];

        // Effect Properties
        let vertexCount = 7000;
        let vertexSize = 3;
        let oceanWidth = 204;
        let oceanHeight = -80;
        let gridSize = 32;
        let waveSize = 16;
        let perspective = 100;

        // Common variables
        let depth = (vertexCount / oceanWidth * gridSize);
        let frame = 0;
        let { sin, cos, PI } = Math;

        // Render loop
        let loop = () => {
            // 清空 canvas，实现透明背景
            c.clearRect(0, 0, canvas.width, canvas.height);

            let rad = sin(frame / 100) * PI / 20;
            let rad2 = sin(frame / 50) * PI / 10;
            frame++;

            // 检查并设置 canvas 的尺寸
            if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
                canvas.width = canvas.offsetWidth; // 设置 canvas 的宽度
                canvas.height = canvas.offsetHeight; // 设置 canvas 的高度
            }

            c.save();
            c.translate(canvas.width / 1.55, canvas.height / 2.5);  // 移动坐标轴中心

            c.beginPath();
            vertices.forEach((vertex, i) => {
                let ni = i + oceanWidth;
                let x = vertex[0] - frame % (gridSize * 2);
                let z = vertex[2] - frame * 2 % gridSize + (i % 2 === 0 ? gridSize / 2 : 0);
                let wave = (cos(frame / 45 + x / 50) - sin(frame / 20 + z / 50) + sin(frame / 30 + z * x / 10000));
                let y = vertex[1] + wave * waveSize;
                let a = Math.max(0, 1 - (Math.sqrt(x ** 2 + z ** 2)) / depth);
                let tx, ty, tz;

                y -= oceanHeight;

                // Transformation variables
                tx = x;
                ty = y;
                tz = z;

                // Rotation Y
                tx = x * cos(rad) + z * sin(rad);
                tz = -x * sin(rad) + z * cos(rad);

                x = tx;
                y = ty;
                z = tz;

                // Rotation Z
                tx = x * cos(rad) - y * sin(rad);
                ty = x * sin(rad) + y * cos(rad);

                x = tx;
                y = ty;
                z = tz;

                // Rotation X
                ty = y * cos(rad2) - z * sin(rad2);
                tz = y * sin(rad2) + z * cos(rad2);

                x = tx;
                y = ty;
                z = tz;

                x /= z / perspective;
                y /= z / perspective;

                if (a < 0.01) return;
                if (z < 0) return;

                c.globalAlpha = a;
                c.fillStyle = `hsl(${180 + wave * 20}deg, 100%, 50%)`;
                c.fillRect(x - a * vertexSize / 2, y - a * vertexSize / 2, a * vertexSize, a * vertexSize);
                c.globalAlpha = 1;
            });
            c.restore();

            // Post-processing
            postctx.canvas.width = canvas.width; // 确保后处理 canvas 的尺寸一致
            postctx.canvas.height = canvas.height;
            postctx.drawImage(canvas, 0, 0);

            postctx.globalCompositeOperation = "screen";
            postctx.filter = 'blur(16px)';
            postctx.drawImage(canvas, 0, 0);
            postctx.filter = 'blur(0)';
            postctx.globalCompositeOperation = "source-over";

            requestAnimationFrame(loop);
        }

        // Generating dots
        for (let i = 0; i < vertexCount; i++) {
            let x = i % oceanWidth;
            let y = 0;
            let z = i / oceanWidth >> 0;
            let offset = oceanWidth / 2;
            vertices.push([(-offset + x) * gridSize, y * gridSize, z * gridSize]);
        }

        loop();
    })(this, document);



    // 底部网格鼠标移动效果
    (function (window, document, undefined) {
        if (!document.getElementById('canvas')) {
            // console.log('未找到 id 为 canvas 的 canvas 元素');
            return; // 如果未找到元素，终止执行
        }
        var canvas, ctx, rect, mouse = {
            x: 0,
            y: 0
        },
            repulsion = 5000;
        var points = [];

        function distance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }

        function mouseMoveHandler(e) {
            rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }

        function createGrid() {
            var startX = 0,
                endX = canvas.width,
                startY = 0,
                endY = canvas.height,
                step = 20, // 改网格大小
                xPoints = endX / step,
                yPoints = endY / step;
            for (var i = 0; i <= xPoints; i++) {
                for (var j = 0; j <= yPoints; j++) {
                    points.push({
                        x: (i * step) + startX,
                        y: (j * step) + startY,
                        dx: (i * step) + startX,
                        dy: (j * step) + startY,
                        update: function () {
                            var angle = Math.atan2(this.x - mouse.x, this.y - mouse.y);
                            var dist = repulsion / distance(mouse.x, mouse.y, this.x, this.y);
                            this.x += (Math.sin(angle) * dist) + (this.dx - this.x);
                            this.y += (Math.cos(angle) * dist) + (this.dy - this.y);
                        }
                    });
                }
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < points.length; points[i++].update()) {
                ctx.beginPath();
                ctx.fillStyle = 'rgba(82,121,153,0.5' // 改颜色
                ctx.moveTo(points[i].x, points[i].y);
                ctx.arc(points[i].x, points[i].y, 1, 0, Math.PI * 2, true); // 改点的大小
                ctx.fill();
                ctx.closePath();
            }
        }

        function loop() {
            draw();
            window.requestAnimationFrame(loop);
        }

        function init() {
            canvas = document.getElementById('canvas');
            canvas.height = 800;
            canvas.width = 1400;
            ctx = canvas.getContext('2d');
            createGrid();
            loop();
        }
        window.onmousemove = mouseMoveHandler;
        window.onload = init;
    })(this, document);


    if (document.getElementById('jsi-particle-container')) {
        // 服务的动画
        var RENDERER = {
            PARTICLE_COUNT : 1000,
            PARTICLE_RADIUS : 1,
            MAX_ROTATION_ANGLE : Math.PI / 60,
            TRANSLATION_COUNT : 500,
            
            init : function(strategy){
                this.setParameters(strategy);
                this.createParticles();
                this.setupFigure();
                this.reconstructMethod();
                this.bindEvent();
                this.drawFigure();
            },
            setParameters : function(strategy){
                this.$window = $(window);
                
                this.$container = $('#jsi-particle-container');
                this.width = this.$container.width();
                this.height = this.$container.height();
                
                this.$canvas = $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container);
                this.context = this.$canvas.get(0).getContext('2d');
                
                this.center = {x : this.width / 1.25, y : this.height / 2};
                
                this.rotationX = this.MAX_ROTATION_ANGLE;
                this.rotationY = this.MAX_ROTATION_ANGLE;
                this.strategyIndex = 0;
                this.translationCount = 0;
                this.theta = 0;
                
                this.strategies = strategy.getStrategies();
                this.particles = [];
            },
            createParticles : function(){
                for(var i = 0; i < this.PARTICLE_COUNT; i ++){
                    this.particles.push(new PARTICLE(this.center));
                }
            },
            reconstructMethod : function(){
                this.setupFigure = this.setupFigure.bind(this);
                this.drawFigure = this.drawFigure.bind(this);
                this.changeAngle = this.changeAngle.bind(this);
            },
            bindEvent : function(){
                this.$container.on('click', this.setupFigure);
                this.$container.on('mousemove', this.changeAngle);
            },
            changeAngle : function(event){
                var offset = this.$container.offset(),
                    x = event.clientX - offset.left + this.$window.scrollLeft(),
                    y = event.clientY - offset.top + this.$window.scrollTop();
                
                this.rotationX = (this.center.y - y) / this.center.y * this.MAX_ROTATION_ANGLE;
                this.rotationY = (this.center.x - x) / this.center.x * this.MAX_ROTATION_ANGLE;
            },
            setupFigure : function(){
                for(var i = 0, length = this.particles.length; i < length; i++){
                    this.particles[i].setAxis(this.strategies[this.strategyIndex]());
                }
                if(++this.strategyIndex == this.strategies.length){
                    this.strategyIndex = 0;
                }
                this.translationCount = 0;
            },
            drawFigure : function(){
                requestAnimationFrame(this.drawFigure);
                
                // this.context.fillStyle = 'rgba(0, 0, 0, 0.2)';
                // this.context.fillRect(0, 0, this.width, this.height);
                this.context.clearRect(0, 0, this.width, this.height);
                
                for(var i = 0, length = this.particles.length; i < length; i++){
                    var axis = this.particles[i].getAxis2D(this.theta);
                    
                    this.context.beginPath();
                    this.context.fillStyle = axis.color;
                    this.context.arc(axis.x, axis.y, this.PARTICLE_RADIUS, 0, Math.PI * 2, false);
                    this.context.fill();
                }
                this.theta++;
                this.theta %= 360;
                
                for(var i = 0, length = this.particles.length; i < length; i++){
                    this.particles[i].rotateX(this.rotationX);
                    this.particles[i].rotateY(this.rotationY);
                }
                this.translationCount++;
                this.translationCount %= this.TRANSLATION_COUNT;
                
                if(this.translationCount == 0){
                    this.setupFigure();
                }
            }
        };
        var STRATEGY = {
            SCATTER_RADIUS :150,
            CONE_ASPECT_RATIO : 1.5,
            RING_COUNT : 5,
            
            getStrategies : function(){
                var strategies = [];
                
                for(var i in this){
                    if(this[i] == arguments.callee || typeof this[i] != 'function'){
                        continue;
                    }
                    strategies.push(this[i].bind(this));
                }
                return strategies;
            },
            createSphere : function(){
                var cosTheta = Math.random() * 2 - 1,
                    sinTheta = Math.sqrt(1 - cosTheta * cosTheta),
                    phi = Math.random() * 2 * Math.PI;
                    
                return {
                    x : this.SCATTER_RADIUS * sinTheta * Math.cos(phi),
                    y : this.SCATTER_RADIUS * sinTheta * Math.sin(phi),
                    z : this.SCATTER_RADIUS * cosTheta,
                    hue : Math.round(phi / Math.PI * 30)
                };
            },
            createTorus : function(){
                var theta = Math.random() * Math.PI * 2,
                    x = this.SCATTER_RADIUS + this.SCATTER_RADIUS / 6 * Math.cos(theta),
                    y = this.SCATTER_RADIUS / 6 * Math.sin(theta),
                    phi = Math.random() * Math.PI * 2;
                
                return {
                    x : x * Math.cos(phi),
                    y : y,
                    z : x * Math.sin(phi),
                    hue : Math.round(phi / Math.PI * 30)
                };
            },
            createCone : function(){
                var status = Math.random() > 1 / 3,
                    x,
                    y,
                    phi = Math.random() * Math.PI * 2,
                    rate = Math.tan(30 / 180 * Math.PI) / this.CONE_ASPECT_RATIO;
                
                if(status){
                    y = this.SCATTER_RADIUS * (1 - Math.random() * 2);
                    x = (this.SCATTER_RADIUS - y) * rate;
                }else{
                    y = -this.SCATTER_RADIUS;
                    x = this.SCATTER_RADIUS * 2 * rate * Math.random();
                }
                return {
                    x : x * Math.cos(phi),
                    y : y,
                    z : x * Math.sin(phi),
                    hue : Math.round(phi / Math.PI * 30)
                };
            },
            createVase : function(){
                var theta = Math.random() * Math.PI,
                    x = Math.abs(this.SCATTER_RADIUS * Math.cos(theta) / 2) + this.SCATTER_RADIUS / 8,
                    y = this.SCATTER_RADIUS * Math.cos(theta) * 1.2,
                    phi = Math.random() * Math.PI * 2;
                
                return {
                    x : x * Math.cos(phi),
                    y : y,
                    z : x * Math.sin(phi),
                    hue : Math.round(phi / Math.PI * 30)
                };
            }
        };
        var PARTICLE = function(center){
            this.center = center;
            this.init();
        };
        PARTICLE.prototype = {
            SPRING : 0.01,
            FRICTION : 0.9,
            FOCUS_POSITION : 300,
            COLOR : 'hsl(%hue, 100%, 70%)',
            
            init : function(){
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.vx = 0;
                this.vy = 0;
                this.vz = 0;
                this.color;
            },
            setAxis : function(axis){
                this.translating = true;
                this.nextX = axis.x;
                this.nextY = axis.y;
                this.nextZ = axis.z;
                this.hue = axis.hue;
            },
            rotateX : function(angle){
                var sin = Math.sin(angle),
                    cos = Math.cos(angle),
                    nextY = this.nextY * cos - this.nextZ * sin,
                    nextZ = this.nextZ * cos + this.nextY * sin,
                    y = this.y * cos - this.z * sin,
                    z = this.z * cos + this.y * sin;
                    
                this.nextY = nextY;
                this.nextZ = nextZ;
                this.y = y;
                this.z = z;
            },
            rotateY : function(angle){
                var sin = Math.sin(angle),
                    cos = Math.cos(angle),
                    nextX = this.nextX * cos - this.nextZ * sin,
                    nextZ = this.nextZ * cos + this.nextX * sin,
                    x = this.x * cos - this.z * sin,
                    z = this.z * cos + this.x * sin;
                    
                this.nextX = nextX;
                this.nextZ = nextZ;
                this.x = x;
                this.z = z;
            },
            rotateZ : function(angle){
                var sin = Math.sin(angle),
                    cos = Math.cos(angle),
                    nextX = this.nextX * cos - this.nextY * sin,
                    nextY = this.nextY * cos + this.nextX * sin,
                    x = this.x * cos - this.y * sin,
                    y = this.y * cos + this.x * sin;
                    
                this.nextX = nextX;
                this.nextY = nextY;
                this.x = x;
                this.y = y;
            },
            getAxis3D : function(){
                this.vx += (this.nextX - this.x) * this.SPRING;
                this.vy += (this.nextY - this.y) * this.SPRING;
                this.vz += (this.nextZ - this.z) * this.SPRING;
                
                this.vx *= this.FRICTION;
                this.vy *= this.FRICTION;
                this.vz *= this.FRICTION;
                
                this.x += this.vx;
                this.y += this.vy;
                this.z += this.vz;
                
                return {x : this.x, y : this.y, z : this.z};
            },
            getAxis2D : function(theta){
                var axis = this.getAxis3D(),
                    scale = this.FOCUS_POSITION / (this.FOCUS_POSITION + axis.z);
                    
                return {x : this.center.x + axis.x * scale, y : this.center.y - axis.y * scale, color : this.COLOR.replace('%hue', this.hue + theta)};
            }
        };
        $(function(){
            RENDERER.init(STRATEGY);
        });
    }


    if (document.getElementById('security-global')) {
        // 地球动画，网络安全
        var controls;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        var innerColor = 0xff0000,
            outerColor = 0xff9900;
        var innerSize = 55,
            outerSize = 60;    
    
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0); // background
    
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.className = 'security-global'; // 添加class名
        document.body.appendChild(renderer.domElement);  // 生成到哪个元素里面
    
        camera.position.z = -400;
        // Mesh
        var group = new THREE.Group();
        scene.add(group);
    
        // Lights
        var light = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(light);
    
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 128, 128);
        scene.add(directionalLight);
    
        // Sphere Wireframe Inner
        var sphereWireframeInner = new THREE.Mesh(
            new THREE.IcosahedronGeometry(innerSize, 2),
            new THREE.MeshLambertMaterial({ 
                color: innerColor,
                wireframe: true,
                transparent: true,
                shininess: 0
            })
        );
        scene.add(sphereWireframeInner);
    
        // Sphere Wireframe Outer
        var sphereWireframeOuter = new THREE.Mesh(
            new THREE.IcosahedronGeometry(outerSize, 3),
            new THREE.MeshLambertMaterial({ 
                color: outerColor,
                wireframe: true,
                transparent: true,
                shininess: 0 
            })
        );
        scene.add(sphereWireframeOuter);
    
        // Sphere Glass Inner
        var sphereGlassInner = new THREE.Mesh(
            new THREE.SphereGeometry(innerSize, 32, 32),
            new THREE.MeshPhongMaterial({ 
                color: innerColor,
                transparent: true,
                shininess: 25,
                opacity: 0.3,
            })
        );
        scene.add(sphereGlassInner);
    
        // Sphere Glass Outer
        var sphereGlassOuter = new THREE.Mesh(
            new THREE.SphereGeometry(outerSize, 32, 32),
            new THREE.MeshPhongMaterial({ 
                color: outerColor,
                transparent: true,
                shininess: 25,
                opacity: 0.3,
            })
        );
        scene.add(sphereGlassOuter);
    
        // Particles Outer
        var outerGeometry = new THREE.BufferGeometry();
        var outerVertices = [];
        for (let i = 0; i < 35000; i++) {
            var x = -1 + Math.random() * 2;
            var y = -1 + Math.random() * 2;
            var z = -1 + Math.random() * 2;
            var d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
            x *= d;
            y *= d;
            z *= d;
    
            outerVertices.push(x * outerSize, y * outerSize, z * outerSize);
        }
        outerGeometry.setAttribute('position', new THREE.Float32BufferAttribute(outerVertices, 3));
    
        var particlesOuter = new THREE.Points(outerGeometry, new THREE.PointsMaterial({
            size: 0.1,
            color: outerColor,
            transparent: true,
        }));
        scene.add(particlesOuter);
    
        // Particles Inner
        var innerGeometry = new THREE.BufferGeometry();
        var innerVertices = [];
        for (let i = 0; i < 35000; i++) {
            var x = -1 + Math.random() * 2;
            var y = -1 + Math.random() * 2;
            var z = -1 + Math.random() * 2;
            var d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
            x *= d;
            y *= d;
            z *= d;
    
            innerVertices.push(x * innerSize, y * innerSize, z * innerSize);
        }
        innerGeometry.setAttribute('position', new THREE.Float32BufferAttribute(innerVertices, 3));
    
        var particlesInner = new THREE.Points(innerGeometry, new THREE.PointsMaterial({
            size: 0.1,
            color: innerColor,
            transparent: true,
        }));
        scene.add(particlesInner);
    
        // Starfield
        var starGeometry = new THREE.BufferGeometry();
        var starVertices = [];
        for (let i = 0; i < 5000; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2000 - 1000;
            vertex.y = Math.random() * 2000 - 1000;
            vertex.z = Math.random() * 2000 - 1000;
            starVertices.push(vertex.x, vertex.y, vertex.z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    
        var starField = new THREE.Points(starGeometry, new THREE.PointsMaterial({
            size: 2,
            color: 0xffff99
        }));
        scene.add(starField);
    
        camera.position.z = -110;
    
        var time = new THREE.Clock();
    
        var render = function () {  
            camera.lookAt(scene.position);
    
            sphereWireframeInner.rotation.x += 0.002;
            sphereWireframeInner.rotation.z += 0.002;
            
            sphereWireframeOuter.rotation.x += 0.001;
            sphereWireframeOuter.rotation.z += 0.001;
            
            sphereGlassInner.rotation.y += 0.005;
            sphereGlassInner.rotation.z += 0.005;
    
            sphereGlassOuter.rotation.y += 0.01;
            sphereGlassOuter.rotation.z += 0.01;
    
            particlesOuter.rotation.y += 0.0005;
            particlesInner.rotation.y -= 0.002;
            
            starField.rotation.y -= 0.002;
    
            var innerShift = Math.abs(Math.cos(((time.getElapsedTime() + 2.5) / 20)));
            var outerShift = Math.abs(Math.cos(((time.getElapsedTime() + 5) / 10)));
    
            starField.material.color.setHSL(Math.abs(Math.cos((time.getElapsedTime() / 10))), 1, 0.5);
    
            sphereWireframeOuter.material.color.setHSL(0, 1, outerShift);
            sphereGlassOuter.material.color.setHSL(0, 1, outerShift);
            particlesOuter.material.color.setHSL(0, 1, outerShift);
    
            sphereWireframeInner.material.color.setHSL(0.08, 1, innerShift);
            particlesInner.material.color.setHSL(0.08, 1, innerShift);
            sphereGlassInner.material.color.setHSL(0.08, 1, innerShift);
    
            sphereWireframeInner.material.opacity = Math.abs(Math.cos((time.getElapsedTime() + 0.5) / 0.9) * 0.5);
            sphereWireframeOuter.material.opacity = Math.abs(Math.cos(time.getElapsedTime() / 0.9) * 0.5);
    
            directionalLight.position.x = Math.cos(time.getElapsedTime() / 0.5) * 128;
            directionalLight.position.y = Math.cos(time.getElapsedTime() / 0.5) * 128;
            directionalLight.position.z = Math.sin(time.getElapsedTime() / 0.5) * 128;
    
            renderer.render(scene, camera);
            requestAnimationFrame(render);  
        };
    
        render();
    
        // Mouse and resize events
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
    
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    
        function onDocumentMouseMove(event) {
            mouseX = event.clientX - window.innerWidth / 2;
            mouseY = event.clientY - window.innerHeight / 2;
        }
    }
    
    if (document.getElementById('web3')) {
        var isDarkMode = document.documentElement.classList.contains('dark'); // 检查是否包含dark类
        // console.log(isDarkMode)
        // 区块链
        if(isDarkMode) {
            VANTA.NET({
                el: "#web3",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x265b5b,
                backgroundColor: 0x000000,
                points: 15.00,
                maxDistance: 22.00
            })
        }
        else {
            VANTA.NET({
                el: "#web3",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x26caab,
                backgroundColor: 0xffffff, // 如果有dark类则背景黑色，否则白色
                points: 15.00,
                maxDistance: 22.00
            })
        }
        // 点击切换主题的事件监听
        document.querySelector('.theme-toggle').addEventListener('click', function() {
           // 切换dark类
            // console.log(' dark')
           if (!document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
            } else {
                document.documentElement.classList.add('dark');
            }
     

           // 更新isDarkMode状态
           isDarkMode = document.documentElement.classList.contains('dark');

           // 更新Vanta.js的颜色和背景色
           
            if(isDarkMode) {
                VANTA.NET({
                    el: "#web3",
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0x26caab,
                    backgroundColor: 0x000000,
                    points: 15.00,
                    maxDistance: 22.00
                })
            }
            else {
                VANTA.NET({
                    el: "#web3",
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0x26caab,
                    backgroundColor: 0xffffff, // 如果有dark类则背景黑色，否则白色
                    points: 15.00,
                    maxDistance: 22.00
                })
            }
       });
    }
    
});