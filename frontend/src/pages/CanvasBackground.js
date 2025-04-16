// // CanvasBackground.js
// import React, { useEffect, useRef } from 'react';

// const CanvasBackground = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     let stars = [];
//     let planets = [];

//     const createStars = () => {
//       for (let i = 0; i < 100; i++) {
//         stars.push({
//           x: Math.random() * canvas.width,
//           y: Math.random() * canvas.height,
//           radius: Math.random() * 2,
//           speed: Math.random() * 0.5 + 0.1,
//         });
//       }
//     };

//     const createPlanets = () => {
//       for (let i = 0; i < 5; i++) {
//         planets.push({
//           x: Math.random() * canvas.width,
//           y: Math.random() * canvas.height,
//           radius: Math.random() * 20 + 10,
//           speed: Math.random() * 0.5 + 0.1,
//         });
//       }
//     };

//     const drawStars = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.fillStyle = 'white';
//       stars.forEach(star => {
//         ctx.beginPath();
//         ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
//         ctx.fill();
//       });
//     };

//     const drawPlanets = () => {
//       ctx.fillStyle = 'blue';
//       planets.forEach(planet => {
//         ctx.beginPath();
//         ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
//         ctx.fill();
//       });
//     };

//     const animate = () => {
//       drawStars();
//       drawPlanets();
//       stars.forEach(star => {
//         star.y += star.speed;
//         if (star.y > canvas.height) {
//           star.y = 0;
//           star.x = Math.random() * canvas.width;
//         }
//       });
//       planets.forEach(planet => {
//         planet.x += planet.speed;
//         if (planet.x > canvas.width) {
//           planet.x = 0;
//           planet.y = Math.random() * canvas.height;
//         }
//       });
//       requestAnimationFrame(animate);
//     };

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     createStars();
//     createPlanets();
//     animate();

//     return () => {
//       stars = [];
//       planets = [];
//     };
//   }, []);

//   return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
// };

// export default CanvasBackground;



// CanvasBackground.js
import React, { useEffect, useRef } from 'react';

const CanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let planets = [];

    const createStars = () => {
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2,
          speed: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const createPlanets = () => {
      for (let i = 0; i < 5; i++) {
        planets.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 20 + 10,
          speed: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawPlanets = () => {
      ctx.fillStyle = 'blue';
      planets.forEach(planet => {
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      drawStars();
      drawPlanets();
      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      planets.forEach(planet => {
        planet.x += planet.speed;
        if (planet.x > canvas.width) {
          planet.x = 0;
          planet.y = Math.random() * canvas.height;
        }
      });
      requestAnimationFrame(animate);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
    createPlanets();
    animate();

    return () => {
      stars = [];
      planets = [];
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
};

export default CanvasBackground;