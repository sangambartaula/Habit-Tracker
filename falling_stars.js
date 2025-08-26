// 🌠 Falling Star Generator
document.addEventListener("DOMContentLoaded", () => {
    const starsContainer = document.querySelector(".stars-container");
  
    function createStar() {
      const star = document.createElement("div");
      star.classList.add("star");
  
      star.style.left = Math.random() * 100 + "vw";
      star.style.animationDuration = Math.random() * 2 + 2 + "s";
  
      starsContainer.appendChild(star);
  
      setTimeout(() => {
        star.remove();
      }, 4000);
    }
  
    setInterval(createStar, 100);
  });
  