const DECISION_THRESHOLD = 75;
let isAnimating = false;
let pullDeltaX = 0; // Distance that the card has been pulled

function startDrag(event) {
  if (isAnimating) return;

  // Get the first article element
  const actualCard = event.target.closest("article");
  if (!actualCard) return;

  // Get initial position of mouse
  const startX = event.pageX ?? event.touches[0].pageX;

  // Listen the mouse and touch movements
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  document.addEventListener("touchmove", onMove, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });

  function onMove(event) {
    // Current position of mouse
    const currentX = event.pageX ?? event.touches[0].pageX;
    // The distance between the initial and current position
    pullDeltaX = currentX - startX;

    // There is no distance
    if (pullDeltaX === 0) return;

    // Change the flag to indicate we are animating
    isAnimating = true;

    // Calculate the rotation of the card using the distance
    const deg = pullDeltaX / 14;
    // Apply the transformation to the card
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
    // Change the cursor to grabbing
    actualCard.style.cursor = "grabbing";

    // Change opacity of the choice info
    const opacity = Math.abs(pullDeltaX) / 100;
    const isRight = pullDeltaX > 0;

    const choiceElement = isRight
      ? actualCard.querySelector(".choice.like")
      : actualCard.querySelector(".choice.nope");

    choiceElement.style.opacity = opacity;
  }

  function onEnd(event) {
    // Remove the event listeners
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onEnd);

    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;

    if (decisionMade) {
      const goRight = pullDeltaX >= 0;

      // Add class according to the decision
      actualCard.classList.add(goRight ? "go-right" : "go-left");
      actualCard.addEventListener("transitionend", () => {
        actualCard.remove();
      });
    } else {
      actualCard.classList.add("reset");
      actualCard.classList.remove("go-right", "go-left");
      actualCard.querySelectorAll(".choice").forEach((choice) => {
        choice.style.opacity = 0;
      });
    }

    // reset the variables
    actualCard.addEventListener("transitionend", () => {
      actualCard.removeAttribute("style");
      actualCard.classList.remove("reset");
      pullDeltaX = 0;
      isAnimating = false;
    });

    // reset the choice info opacity
    actualCard
      .querySelectorAll(".choice")
      .forEach((element) => (element.style.opacity = 0));
  }
}

document.addEventListener("mousedown", startDrag);
document.addEventListener("touchstart", startDrag, { passive: true });
