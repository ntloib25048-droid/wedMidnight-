const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width, height;

let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    pointer.x = width / 2;
    pointer.y = height / 2;
});
window.dispatchEvent(new Event('resize'));

window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
});

window.addEventListener('touchmove', (e) => {
    pointer.x = e.touches[0].clientX;
    pointer.y = e.touches[0].clientY;
});

const N = 60; 
const elems = [];
for (let i = 0; i < N; i++) {
    elems.push({ x: width / 2, y: height / 2 });
}

let frm = 0;
let rad = 0;
const radm = 150; 

function run() {
    requestAnimationFrame(run);
    ctx.clearRect(0, 0, width, height);

    let e0 = elems[0];
    const ax = (Math.cos(3 * frm) * rad * width) / height;
    const ay = (Math.sin(4 * frm) * rad * height) / width;

    e0.x += (ax + pointer.x - e0.x) / 10;
    e0.y += (ay + pointer.y - e0.y) / 10;

    for (let i = 1; i < N; i++) {
        let e = elems[i];
        let ep = elems[i - 1];
        const a = Math.atan2(e.y - ep.y, e.x - ep.x);

        e.x += (ep.x - e.x + (Math.cos(a) * (100 - i)) / 5) / 4;
        e.y += (ep.y - e.y + (Math.sin(a) * (100 - i)) / 5) / 4;
    }

    // ==========================================
    // BƯỚC 1: VẼ CÁNH GAI CONG MẢNH LÉT (Lớp lót dưới)
    // ==========================================
    for (let i = N - 1; i >= 1; i--) {
        let e = elems[i];
        let ep = elems[i - 1]; 
        
        const a = Math.atan2(ep.y - e.y, ep.x - e.x); 
        const s = (162 + 4 * (1 - i)) / 50; 

        ctx.save();
        ctx.translate((ep.x + e.x) / 2, (ep.y + e.y) / 2);
        ctx.rotate(a);
        ctx.scale(s, s);

        let wingLen = 0;
        if (i >= 5 && i <= 25) {
            wingLen = Math.sin((i - 5) / 20 * Math.PI) * 90; 
        } else if (i >= 38 && i <= 55) {
            wingLen = Math.sin((i - 38) / 17 * Math.PI) * 55; 
        }

        if (wingLen > 0) {
            ctx.fillStyle = '#444'; // Xám đậm
            
            // Cánh Trái: gốc hẹp, lượn cong mảnh khảnh ra sau
            ctx.beginPath();
            ctx.moveTo(0, 2); // Nở gốc 2px
            ctx.quadraticCurveTo(-15, -wingLen * 0.6, -wingLen, -wingLen); // Lượn cong vút ra
            ctx.quadraticCurveTo(-5, -wingLen * 0.6, 0, -2); // Đường dưới ép sát đường trên để tạo độ mỏng
            ctx.fill();

            // Cánh Phải
            ctx.beginPath();
            ctx.moveTo(0, -2);
            ctx.quadraticCurveTo(-15, wingLen * 0.6, -wingLen, wingLen);
            ctx.quadraticCurveTo(-5, wingLen * 0.6, 0, 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // ==========================================
    // BƯỚC 2: VẼ XƯƠNG SỐNG GRADIENT (Đè lên lớp cánh)
    // ==========================================
    for (let i = N - 1; i >= 1; i--) {
        let e = elems[i];
        let ep = elems[i - 1]; 
        
        const a = Math.atan2(ep.y - e.y, ep.x - e.x); 
        const s = (162 + 4 * (1 - i)) / 50; 

        ctx.save();
        ctx.translate((ep.x + e.x) / 2, (ep.y + e.y) / 2);
        ctx.rotate(a);
        ctx.scale(s, s);

        let grad = ctx.createLinearGradient(-6, 0, 10, 0);
        grad.addColorStop(0, '#222'); 
        grad.addColorStop(1, '#eee'); 

        ctx.beginPath();
        ctx.moveTo(10, 0);        
        ctx.lineTo(-4, 6);       
        ctx.quadraticCurveTo(-1, 0, -5, 0); 
        ctx.quadraticCurveTo(-1, 0, -4, -6);      
        ctx.closePath();

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
    }

    // ==========================================
    // BƯỚC 3: VẼ ĐẦU RỒNG
    // ==========================================
    let head = elems[0];
    let neck = elems[1];
    const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);
    
    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(headAngle);
    ctx.scale(2.5, 2.5); 
    
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(2, 4);
    ctx.lineTo(-4, 6);
    ctx.lineTo(-8, 9); 
    ctx.lineTo(-5, 3);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-5, -3);
    ctx.lineTo(-8, -9); 
    ctx.lineTo(-4, -6);
    ctx.lineTo(2, -4);
    ctx.closePath();
    
    ctx.fillStyle = '#000';
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(2, -2.5, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(2, 2.5, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // ==========================================
    // TỰ LƯỢN VÒNG VÒNG
    // ==========================================
    if (rad < radm) rad++;
    frm += 0.003;
    
    if (rad > 60) {
        pointer.x += (width / 2 - pointer.x) * 0.05;
        pointer.y += (height / 2 - pointer.y) * 0.05;
    }
}

run();