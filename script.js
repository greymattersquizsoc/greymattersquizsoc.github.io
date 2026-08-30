// ==========================================
// GREY MATTERS - GLOBAL JAVASCRIPT
// ==========================================

// --- 1. Precision Cursor Physics ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Inner dot snaps instantly
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        // Outer ring trails behind
        cursorRing.animate({
            left: `${mouseX}px`,
            top: `${mouseY}px`
        }, { duration: 150, fill: "forwards", easing: "ease-out" });
    });

    const interactiveTargets = document.querySelectorAll('a, button, .roadmap-step');
    interactiveTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursorDot.classList.add('target-locked');
            cursorRing.classList.add('target-locked');
        });
        target.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('target-locked');
            cursorRing.classList.remove('target-locked');
        });
    });
}

// --- 2. Cinematic Scroll Reveals ---
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0) {
    const revealOptions = {
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// --- 3. Elegant Analysis Walkthrough (Home Page Only) ---
const executeBtn = document.getElementById('execute-btn');

if (executeBtn) {
    const breakdownContainer = document.getElementById('breakdown-sequence');
    const breakdownRows = document.querySelectorAll('.breakdown-row');
    const finalAnswerBlock = document.getElementById('b-answer');
    const targets = document.querySelectorAll('.muted-target');

    executeBtn.addEventListener('click', function() {
        this.style.display = 'none';
        breakdownContainer.className = 'breakdown-visible';

        let delay = 300;

        breakdownRows.forEach((row, index) => {
            setTimeout(() => {
                row.classList.add('show');
                if (index === 0) {
                    targets.forEach(target => target.classList.add('active'));
                }
            }, delay);
            delay += 1500; 
        });

        setTimeout(() => {
            finalAnswerBlock.classList.add('show');
        }, delay + 500);
    });
}

// --- 4. The Advanced "Neural Web" Physics Engine ---
const canvas = document.getElementById('particle-canvas');

if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = {
        x: null,
        y: null,
        radius: (canvas.height / 80) * (canvas.width / 80)
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    // Spawn new data nodes exactly at the cursor
    window.addEventListener('click', function(event) {
        if (!particlesArray) return;
        
        for (let i = 0; i < 5; i++) {
            let size = (Math.random() * 1.5) + 0.5;
            let directionX = (Math.random() * 10) - 5; // A strong outward burst
            let directionY = (Math.random() * 10) - 5;
            
            // Notice the 'true' at the end - this grants them spawn immunity!
            particlesArray.push(new Particle(event.clientX, event.clientY, directionX, directionY, size, true));
        }
        
        let maxParticles = ((canvas.height * canvas.width) / 8000) + 400; 
        if (particlesArray.length > maxParticles) {
            particlesArray.splice(0, 5); 
        }
    });

    window.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse.radius = (canvas.height / 80) * (canvas.width / 80);
        init();
    });

    class Particle {
        // We added a flag to check if the particle was clicked into existence
        constructor(x, y, directionX, directionY, size, isClickSpawn = false) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.density = (Math.random() * 30) + 1; 
            
            // Gives clicked particles 40 frames of immunity from being pushed away
            this.immunity = isClickSpawn ? 40 : 0; 
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fill();
        }
        
        update() {
            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

            // If it is a new particle, it uses immunity to burst out properly
            if (this.immunity > 0) {
                this.immunity--;
                this.x += this.directionX;
                this.y += this.directionY;
                
                // Friction: smoothly slows down the burst over the 40 frames
                this.directionX *= 0.92;
                this.directionY *= 0.92;
                
            } else {
                // Normal Collision Detection & Repulsion
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (mouse.x != null && distance < mouse.radius + this.size) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (mouse.radius - distance) / mouse.radius;
                    let dirX = forceDirectionX * force * this.density;
                    let dirY = forceDirectionY * force * this.density;
                    
                    this.x -= dirX;
                    this.y -= dirY;
                } else {
                    // Ensures they don't freeze completely if friction made them too slow
                    if (Math.abs(this.directionX) < 0.1) this.directionX = (Math.random() > 0.5 ? 0.2 : -0.2);
                    if (Math.abs(this.directionY) < 0.1) this.directionY = (Math.random() > 0.5 ? 0.2 : -0.2);
                    
                    this.x += this.directionX;
                    this.y += this.directionY;
                }
            }
            
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 8000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 1.5) + 0.5;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.5) - 0.25;
            let directionY = (Math.random() * 0.5) - 0.25;
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size));
        }
    }

    function connect() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                             + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                    let opacityValue = 1 - (distance / 10000);
                    ctx.strokeStyle = 'rgba(255, 255, 255, ' + (opacityValue * 0.3) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    init();
    animate();
}

// NAV BAR SCROLL REACTION
document.addEventListener('DOMContentLoaded', () => {
    // Looks for 'nav' first, then '.global-nav'
    const navBar = document.querySelector('nav') || document.querySelector('.global-nav'); 

    if (navBar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navBar.classList.add('scrolled');
            } else {
                navBar.classList.remove('scrolled');
            }
        });
    } else {
        console.error("SYSTEM ALERT: Navigation bar not found by scroll script.");
    }
});